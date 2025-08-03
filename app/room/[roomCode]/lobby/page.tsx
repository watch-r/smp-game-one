"use client";
import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Badge } from "@/components/ui/badge";

interface Player {
    id: string;
    name: string;
    is_host: boolean;
}

const LobbyPage = () => {
    const { roomCode } = useParams<{ roomCode: string }>();
    const searchParams = useSearchParams();
    const pid = searchParams.get("pid");
    const router = useRouter();

    const [players, setPlayers] = useState<Player[]>([]);
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

    useEffect(() => {
        const fetchPlayers = async () => {
            if (!roomCode) return;

            const { data: playerList, error: playerError } = await supabaseAdmin
                .from("players")
                .select("*")
                .eq("room_code", roomCode);

            if (playerError) {
                console.error("Error fetching players:", playerError.message);
                return;
            }

            setPlayers(playerList || []);

            // Find current player from list using pid
            const current = playerList?.find((p) => p.id === pid);
            setCurrentPlayer(current || null);
        };

        fetchPlayers();
    }, [roomCode, pid]);

    const handleStartGame = async () => {
        if (!currentPlayer?.is_host) return;
        // Logic to start the game
        try {
            // Shuffle the players array
            const shuffled = [...players].sort(() => Math.random() - 0.5);

            if (shuffled.length < 3) {
                alert("Need at least 3 players to start.");
                return;
            }

            const killer = shuffled[0];
            const police = shuffled[1];
            const civilians = shuffled.slice(2);

            // Role updates
            const roleUpdates = [
                { id: killer.id, role: "killer" },
                { id: police.id, role: "police" },
                ...civilians.map((c) => ({ id: c.id, role: "civilian" })),
            ];

            for (const update of roleUpdates) {
                await fetch(
                    `${process.env
                        .NEXT_PUBLIC_SUPABASE_URL!}/rest/v1/players?id=eq.${
                        update.id
                    }`,
                    {
                        method: "PATCH",
                        headers: {
                            apikey: process.env
                                .NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
                            Authorization: `Bearer ${process.env
                                .NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!}`,
                            "Content-Type": "application/json",
                            Prefer: "return=minimal",
                        },
                        body: JSON.stringify({ role: update.role }),
                    }
                );
            }

            alert("Roles assigned! Game started!");
            router.push(`/room/${roomCode}/game?pid=${pid}`)
        } catch (err) {
            console.error("Failed to assign roles:", err);
            alert("Failed to start game.");
        }
    };

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

                <CardContent className="space-y-4">
                    {/* Players list */}
                    <h2 className="text-lg items-center font-semibold">
                        Players:
                    </h2>
                    <div className="space-y-2">
                        {players.map((p) => (
                            <Badge
                                variant={"destructive"}
                                className="m-1"
                                key={p.id}
                            >
                                {p.name} {p.id === pid ? "(You)" : ""}
                            </Badge>
                        ))}
                    </div>

                    {/* Start game button */}
                    <Button
                        disabled={!currentPlayer?.is_host}
                        variant={"default"}
                        onClick={handleStartGame}
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
