"use client";

import { useAppSelector, useAppDispatch } from "@/stores/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoutButton } from "@/components/logout-button";
import { updateProfile } from "@/stores/slices/authSlice";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function ProfilePage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        } else if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [isAuthenticated, user, router]);

    if (!isAuthenticated || !user) {
        return null;
    }

    const handleSave = () => {
        dispatch(updateProfile({ name, email }));
        setIsEditing(false);
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-foreground">
                        Profile
                    </h1>
                    <div className="flex gap-2">
                        <Link href="/dashboard">
                            <Button variant="outline">Dashboard</Button>
                        </Link>
                        <LogoutButton />
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>User Information</CardTitle>
                        <CardDescription>
                            Manage your profile details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {isEditing ? (
                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Button onClick={handleSave}>
                                        Save Changes
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Full Name
                                    </p>
                                    <p className="text-lg font-medium">
                                        {name}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Email
                                    </p>
                                    <p className="text-lg font-medium">
                                        {email}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        User ID
                                    </p>
                                    <p className="text-lg font-medium font-mono text-sm">
                                        {user.id}
                                    </p>
                                </div>

                                <Button onClick={() => setIsEditing(true)}>
                                    Edit Profile
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-destructive/50">
                    <CardHeader>
                        <CardTitle className="text-destructive">
                            Danger Zone
                        </CardTitle>
                        <CardDescription>Irreversible actions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Logging out will end your current session.
                        </p>
                        <LogoutButton />
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
