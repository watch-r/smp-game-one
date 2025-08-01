"use client";
import React from "react";
import { Button } from "./button";
import { useRouter } from "next/navigation";

const HostButton = () => {
    return (
        <Button
            variant={"secondary"}
            size={"lg"}
            onClick={() => useRouter().push("/room/create")}
        >
            🎮 Host Game
        </Button>
    );
};

export default HostButton;
