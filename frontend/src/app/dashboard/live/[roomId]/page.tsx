import { LiveClassInterface } from "@/components/lms/LiveClassInterface";
import React from "react";

export default async function LiveRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
    const { roomId } = await params;
    return <LiveClassInterface roomId={roomId} />;
}
