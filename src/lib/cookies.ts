export type MinimalUser = { id: string; email: string; name: string };

export function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

export function setCookie(
    name: string,
    value: string,
    maxAgeSeconds = 60 * 60 * 24
) {
    const isSecure = window && window.location.protocol === "https:";
    document.cookie = `${name}=${encodeURIComponent(
        value
    )}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${
        isSecure ? "; Secure" : ""
    }`;
}

export function deleteCookie(name: string) {
    document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function encodeUser(u: MinimalUser) {
    return btoa(encodeURIComponent(JSON.stringify(u)));
}
export function decodeUser(raw: string | null): MinimalUser | null {
    if (!raw) {
        return null;
    }

    try {
        const json = decodeURIComponent(escape(atob(raw)));
        const u = JSON.parse(json);
        if (u?.id && u?.email && u?.name) return u as MinimalUser;
        return null;
    } catch {
        return null;
    }
}
