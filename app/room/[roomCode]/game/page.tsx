"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import clsx from "clsx";
import { Badge } from "@/components/ui/badge";

const GamePage = () => {
    const { roomCode } = useParams<{ roomCode: string }>();
    const searchParams = useSearchParams();
    const pid = searchParams.get("pid");

    const [role, setRole] = useState<string | null>(null);
    const [isAlive, setIsAlive] = useState<boolean>(true);
    const [players, setPlayers] = useState<any[]>([]);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(false);

    // Get role + is_alive + fetch others for Police
    const fetchRole = async () => {
        if (!pid) return;
        setLoading(true);
        try {
            const res = await fetch(
                `${process.env
                    .NEXT_PUBLIC_SUPABASE_URL!}/rest/v1/players?id=eq.${pid}`,
                {
                    headers: {
                        apikey: process.env
                            .NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
                        Authorization: `Bearer ${process.env
                            .NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!}`,
                    },
                }
            );
            const data = await res.json();
            if (data.length > 0) {
                setRole(data[0].role);
                setIsAlive(data[0].is_alive);
                setIsFlipped(true);

                if (data[0].role === "police") {
                    console.log("here");
                    fetchOtherPlayers();
                }
            } else {
                alert("Player not found.");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to fetch role.");
        } finally {
            setLoading(false);
        }
    };

    const fetchOtherPlayers = async () => {
        try {
            const res = await fetch(
                `${process.env
                    .NEXT_PUBLIC_SUPABASE_URL!}/rest/v1/players?room_code=eq.${roomCode}&is_alive=eq.TRUE&role=neq.Police`,
                {
                    headers: {
                        apikey: process.env
                            .NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
                        Authorization: `Bearer ${process.env
                            .NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!}`,
                    },
                }
            );
            const data = await res.json();
            console.log("Fetched players:", data);
            setPlayers(data);
        } catch (err) {
            console.error("Failed to fetch players", err);
        }
    };

    const handleDeathUpdate = async (dead: boolean) => {
        try {
            const res = await fetch(
                `${process.env
                    .NEXT_PUBLIC_SUPABASE_URL!}/rest/v1/players?id=eq.${pid}`,
                {
                    method: "PATCH",
                    headers: {
                        apikey: process.env
                            .NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
                        Authorization: `Bearer ${process.env
                            .NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ is_alive: !dead }),
                }
            );
            if (res.ok) {
                setIsAlive(!dead);
            } else {
                alert("Failed to update status.");
            }
        } catch (err) {
            console.error(err);
            alert("Update error.");
        }
    };

    const handleSuspectSelection = async (suspectId: number) => {
        if (!roomCode) return;

        try {
            // Fetch the actual killer in this room
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/players?room_code=eq.${roomCode}&role=eq.Killer`,
                {
                    headers: {
                        apikey: process.env
                            .NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
                        Authorization: `Bearer ${process.env
                            .NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!}`,
                    },
                }
            );

            const data = await res.json();

            if (data.length === 0) {
                alert("No killer found in this room!");
                return;
            }

            const killer = data[0];

            if (killer.id === suspectId) {
                alert("✅ You caught the killer! Civilians and Police win!");
                // TODO: Optionally update game state to 'Game Over' in DB
            } else {
                alert("❌ Wrong guess. Killer wins!");
                // TODO: Optionally update game state to 'Game Over' in DB
            }
        } catch (error) {
            console.error("Failed to check suspect:", error);
            alert("Something went wrong when checking the suspect.");
        }
    };
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 space-y-6">
            <h1 className="text-xl">
                Room Code: <span className="text-blue-600">{roomCode}</span>
            </h1>

            {/* Card Reveal */}
            <motion.div className="relative w-64 h-96 perspective">
                <motion.div
                    className={clsx(
                        "absolute w-full h-full rounded-2xl shadow-xl transition-transform duration-700",
                        isFlipped ? "[transform:rotateY(180deg)]" : ""
                    )}
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* Front Face */}
                    <div className="absolute backface-hidden w-full h-full bg-gray-700 border flex items-center justify-center rounded-2xl">
                        <Button
                            variant="outline"
                            onClick={fetchRole}
                            disabled={loading}
                        >
                            {loading ? "Revealing..." : "Tap to Reveal Role"}
                        </Button>
                    </div>

                    {/* Back Face */}
                    <div className="absolute backface-hidden [transform:rotateY(180deg)] w-full h-full bg-blue-200 border flex flex-col items-center justify-center rounded-2xl text-gray-800">
                        <p className="text-lg">You are</p>
                        <p className="text-4xl font-bold mt-2">{role}</p>
                        {isFlipped && role === "civilian" && isAlive && (
                            <div className="flex space-x-4">
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDeathUpdate(true)}
                                >
                                    Yes, I'm Dead
                                </Button>
                                <Button
                                    onClick={() => handleDeathUpdate(false)}
                                >
                                    No, I'm Alive
                                </Button>
                            </div>
                        )}
                        {isFlipped && role === "police" && (
                            <div className="text-left mt-4">
                                <h2 className="text-l mb-2 text-center font-semibold">
                                    Select Suspect:
                                </h2>
                                <div className="space-y-2">
                                    {players.map((p) => (
                                        <Badge
                                            className="cursor-pointer m-1"
                                            key={p.id}
                                            variant="destructive"
                                            onClick={() =>
                                                handleSuspectSelection(p.id)
                                            }
                                        >
                                            {p.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>

            {/* Post-Reveal Actions */}
        </div>
    );
};

export default GamePage;
