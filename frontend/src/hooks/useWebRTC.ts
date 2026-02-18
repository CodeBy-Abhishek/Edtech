import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

interface WebRTCProps {
    socket: Socket | null;
    roomId: string;
    userId: string; // "Student" or unique ID
}

interface PeerConnection {
    [key: string]: RTCPeerConnection;
}

export const useWebRTC = ({ socket, roomId, userId }: WebRTCProps) => {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [peers, setPeers] = useState<PeerConnection>({});
    const [remoteStreams, setRemoteStreams] = useState<{ [key: string]: MediaStream }>({});
    const peersRef = useRef<PeerConnection>({}); // Ref for direct access in callbacks

    useEffect(() => {
        if (!socket) return;

        // 1. Get User Media
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                setLocalStream(stream);

                // Join WebRTC room
                socket.emit('join_web_rtc', roomId);

                // Receive list of all existing users
                socket.on('all_users', (users: string[]) => {
                    const peersObj: PeerConnection = {};
                    users.forEach(targetId => {
                        const peer = createPeer(targetId, socket, stream);
                        peersObj[targetId] = peer;
                    });
                    peersRef.current = peersObj;
                    setPeers(peersObj);
                });

                // Handle incoming offer (Someone calls me)
                socket.on('offer', async (payload) => {
                    const peer = addPeer(payload.caller, socket, stream);
                    peersRef.current[payload.caller] = peer;

                    await peer.setRemoteDescription(payload.sdp);
                    const answer = await peer.createAnswer();
                    await peer.setLocalDescription(answer);

                    socket.emit('answer', {
                        target: payload.caller,
                        caller: socket.id,
                        sdp: answer
                    });
                });

                // Handle incoming answer (Someone answered my call)
                socket.on('answer', (payload) => {
                    const peer = peersRef.current[payload.caller];
                    if (peer) {
                        peer.setRemoteDescription(payload.sdp);
                    }
                });

                // Handle ICE Candidate
                socket.on('ice_candidate', (payload) => {
                    const peer = peersRef.current[payload.caller];
                    if (peer) {
                        peer.addIceCandidate(payload.candidate);
                    }
                });
            })
            .catch(err => {
                console.error("Failed to get media", err);
                alert("Could not access camera/microphone");
            });

        return () => {
            localStream?.getTracks().forEach(track => track.stop());
            // Cleanup peers?
        };
    }, [socket, roomId]);

    function createPeer(targetId: string, socket: Socket, stream: MediaStream) {
        const peer = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:global.stun.twilio.com:3478' }
            ]
        });

        stream.getTracks().forEach(track => peer.addTrack(track, stream));

        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice_candidate', {
                    target: targetId,
                    candidate: event.candidate
                });
            }
        };

        peer.ontrack = (event) => {
            setRemoteStreams(prev => ({ ...prev, [targetId]: event.streams[0] }));
        };

        // Create Offer
        peer.createOffer().then(offer => {
            peer.setLocalDescription(offer);
            socket.emit('offer', {
                target: targetId,
                caller: socket.id,
                sdp: offer
            });
        });

        return peer;
    }

    function addPeer(incomingCallerId: string, socket: Socket, stream: MediaStream) {
        const peer = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:global.stun.twilio.com:3478' }
            ]
        });

        stream.getTracks().forEach(track => peer.addTrack(track, stream));

        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice_candidate', {
                    target: incomingCallerId,
                    candidate: event.candidate
                });
            }
        };

        peer.ontrack = (event) => {
            setRemoteStreams(prev => ({ ...prev, [incomingCallerId]: event.streams[0] }));
        };

        return peer;
    }

    return { localStream, remoteStreams };
};
