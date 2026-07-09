import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 10, // 10 min tak fresh
            gcTime: 1000 * 60 * 30, // cache memory
            refetchOnWindowFocus: false,
            refetchOnMount: false, // 🔥 important
            refetchOnReconnect: false,
        },
    },
});