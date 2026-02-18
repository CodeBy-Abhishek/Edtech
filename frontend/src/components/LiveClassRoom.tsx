"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '@/context/SocketContext';

interface Peer {
    peerID: string;
    peer: RTCPeerConnection;
}

interface LiveClassRoomProps {
    roomId: string;
}

const LiveClassRoom: React.FC<LiveClassRoomProps> = ({ roomId }) => {
    const { socket } = useSocket();
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [peers, setPeers] = useState<Peer[]>([]); // To track connecting peers
    const [remoteStreams, setRemoteStreams] = useState<{ peerID: string; stream: MediaStream }[]>([]);

    // Refs to keep track without re-renders affecting logic
    const peersRef = useRef<Peer[]>([]);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                const userStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
                setStream(userStream);
                streamRef.current = userStream;

                if (!socket) return;

                // Join the room for signaling
                socket.emit('join_room', roomId);
                socket.emit('join_web_rtc', roomId);

                socket.on('all_users', (users: string[]) => {
                    const peers: Peer[] = [];
                    users.forEach(userID => {
                        const peer = createPeer(userID, socket.id!, userStream);
                        peersRef.current.push({
                            peerID: userID,
                            peer,
                        });
                        peers.push({ // Just for state if needed, mostly used refs
                            peerID: userID,
                            peer
                        });
                    });
                    setPeers(prev => [...prev, ...peers]);
                });

                socket.on('user_joined', (payload: { userId: string }) => {
                    // In this mesh implementation, the NEW user initiates offers to existing users.
                    // Existing users just wait for "offer". 
                    // However, often in mesh, you might want bi-directional initiation flexibility,
                    // but here we rely on the new user sending offers (as per 'all_users' logic).
                    console.log("User joined room:", payload.userId);
                });

                socket.on('offer', handleReceiveOffer);
                socket.on('answer', handleReceiveAnswer);
                socket.on('ice_candidate', (payload: { candidate: RTCIceCandidate; caller: string }) => {
                    const item = peersRef.current.find(p => p.peerID === payload.caller);
                    if (item) {
                        item.peer.addIceCandidate(new RTCIceCandidate(payload.candidate))
                            .catch(e => console.error("Error adding ice candidate:", e));
                    }
                });
                socket.on('user_disconnected', (id: string) => {
                    // TODO: Cleanup peer
                });

            } catch (err) {
                console.error("Error accessing media devices:", err);
            }
        };

        init();

        return () => {
            // Cleanup: stop tracks, close peers
            streamRef.current?.getTracks().forEach(track => track.stop());
            peersRef.current.forEach(p => p.peer.close());
        };
    }, [roomId, socket]);

    function createPeer(userToSignal: string, callerID: string, stream: MediaStream) {
        const peer = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:global.stun.twilio.com:3478" }
            ]
        });

        stream.getTracks().forEach(track => peer.addTrack(track, stream));

        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socket?.emit("ice_candidate", {
                    target: userToSignal,
                    caller: socket.id, // Add caller ID so receiver knows who sent it
                    candidate: event.candidate,
                });
            }
        };

        peer.ontrack = (event) => {
            console.log("Received remote track from:", userToSignal);
            setRemoteStreams(prev => {
                // Check if we already have this peer's stream
                if (prev.some(p => p.peerID === userToSignal)) return prev;
                return [...prev, { peerID: userToSignal, stream: event.streams[0] }];
            });
        };

        peer.createOffer().then(offer => {
            peer.setLocalDescription(offer);
            socket?.emit("offer", {
                target: userToSignal,
                caller: callerID,
                sdp: offer
            });
        });

        return peer;
    }

    function addPeer(incomingSignal: any, callerID: string, stream: MediaStream) {
        const peer = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" }
            ]
        });

        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socket?.emit("ice_candidate", {
                    target: callerID,
                    caller: socket.id, // Add caller ID
                    candidate: event.candidate,
                });
            }
        };

        peer.ontrack = (event) => {
            console.log("Received remote track (answerer side) from:", callerID);
            setRemoteStreams(prev => {
                if (prev.some(p => p.peerID === callerID)) return prev;
                return [...prev, { peerID: callerID, stream: event.streams[0] }];
            });
        };

        // Add our stream
        stream.getTracks().forEach(track => peer.addTrack(track, stream));

        // Signal
        peer.setRemoteDescription(new RTCSessionDescription(incomingSignal));
        peer.createAnswer().then(answer => {
            peer.setLocalDescription(answer);
            socket?.emit("answer", {
                target: callerID,
                caller: socket.id,
                sdp: answer
            });
        });

        return peer;
    }

    const handleReceiveOffer = (payload: { caller: string; sdp: RTCSessionDescriptionInit }) => {
        if (!streamRef.current) return;
        const peer = addPeer(payload.sdp, payload.caller, streamRef.current);
        peersRef.current.push({
            peerID: payload.caller,
            peer,
        });
        setPeers(prev => [...prev, { peerID: payload.caller, peer }]);
    };

    const handleReceiveAnswer = (payload: { caller: string; sdp: RTCSessionDescriptionInit }) => {
        const item = peersRef.current.find(p => p.peerID === payload.caller);
        if (item) {
            item.peer.setRemoteDescription(new RTCSessionDescription(payload.sdp));
        }
    };

    const handleReceiveIceCandidate = (payload: { candidate: RTCIceCandidate; target: string }) => {
        // This payload comes to us, but who sent it? 
        // In strict relay we might need sender ID. 
        // Assuming backend forwards from sender, but wait... 
        // Backend: socket.on('ice_candidate', (payload) => io.to(payload.target).emit('ice_candidate', payload));
        // The payload received is exactly what was sent.
        // We need to know who it is from to find the correct peer?
        // Actually, usually you include senderID in the candidate payload or wrap it.
        // Let's check backend... backend just passes through. 
        // FIX: We need identifying info in the candidate message OR try to add to all peers (bad).
        // Better: In backend, include `caller: socket.id` in metadata?
        // Or here, when sending candidate, we should wrap it. 
        // Current Backend implementation:
        // socket.on('ice_candidate', (payload) => { this.io.to(payload.target).emit('ice_candidate', payload); });
        // It does NOT add the sender ID. This is a problem if we have multiple peers.
        // Wait, `payload` in `handleReceiveIceCandidate` will be what we received. 
        // If `createPeer` sent `{ target, candidate }`, we receive `{ target, candidate }`. 
        // We don't know who sent it! 
        // We should update the payload structure in `createPeer` / `addPeer` to include `caller: socket.id`.
        // But the backend just forwards. 
        // Let's Assume the backend forwards it as is. 
        // Check backend: backend doesn't modify payload.
        // So I should modify the sender to send `{ target, candidate, caller: socket.id }`.
        // Backend type definition might valid it? 
        // backend: `socket.on('ice_candidate', (payload: { target: string; candidate: RTCIceCandidate })`
        // It only types `target` and `candidate`. But JS objects are open. I can add `caller`.
    };

    // REDEFINING handleReceiveIceCandidate with the assumption I can fix the sender
    const handleReceiveIceCandidateFixed = (payload: { candidate: RTCIceCandidate; caller: string }) => { // Caller added
        const item = peersRef.current.find(p => p.peerID === payload.caller);
        if (item) {
            item.peer.addIceCandidate(new RTCIceCandidate(payload.candidate));
        }
    }


    return (
        <div className="flex flex-col gap-4 p-4 h-full">
            <h2 className="text-2xl font-bold">Live Class: {roomId}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Local Stream */}
                <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                    <video
                        muted
                        ref={ref => { if (ref && stream) ref.srcObject = stream; }}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover transform scale-x-[-1]" // Mirror
                    />
                    <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
                        You
                    </div>
                </div>

                {/* Remote Streams */}
                {remoteStreams.map(remote => (
                    <div key={remote.peerID} className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                        <video
                            ref={ref => { if (ref) ref.srcObject = remote.stream; }}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
                            User {remote.peerID.slice(0, 5)}...
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex gap-4">
                <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                    End Call (Not Impl)
                </button>
                <div className="text-gray-400 text-sm">
                    Status: {socket ? "Connected to signaling" : "Disconnected"} | Peers: {peers.length}
                </div>
            </div>
        </div>
    );
};

export default LiveClassRoom;
