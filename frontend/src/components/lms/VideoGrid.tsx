import React, { useEffect, useRef } from 'react';

interface VideoGridProps {
    localStream: MediaStream | null;
    remoteStreams: { [key: string]: MediaStream };
    localMuted?: boolean;
    localVideoOff?: boolean;
}

const VideoCard = ({ stream, isLocal = false, muted = false }: { stream: MediaStream, isLocal?: boolean, muted?: boolean }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div className="relative bg-zinc-800 rounded-xl overflow-hidden aspect-video border border-zinc-700 shadow-xl group">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={isLocal || muted} // Always mute local to prevent echo
                className={`w-full h-full object-cover ${isLocal ? 'scale-x-[-1]' : ''}`} // Mirror local
            />
            {/* Overlay Name */}
            <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-white text-xs font-medium">
                {isLocal ? "You (Student)" : "Peer"}
            </div>

            {/* Audio Indicator (Mock) */}
            <div className="absolute top-3 right-3 w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            </div>
        </div>
    );
};

export const VideoGrid = ({ localStream, remoteStreams }: VideoGridProps) => {
    return (
        <div className="w-full h-full p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
            {/* Local Stream */}
            <div className="col-span-1">
                {localStream ? (
                    <VideoCard stream={localStream} isLocal={true} />
                ) : (
                    <div className="w-full h-full bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center flex-col gap-2 aspect-video">
                        <div className="w-10 h-10 rounded-full border-2 border-zinc-700 border-t-indigo-500 animate-spin" />
                        <span className="text-zinc-500 text-xs">Accessing Camera...</span>
                    </div>
                )}
            </div>

            {/* Remote Streams */}
            {Object.entries(remoteStreams).map(([peerId, stream]) => (
                <div key={peerId} className="col-span-1">
                    <VideoCard stream={stream} />
                </div>
            ))}
        </div>
    );
};
