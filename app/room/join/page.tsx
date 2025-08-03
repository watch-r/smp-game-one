"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

const JoinPage = () => {
    const [name, setName] = useState("");
    const [roomCode, setroomCode] = useState("");
    const router = useRouter();

    const handlejoinRoom = async () => {
        if (name.trim() === "" || roomCode.trim() === "") {
            alert("Please enter your name and ROOM code to join.");
            return;
        }

        const res = await fetch("/api/rooms/join", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, roomCode }),
        });

        const data = await res.json();

        if (res.ok) {
            // Logic to handle successful join
            // For example, redirect to the lobby page
            router.push(`/room/${roomCode}/lobby?pid=${data.playerId}`);
        } else {
            alert("Failed to join the room.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="w-full max-w-sm space-y-5">
                <CardHeader>
                    <CardTitle className="text-center text-4xl font-extrabold">
                        Join A ROOM
                    </CardTitle>
                    <CardDescription className="text-center text-lg text-gray-500">
                        Enter your your name and the ROOM Code to join a room
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label
                                htmlFor="name"
                                className="text-center text-2xl font-semibold"
                            >
                                Name
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Your Name"
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <Label
                                htmlFor="roomCode"
                                className="text-center text-2xl font-semibold"
                            >
                                ROOM Code
                            </Label>
                            <Input
                                id="roomCode"
                                type="text"
                                placeholder="Room Code"
                                onChange={(e) => setroomCode(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button
                        variant={"secondary"}
                        onClick={handlejoinRoom}
                        className="w-full text-blue-50"
                    >
                        Join
                    </Button>
                    <div className="flex flex-col items-center justify-center space-y-1">
                        <p className="text-gray-400">
                            Made with ❤️ by MonStar Zero Studios
                        </p>
                        <p className="text-gray-400">
                            © 2025 MonStar Zero Studios
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default JoinPage;
