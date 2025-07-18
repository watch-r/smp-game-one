"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/themebutton";
import { Ghost } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
    const router = useRouter();
    const [roomCode, setRoomCode] = useState("");

    function handleCreateRoom() {
        const code = crypto.randomUUID().slice(0, 6);
        router.push(`/room/${code}/setup`);
    }
    function handleJoinRoom() {
        if (roomCode.trim()) {
            router.push(`/room/${roomCode}/setup`);
        }
    }
    return (
        <main className="flex flex-col items-center justify-center h-screen space-y-3 bg-gray-50 p-4">
            <h1 className="text-4xl font-bold mb-6">Murder Mystery</h1>
            <Button onClick={handleCreateRoom} size={"lg"}>
                Create Room
            </Button>
            <div className="flex space-x-2">
                <Input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    placeholder="Enter room code"
                />
                <Button onClick={handleJoinRoom} className="bg-emerald-500">
                    Join Room
                </Button>
            </div>
        </main>
    );
}
