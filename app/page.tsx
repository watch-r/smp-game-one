import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import HostButton from "@/components/ui/hostButton";
import Image from "next/image";

export default function Home() {
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
                            className="mb-8 rounded-lg"
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
                        <HostButton />
                        <Button variant={"destructive"} size={"lg"}>
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
