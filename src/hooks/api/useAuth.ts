import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (credentials: { email: string; password?: string; otp?: string; isOtpMode?: boolean }) => {
            const res = await api.post("/user/login", credentials);
            return res.data;
        },
        onSuccess: (data) => {
            if (data.success) {
                // Invalidate user query so app knows they are logged in
                queryClient.invalidateQueries({ queryKey: ["user"] });
            }
        }
    });
};
