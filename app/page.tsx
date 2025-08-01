"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>
                        <Image
                            src="/img/eyespy-killer-game-horizontal.png"
                            width={300}
                            height={100}
                            alt="EyeSpy: Killer Game Logo"
                            style={{ height: "auto" }}
                            className="rounded-lg"
                            priority
                        />
                    </CardTitle>
                    <CardDescription>
                        A real-time party game. Choose an option to begin:
                    </CardDescription>
                    {/* <CardAction>Card Action</CardAction> */}
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col space-y-4">
                        <Button
                            variant={"secondary"}
                            size={"lg"}
                            onClick={() => router.push("/room/create")}
                        >
                            🎮 Host Game
                        </Button>
                        <Button
                            variant={"destructive"}
                            size={"lg"}
                            onClick={() => router.push("/room/join")}
                        >
                            🤝 Join Game
                        </Button>
                    </div>
                </CardContent>
                <CardFooter>
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
}
