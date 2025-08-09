"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import clsx from "clsx";
import { Badge } from "@/components/ui/badge";

// ✅ Typing for clarity
type Player = {
    id: string;
    name: string;
    role: "police" | "killer" | "civilian";
    is_alive: boolean;
};

const GamePage = () => {
    const { roomCode } = useParams<{ roomCode: string }>();
    const searchParams = useSearchParams();
    const pid = searchParams.get("pid");

    const [role, setRole] = useState<"police" | "killer" | "civilian" | null>(
        null
    );
    const [isAlive, setIsAlive] = useState(true);
    const [players, setPlayers] = useState<Player[]>([]);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (role === "police" && roomCode) {
            fetchOtherPlayers();
        }
    }, [role, roomCode]);

    const fetchRole = async () => {
        if (!pid) return;
        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/players?id=eq.${pid}`,
                {
                    headers: {
                        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                        Authorization: `Bearer ${process.env
                            .NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!}`,
                    },
                }
            );
            const data = await res.json();
            if (data.length > 0) {
                const player = data[0];
                setRole(player.role);
                setIsAlive(player.is_alive);
                setIsFlipped(true);
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
                `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/players?room_code=eq.${roomCode}&is_alive=eq.true&role=neq.police`,
                {
                    headers: {
                        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                        Authorization: `Bearer ${process.env
                            .NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
                    },
                }
            );
            const data = await res.json();
            setPlayers(data);
        } catch (err) {
            console.error("Failed to fetch players", err);
        }
    };

    const handleDeathUpdate = async (dead: boolean) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/players?id=eq.${pid}`,
                {
                    method: "PATCH",
                    headers: {
                        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                        Authorization: `Bearer ${process.env
                            .NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ is_alive: !dead }),
                }
            );
            if (res.ok) {
                setIsAlive(!dead);
                if (role === "police") await fetchOtherPlayers();
            } else {
                alert("Failed to update status.");
            }
        } catch (err) {
            console.error(err);
            alert("Update error.");
        }
    };

    const handleSuspectSelection = async (suspectId: string) => {
        if (!roomCode) return;
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/players?room_code=eq.${roomCode}&role=eq.killer`,
                {
                    headers: {
                        apikey: process.env
                            .NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
                        Authorization: `Bearer ${process.env
                            .NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
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
            } else {
                alert("❌ Wrong guess. Killer wins!");
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
                    <div className="absolute backface-hidden [transform:rotateY(180deg)] w-full h-full bg-gray-800 border flex flex-col items-center justify-center rounded-2xl text-gray-800">
                        <p className="text-lg text-white p-4">You are {role}</p>
                        <Button
                            variant={"outline"}
                            className="text-white"
                            onClick={() => setIsFlipped(false)}
                        >
                            Tap
                        </Button>
                        {isFlipped && role === "civilian" && isAlive && (
                            <div className="flex space-x-2 mt-3">
                                <Button
                                    className="bg-rose-950 text-white"
                                    onClick={() => handleDeathUpdate(true)}
                                >
                                    Dead
                                </Button>
                                <Button
                                    onClick={() => handleDeathUpdate(false)}
                                    className="bg-emerald-900 text-white"
                                >
                                    Alive
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
                                            variant="outline"
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
        </div>
    );
};

export default GamePage;
