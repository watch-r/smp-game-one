import { RoomProvider } from "@/context/RoomContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return <RoomProvider>{children}</RoomProvider>;
}
