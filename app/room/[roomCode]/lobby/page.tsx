"use client";
import React from "react";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { usePlayer } from "@/context/PlayerContext";

const LobbyPage = () => {
    const handleStartGame = async () => {
        // Logic to start the game
    };
    const { roomCode } = useParams<{ roomCode: string }>();
    const { player } = usePlayer();
    console.log("Room code:", roomCode);
    console.log("playerId:", player);
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="w-full max-w-sm space-y-5">
                <CardHeader>
                    <CardTitle className="text-center">
                        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                            ROOM code:
                        </h1>

                        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                            {roomCode}
                        </h3>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Button
                        variant={"default"}
                        // onClick={handleStartGame}
                        className="w-full text-blue-50"
                    >
                        Start Game
                    </Button>
                </CardContent>
                <CardFooter className="flex-col gap-2">
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

export default LobbyPage;
