"use client"

import { useState } from "react"
import { motion } from "framer-motion"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"

import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { registerUser } from "@/feature/user/userService"
import { Spinner } from "../ui/spinner"
import { registerSchema } from "@/lib/ZodSchema"
import { Label } from "../ui/label"
import { useAppDispatch } from "@/hooks/useRedux"
import { useRouter } from "next/navigation"

export default function RegisterForm() {

  const router = useRouter()

  const dispatch = useAppDispatch()

  const { loading } = useSelector((state: RootState) => state.user)
  // Controls password visibility
  const [showPassword, setShowPassword] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })
  // Validation errors
  const [errors, setErrors] = useState<any>({})

  // Handle input change and validate form
  const handleChange = (e: any) => {

    const { name, value } = e.target

    const updatedData = {
      ...formData,
      [name]: value
    }

    setFormData(updatedData)

    // Validate form using updated values
    const result = registerSchema.safeParse(updatedData)
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      setErrors(fieldErrors)

    } else {
      setErrors({})
    }
  }



  // Handle register form submission
  const handleRegister = async (e: any) => {

    e.preventDefault()

    const result = registerSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      return setErrors(fieldErrors)
    }

    try {

      const validation = registerSchema.safeParse(formData)

      if (!validation.success) {
        const fieldErrors = validation.error.flatten().fieldErrors
        setErrors(fieldErrors)
        return
      }

      const data = await dispatch(registerUser(formData)).unwrap()

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
      transition={{ duration: 0.2 }}
      className="lg:w-md w-full p-6 rounded-xl shadow-lg md:shadow-none"
    >

      {/* Register Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-violet-600">
          Create New Account
        </h2>
      </motion.div>


      <form
        onSubmit={handleRegister}
        className="space-y-5"
      >

        {/* Name Field */}

        <div>
          <Label className="mb-0.5 text-lg">
            Fullname
          </Label>

          <Input
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
          />

          {errors?.name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.name[0]}
            </p>
          )}
        </div>



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
            className="absolute right-3 top-10 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>

          {errors?.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password[0]}
            </p>
          )}

        </div>



        {/* Submit Button */}

        <Button
          type="submit"
          className="w-full bg-linear-to-r from-violet-600 to-purple-600 text-white"
        >
          {
            loading.register ? (
              <>
                <Spinner className="size-6" data-icon="inline-start" />
                Creating Account....
              </>
            ) : "Create Account"
          }

        </Button>

      </form>



      {/* Login Redirect */}

      <p className="text-center text-sm mt-6">
        Already have an account?
        <Link
          href="/auth/login"
          className="text-violet-600 ml-1 cursor-pointer"
        >
          Login
        </Link>
      </p>

    </motion.div>
  )
}