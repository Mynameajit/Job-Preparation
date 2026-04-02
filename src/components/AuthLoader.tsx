"use client"

import { fetchUser } from "@/feature/user/userService"
import { useAppDispatch } from "@/hooks/useRedux"
import { useEffect } from "react"

export default function AuthLoader() {

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchUser())
    }, [])


    return null
}