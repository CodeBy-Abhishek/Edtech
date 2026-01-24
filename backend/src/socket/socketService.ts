import { Server, Socket } from 'socket.io';
import prisma from '../lib/prisma';

let ioInstance: Server | null = null;

export const getSocketIO = () => {
    if (!ioInstance) {
        throw new Error("Socket.io not initialized!");
    }
    return ioInstance;
};

interface ChatMessage {
    room: string;
    user: string;
    text: string;
    time: string;
    userId?: string;
}

export class SocketService {
    private io: Server;

    constructor(io: Server) {
        this.io = io;
        ioInstance = io;
        this.initialize();
    }

    private initialize() {
        this.io.on('connection', (socket: Socket) => {
            console.log(`User connected: ${socket.id}`);

            socket.on('join_room', async (room: string) => {
                socket.join(room);
                console.log(`User ${socket.id} joined room: ${room}`);

                // Load history
                try {
                    const history = await prisma.chatMessage.findMany({
                        where: { room },
                        orderBy: { createdAt: 'asc' }, // Oldest first
                        take: 50
                    });

                    // Map to frontend format
                    const formattedHistory = history.map(msg => ({
                        id: msg.id,
                        room: msg.room,
                        user: msg.senderName || "Student",
                        text: msg.content,
                        time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }));

                    socket.emit('load_history', formattedHistory);
                } catch (error) {
                    console.error('Error loading chat history:', error);
                }

                // Optional: Notify others in the room
                socket.to(room).emit('user_joined', { userId: socket.id });
            });

            // WebRTC Signaling
            socket.on('join_web_rtc', async (room: string) => {
                const sockets = await this.io.in(room).fetchSockets();
                const otherUsers = sockets
                    .map((s: any) => s.id) // Type safe
                    .filter((id: string) => id !== socket.id);

                socket.emit('all_users', otherUsers);
            });

            socket.on('offer', (payload: { target: string; caller: string; sdp: RTCSessionDescriptionInit }) => {
                this.io.to(payload.target).emit('offer', payload);
            });

            socket.on('answer', (payload: { target: string; caller: string; sdp: RTCSessionDescriptionInit }) => {
                this.io.to(payload.target).emit('answer', payload);
            });

            socket.on('ice_candidate', (payload: { target: string; candidate: RTCIceCandidate }) => {
                this.io.to(payload.target).emit('ice_candidate', payload);
            });

            socket.on('send_message', async (message: ChatMessage) => {
                console.log(`Message in ${message.room}:`, message);

                try {
                    // Save to DB
                    const savedMsg = await prisma.chatMessage.create({
                        data: {
                            content: message.text,
                            room: message.room,
                            senderName: message.user,
                            // userId: ... (Connect to real user if we have auth context)
                        }
                    });

                    // Broadcast to everyone in the room INCLUDING sender (simplifies frontend state)
                    const broadcastMsg = {
                        ...message,
                        id: savedMsg.id
                    };

                    this.io.to(message.room).emit('receive_message', broadcastMsg);
                } catch (error) {
                    console.error('Error saving message:', error);
                    // Fallback broadcast even if save fails?
                    this.io.to(message.room).emit('receive_message', message);
                }
            });

            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.id}`);
            });
        });
    }
}
