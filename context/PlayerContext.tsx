"use client";

import React, { createContext, useContext, useState } from "react";

type Player = {
    id: string;
    name: string;
    isHost: boolean;
};

type PlayerContextType = {
    player: Player | null;
    setPlayer: (player: Player) => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
    const [player, setPlayer] = useState<Player | null>(null);
    return (
        <PlayerContext.Provider value={{ player, setPlayer: setPlayer }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error(
            "usePlayerContext must be used within a PlayerProvider"
        );
    }
    return context;
};
