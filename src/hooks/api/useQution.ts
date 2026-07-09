import api from "@/lib/api"
import { useQuery } from "@tanstack/react-query"


export const useQution = ({ 
    page = 1, 
    limit = 10, 
    category = "all", 
    difficulty = "all", 
    type = "all",
    search = ""
}: { 
    page?: number; 
    limit?: number;
    category?: string;
    difficulty?: string;
    type?: string;
    search?: string;
} = {}) => {
    return useQuery({
        queryKey: ["questions", { page, limit, category, difficulty, type, search }],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append("page", page.toString());
            params.append("limit", limit.toString());
            if (category !== "all") params.append("category", category);
            if (difficulty !== "all") params.append("difficulty", difficulty);
            if (type !== "all") params.append("type", type);
            if (search) params.append("search", search);

            const res = await api.get(`/questions?${params.toString()}`);
            return res.data;
        },
        retry: false
    });
};