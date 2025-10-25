"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { restoreAuth } from "@/stores/slices/authSlice";
import { decodeUser, getCookie } from "@/lib/cookies";

export function useAuthInit() {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (window && !isAuthenticated) {
            const token = getCookie("accessToken");
            const user = decodeUser(getCookie("user"));
            if (token && user) {
                dispatch(restoreAuth({ user, accessToken: token }));
            }
        }
    }, [dispatch, isAuthenticated]);
}
