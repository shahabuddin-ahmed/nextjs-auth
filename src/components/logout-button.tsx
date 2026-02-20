"use client";

import { useAppDispatch } from "@/stores/hooks";
import { logout } from "@/stores/slices/authSlice";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleLogout = () => {
        dispatch(logout());
        router.push("/login");
    };

    return (
        <Button variant="outline" onClick={handleLogout}>
            Logout
        </Button>
    );
}
