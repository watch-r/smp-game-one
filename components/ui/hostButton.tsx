"use client";
import React from "react";
import { Button } from "./button";
import { useRouter } from "next/navigation";

const HostButton = () => {
    const router = useRouter();
    return (
        <Button
            variant={"secondary"}
            size={"lg"}
            onClick={() => router.push("/room/create")}
        >
            🎮 Host Game
        </Button>
    );
};

export default HostButton;
