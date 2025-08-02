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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePlayer } from "@/context/PlayerContext";
const createRoomPage = () => {
    const [name, setName] = useState("");
    const router = useRouter();
    const { player, setPlayer } = usePlayer();

    const handleCreateRoom = async () => {
        if (name.trim() === "") {
            alert("Please enter your name to create a room.");
            return;
        }

        const res = await fetch("/api/rooms/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });

        const data = await res.json();

        if (res.ok) {
            setPlayer({ id: data.playerId, name, isHost: true });
            router.push(`/room/${data.code}/lobby`);
        } else {
            alert(data.error || "Room creation failed.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="w-full max-w-sm space-y-5">
                <CardHeader>
                    <CardTitle className="text-center text-4xl font-extrabold">
                        Create A ROOM
                    </CardTitle>
                    <CardDescription className="text-center text-lg text-gray-500">
                        Enter your your name to create a room
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
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button
                        variant={"default"}
                        onClick={handleCreateRoom}
                        className="w-full text-blue-50"
                    >
                        Submit
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

export default createRoomPage;
