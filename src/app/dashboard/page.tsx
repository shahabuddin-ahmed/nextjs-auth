"use client";

import { Button } from "@/components/ui/button";

import { useAppSelector } from "@/stores/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogoutButton } from "@/components/logout-button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-foreground">
                        Dashboard
                    </h1>
                    <div className="flex gap-2">
                        <Link href="/profile">
                            <Button variant="outline">Profile</Button>
                        </Link>
                        <LogoutButton />
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Welcome, {user.name}!</CardTitle>
                        <CardDescription>
                            You are successfully logged in
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Email
                            </p>
                            <p className="text-lg font-medium">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                User ID
                            </p>
                            <p className="text-lg font-medium">{user.id}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Campaigns</CardTitle>
                        <CardDescription>
                            Manage your email campaigns
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/campaigns">
                            <Button className="w-full">Go to Campaigns</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
