"use client"

import { configureStore } from "@reduxjs/toolkit"
import userReducer from "@/feature/user/userSlice"
import questionReducer from "@/feature/question/questionSlice"
import resultReducer from "@/feature/result/resultSlice"
import testReducer   from "@/feature/test/testSlice"

export const store = configureStore({
    reducer: {
        user: userReducer,
        question: questionReducer,
        test:testReducer,
        result: resultReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch