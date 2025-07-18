"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type RoomContextType = {
    roomId: string | null;
    setRoomId: (id: string) => void;
};

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: ReactNode }) {
    const [roomId, setRoomId] = useState<string | null>(null);

    return (
        <RoomContext.Provider value={{ roomId, setRoomId }}>
            {children}
        </RoomContext.Provider>
    );
}

export function useRoom() {
    const context = useContext(RoomContext);
    if (!context) {
        throw new Error("useRoom must be used within RoomProvider");
    }
    return context;
}
