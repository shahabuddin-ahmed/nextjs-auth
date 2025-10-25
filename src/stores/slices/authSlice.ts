import {
    createSlice,
    createAsyncThunk,
    type PayloadAction,
} from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api";
import { setCookie, deleteCookie, encodeUser } from "@/lib/cookies";

interface User {
    id: string;
    email: string;
    name: string;
}

interface LoginResponse {
    id: string;
    email: string;
    name: string;
    accessToken: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (
        credentials: { email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await apiClient.login(
                credentials.email,
                credentials.password
            );
            return {
                user: {
                    id: response.id,
                    email: response.email,
                    name: response.name,
                },
                accessToken: response.accessToken,
            };
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Login failed. Please try again."
            );
        }
    }
);

export const signupUser = createAsyncThunk(
    "auth/signupUser",
    async (
        userData: { email: string; password: string; name: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await apiClient.signup(
                userData.name,
                userData.email,
                userData.password
            );
            return {
                user: {
                    id: response.id,
                    email: response.email,
                    name: response.name,
                },
            };
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Signup failed. Please try again."
            );
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        updateProfile: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.error = null;
            deleteCookie("accessToken");
            deleteCookie("user");
        },
        clearError: (state) => {
            state.error = null;
        },
        restoreAuth: (
            state,
            action: PayloadAction<{ user: User; accessToken: string }>
        ) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login thunk handlers
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                loginUser.fulfilled,
                (
                    state,
                    {
                        payload,
                    }: PayloadAction<{ user: User; accessToken: string }>
                ) => {
                    state.isLoading = false;
                    state.isAuthenticated = true;
                    state.user = payload.user;
                    state.accessToken = payload.accessToken;
                    state.error = null;
                    setCookie("accessToken", payload.accessToken);
                    setCookie("user", encodeUser(payload.user));
                }
            )
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Signup thunk handlers
            .addCase(signupUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { updateProfile, logout, clearError, restoreAuth } =
    authSlice.actions;

export default authSlice.reducer;
