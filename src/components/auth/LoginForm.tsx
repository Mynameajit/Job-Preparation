"use client"

import { useState } from "react"
import { motion } from "framer-motion"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"

import { loginSchema } from "@/lib/ZodSchema"
import { useRouter } from "next/navigation"
import { loginUser } from "@/feature/user/userService"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { Spinner } from "../ui/spinner"
import { useAppDispatch } from "@/hooks/useRedux"
import { Label } from "../ui/label"




export default function LoginForm() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { loading } = useSelector((state: RootState) => state.user)

  // Controls password visibility
  const [showPassword, setShowPassword] = useState(false)

  // Form data state
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  // Validation errors
  const [errors, setErrors] = useState<any>({})



  // Handle input change and run validation
  const handleChange = (e: any) => {
    const { name, value } = e.target
    const updatedData = {
      ...formData,
      [name]: value
    }

    setFormData(updatedData)

    // Validate form with updated values
    const validation = loginSchema.safeParse(updatedData)

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors
      setErrors(fieldErrors)

    } else {
      setErrors({})
    }

  }



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {

      const validation = loginSchema.safeParse(formData)

      if (!validation.success) {
        const fieldErrors = validation.error.flatten().fieldErrors
        setErrors(fieldErrors)
        return
      }

      const data = await dispatch(loginUser(formData)).unwrap()

      if (data.success) {
        router.push("/dashboard")
      }

    } catch (error) {
      console.log(error)
    }
  }


  return (

    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="lg:w-md max-w-lg sm:w-full h-full rounded-xl p-8"
    >

      {/* Title */}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-violet-600 font-serif">
          Welcome Back
        </h2>
      </motion.div>


      <form
        onSubmit={handleLogin}
        className="space-y-5"
      >

        {/* Email Field */}

        <div>

          <Label className="mb-0.5 text-lg">
            Email
          </Label>

          <Input
            name="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
          />

          {errors?.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email[0]}
            </p>
          )}

        </div>



        {/* Password Field */}

        <div className="relative">

          <Label className="mb-0.5 text-lg">
            Password
          </Label>

          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>

          {errors?.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password[0]}
            </p>
          )}

        </div>



        {/* Forgot Password */}

        <div className="flex items-center justify-between text-sm">

          <span className="text-violet-600 cursor-pointer">
            Forgot password?
          </span>

        </div>

        {/* Submit Button */}

        <Button
          disabled={loading.login}
          type="submit"
          className="w-full bg-linear-to-r from-violet-600 to-purple-600 text-white py-4"
        >
          {
            loading.login ? (
              <>
                <Spinner className="size-6" data-icon="inline-start" />
                Login....
              </>
            ) : "Login In"
          }

        </Button>

      </form>



      {/* Register Redirect */}

      <p className="text-center text-sm mt-6">
        Don't have an account?
        <Link
          href="/auth/register"
          className="text-violet-600 ml-1 cursor-pointer"
        >
          Sign up
        </Link>
      </p>

    </motion.div>
  )
}