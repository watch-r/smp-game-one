"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import clsx from "clsx";
import { Badge } from "@/components/ui/badge";
import { ApiResponse, Player } from "@/types/types";
import { api } from "@/lib/api";

const GamePage = () => {
    const { roomCode } = useParams<{ roomCode: string }>();
    const searchParams = useSearchParams();
    const pid = searchParams.get("pid");

    const [role, setRole] = useState<"police" | "killer" | "civilian" | null>(
        null
    );
    const [isAlive, setIsAlive] = useState(true);
    const [players, setPlayers] = useState<player[]>([]);
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
            const res = await fetch(`/api/eyespy/player?pid=${pid}`);
            const { success, data } = await res.json();

            if (success && data.length > 0) {
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
            const { success, data }: ApiResponse<Player[]> =
                await api.players.listAlive(roomCode);

            if (success) setPlayers(data); // data is fully typed as Player[]
        } catch (err) {
            console.error("Failed to fetch players", err);
        }
    };

    const handleDeathUpdate = async (dead: boolean) => {
        try {
            const { success } = await api.players.updateAlive(pid!, dead);
            if (success) {
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
        const { success, correct } = await api.players.checkSuspect(
            roomCode,
            suspectId
        );
        if (!success) return alert("Error checking suspect");
        alert(
            correct
                ? "✅ You caught the killer!"
                : "❌ Wrong guess. Killer wins!"
        );
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 space-y-6">
            <h1 className="text-xl">
                Room Code: <span className="text-blue-600">{roomCode}</span>
            </h1>

            {/* Card Reveal */}
            <motion.div className="relative w-76 h-96 perspective">
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
