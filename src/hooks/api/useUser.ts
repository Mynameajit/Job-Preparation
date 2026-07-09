import api from "@/lib/api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export const useUser = () => {
    return useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const res = await api.get("/user/profile")
            return res.data
        },
        retry: false
    })
}

export const useUpdateProfile = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: {
            name?: string,
            bio?: string | null,
            profilePhoto?: string | null,
            location?: string | null,
            githubUrl?: string | null,
            linkedinUrl?: string | null,
            websiteUrl?: string | null,
            skills?: string[]
        }) => {
            const res = await api.put("/user/profile", data)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] })
            toast.success("Profile updated successfully")
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update profile")
        }
    })
}

export const useLogout = () => {
    const router = useRouter()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async () => {
            const res = await api.post("/user/logout")
            return res.data
        },
        onSuccess: () => {
            queryClient.clear()
            toast.success("Logged out successfully")
            router.push("/auth/login")
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Logout failed")
        }
    })
}