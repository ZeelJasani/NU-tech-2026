"use client";

import { useEffect } from "react";

export function ConsoleFilter() {
    useEffect(() => {
        const originalError = console.error;
        console.error = (...args) => {
            const msg = args[0];
            if (
                typeof msg === "string" &&
                (msg.includes("chrome-extension://") ||
                    msg.includes("Failed to connect to MetaMask") ||
                    msg.includes("hydration") ||
                    msg.includes("bis_skin_checked"))
            ) {
                // Suppress these specific errors
                return;
            }
            originalError.apply(console, args);
        };

        return () => {
            console.error = originalError;
        };
    }, []);

    return null;
}
