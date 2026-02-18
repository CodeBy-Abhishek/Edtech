"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
    Users,
    Send,
    MessageSquare,
    Hand,
    Mic,
    Video,
    ScreenShare,
    PhoneOff,
    Radio,
    Maximize2,
    Settings,
    MoreHorizontal,
    Layout
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSocket } from '@/context/SocketContext';
import { useWebRTC } from '@/hooks/useWebRTC';
import { VideoGrid } from './VideoGrid';

interface ChatMessage {
    room: string;
    user: string;
    text: string;
    time: string;
    id?: number;
}

interface LiveClassInterfaceProps {
    roomId: string;
}

export const LiveClassInterface = ({ roomId }: LiveClassInterfaceProps) => {
    const { socket, isConnected } = useSocket();
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) setUserData(JSON.parse(user));
    }, []);

    const { localStream, remoteStreams } = useWebRTC({
        socket,
        roomId,
        userId: userData?.name || "Student"
    });

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCamOn, setIsCamOn] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const ROOM_ID = roomId || "global-class";

    const toggleMic = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
            setIsMicOn(!isMicOn);
        }
    };

    const toggleCam = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
            setIsCamOn(!isCamOn);
        }
    };

    useEffect(() => {
        if (!socket) return;

        socket.emit('join_room', ROOM_ID);

        const handleLoadHistory = (history: ChatMessage[]) => {
            setMessages(history);
            scrollToBottom();
        };

        const handleReceiveMessage = (message: ChatMessage) => {
            setMessages((prev) => [...prev, message]);
            scrollToBottom();
        };

        socket.on('load_history', handleLoadHistory);
        socket.on('receive_message', handleReceiveMessage);

        return () => {
            socket.off('load_history', handleLoadHistory);
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [socket, ROOM_ID]);

    const scrollToBottom = () => {
        setTimeout(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollTo({
                    top: scrollRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }, 100);
    };

    const handleSendMessage = () => {
        if (!input.trim() || !socket) return;

        const messageData: ChatMessage = {
            room: ROOM_ID,
            user: userData?.name || "Student",
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        socket.emit('send_message', messageData);
        setInput('');
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-black overflow-hidden font-sans">
            <div className="flex-1 flex overflow-hidden">
                {/* Main Video Area */}
                <div className="flex-1 relative bg-zinc-950 flex flex-col group/video">
                    {/* Top Overlay Controls */}
                    <div className="absolute top-8 left-8 right-8 z-30 flex items-center justify-between pointer-events-none">
                        <div className="flex items-center gap-4 pointer-events-auto">
                            <div className={cn(
                                "flex items-center gap-3 px-4 py-2 rounded-2xl text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl backdrop-blur-3xl border border-white/10",
                                isConnected ? "bg-red-600/80" : "bg-zinc-800/80"
                            )}>
                                <div className={cn("w-2 h-2 rounded-full", isConnected ? "bg-white animate-pulse" : "bg-zinc-500")} />
                                {isConnected ? "Transmission Live" : "Establishing Link..."}
                            </div>
                            <div className="bg-black/40 backdrop-blur-3xl px-4 py-2 rounded-2xl text-zinc-300 text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 flex items-center gap-3 shadow-2xl">
                                <Users className="w-3.5 h-3.5 text-indigo-400" />
                                <span>{Object.keys(remoteStreams).length + 1} Scholars Online</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pointer-events-auto opacity-0 group-hover/video:opacity-100 transition-opacity duration-500">
                            <button className="p-2.5 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-xl text-zinc-400 hover:text-white transition-all hover:bg-white/10">
                                <Maximize2 className="w-4 h-4" />
                            </button>
                            <button className="p-2.5 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-xl text-zinc-400 hover:text-white transition-all hover:bg-white/10">
                                <Settings className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Content Rendering */}
                    <div className="flex-1 flex items-center justify-center bg-[#020202] overflow-hidden relative">
                        <VideoGrid
                            localStream={localStream}
                            remoteStreams={remoteStreams}
                            localMuted={!isMicOn}
                        />

                        {/* Interactive HUD Overlays can go here */}
                    </div>

                    {/* Bottom Controls Bar */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-6 px-10 py-5 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] opacity-0 group-hover/video:opacity-100 transition-all duration-700 translate-y-4 group-hover/video:translate-y-0">
                        <button
                            onClick={toggleMic}
                            className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-2xl active:scale-90",
                                isMicOn ? "bg-zinc-100 text-zinc-950 hover:bg-white" : "bg-red-600 text-white hover:bg-red-500"
                            )}
                        >
                            {isMicOn ? <Mic className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                        </button>
                        <button
                            onClick={toggleCam}
                            className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-2xl active:scale-90",
                                isCamOn ? "bg-zinc-100 text-zinc-950 hover:bg-white" : "bg-red-600 text-white hover:bg-red-500"
                            )}
                        >
                            {isCamOn ? <Video className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                        </button>

                        <div className="w-px h-8 bg-white/10 mx-2" />

                        <button className="w-14 h-14 rounded-2xl bg-zinc-900/50 text-white border border-white/5 hover:bg-zinc-800 transition-all flex items-center justify-center active:scale-90">
                            <ScreenShare className="w-5 h-5" />
                        </button>
                        <button className="w-14 h-14 rounded-2xl bg-zinc-900/50 text-white border border-white/5 hover:bg-zinc-800 transition-all flex items-center justify-center active:scale-90">
                            <Hand className="w-5 h-5 text-amber-400" />
                        </button>
                        <button className="w-14 h-14 rounded-2xl bg-zinc-900/50 text-white border border-white/5 hover:bg-zinc-800 transition-all flex items-center justify-center active:scale-90">
                            <Layout className="w-5 h-5" />
                        </button>

                        <div className="w-px h-8 bg-white/10 mx-2" />

                        <button className="w-14 h-14 rounded-2xl bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-all shadow-2xl shadow-red-900/20 active:scale-90">
                            <PhoneOff className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Cyberpunk Chat Sidebar */}
                <div className="w-[26rem] flex flex-col bg-[#050505] border-l border-white/5 shadow-2xl relative z-40">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="font-black text-[10px] text-zinc-100 uppercase tracking-[0.3em] italic">Encrypted Feed</h3>
                                <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold mt-0.5">Real-time Synchronization</p>
                            </div>
                        </div>
                        <button className="p-2 text-zinc-600 hover:text-zinc-300 transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar" ref={scrollRef}>
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center opacity-20 select-none grayscale">
                                <MessageSquare className="w-16 h-16 mb-6 text-zinc-500" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Channel Idle</p>
                            </div>
                        )}
                        {messages.map((m, i) => (
                            <div key={i} className={cn(
                                "flex flex-col gap-2 group",
                                m.user === userData?.name ? "items-end" : "items-start"
                            )}>
                                <div className="flex items-center gap-3 px-1">
                                    <span className={cn(
                                        "text-[9px] font-black uppercase tracking-[0.2em]",
                                        m.user === 'Instructor' || m.user === 'Admin' ? 'text-indigo-400' : 'text-zinc-600'
                                    )}>
                                        {m.user}
                                    </span>
                                    <span className="text-[8px] text-zinc-800 font-black tracking-widest">{m.time}</span>
                                </div>
                                <div className={cn(
                                    "px-5 py-4 rounded-2xl text-[13px] font-medium leading-relaxed max-w-[90%] shadow-2xl transition-all group-hover:scale-[1.02]",
                                    m.user === userData?.name
                                        ? "bg-indigo-600 text-white rounded-tr-none shadow-indigo-500/10"
                                        : "bg-zinc-900 text-zinc-200 rounded-tl-none border border-white/5"
                                )}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-8 border-t border-white/5 bg-zinc-950/20">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-indigo-500/5 rounded-[1.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder={isConnected ? "Broadcast insights..." : "Synchronizing system..."}
                                disabled={!isConnected}
                                className="w-full bg-[#080808] border border-white/5 rounded-[1.5rem] pl-6 pr-14 py-5 text-sm text-zinc-200 outline-none focus:border-indigo-500/30 transition-all placeholder:text-zinc-800 placeholder:italic relative z-10"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!isConnected || !input.trim()}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 transition-all disabled:opacity-20 active:scale-90 z-20"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
