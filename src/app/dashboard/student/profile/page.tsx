"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useUser, useUpdateProfile, useLogout } from "@/hooks/api/useUser"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import api from "@/lib/api"

import {
  Camera,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Globe,
  GraduationCap,
  Briefcase,
  Layers,
  Edit3,
  ExternalLink,
  Trash2,
  Loader2,
  Plus,
  X
} from "lucide-react"
import { useRouter } from "next/navigation"

/**
 * Premium, Dynamic & Professional Profile Page.
 * Optimized for desktop and mobile with glassmorphism and smooth animations.
 */
export default function StudentProfilePage() {
  const { data: userResponse, isLoading, isError } = useUser()
  const updateProfile = useUpdateProfile()
  const logout = useLogout()
  const router = useRouter()
  const user = userResponse?.data?.user
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [bio, setBio] = useState("")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [newSkill, setNewSkill] = useState("")

  // Edit form state
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    githubUrl: "",
    linkedinUrl: "",
    websiteUrl: "",
    skills: [] as string[]
  })

  // Initialize form when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        location: user.location || "",
        githubUrl: user.githubUrl || "",
        linkedinUrl: user.linkedinUrl || "",
        websiteUrl: user.websiteUrl || "",
        skills: user.skills || []
      })
    }
  }, [user])

  if (isLoading) return <ProfileSkeleton />
  if (isError || !user) return <ProfileError />

  const handleLogout = () => {
    logout.mutate()
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await api.post("/user/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      if (res.data.success) {
        updateProfile.mutate({ profilePhoto: res.data.data.url })
      }
    } catch (error) {
      toast.error("Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleUpdateProfile = () => {
    updateProfile.mutate(formData, {
      onSuccess: () => setIsEditModalOpen(false)
    })
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleDeletePhoto = () => {
    if (confirm("Are you sure you want to remove your profile photo?")) {
      updateProfile.mutate({ profilePhoto: null })
    }
  }

  const handleDeleteBio = () => {
    if (confirm("Are you sure you want to clear your bio?")) {
      updateProfile.mutate({ bio: null }, {
        onSuccess: () => {
          setFormData(prev => ({ ...prev, bio: "" }))
          setIsEditModalOpen(false)
        }
      })
    }
  }

  return (
    <div className="min-h-screen w-full p-2 md:p-8 flex items-start justify-center relative overflow-y-auto custom-scrollbar">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handlePhotoUpload}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-7xl z-10"
      >
        <Card className="backdrop-blur-xl overflow-hidden rounded-[2.5rem] flex flex-col md:flex-row ">

          {/* Sidebar / Profile Summary */}
          <div className="w-full md:w-1/3 bg-gradient-to-b from-white/[0.05] to-transparent p-8 md:p-12 flex flex-col items-center justify-between text-center border-r border-white/5">
            <div className="space-y-8 w-full">
              <div className="relative inline-block group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                <Avatar className="h-44 w-44 border-4 border-white/10 shadow-2xl transition-all duration-700 group-hover:scale-[1.02] relative z-10">
                  <AvatarImage src={user.profilePhoto || ""} className="object-cover" />
                  <AvatarFallback className="bg-slate-800 text-4xl font-bold ">
                    {user.name?.split(" ").map((n: string) => n[0]).join("") || "ST"}
                  </AvatarFallback>
                </Avatar>

                <div className="absolute -bottom-1 -right-1 flex gap-1.5 z-20">
                  {user.profilePhoto && (
                    <button 
                      onClick={handleDeletePhoto}
                      className="bg-red-500/90 backdrop-blur-md p-1.5 rounded-full shadow-lg hover:scale-110 transition-all border border-white/20 hover:bg-red-500"
                      title="Delete Photo"
                    >
                      <Trash2 className="h-3 w-3 text-white" />
                    </button>
                  )}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || updateProfile.isPending}
                    className="bg-blue-600 p-2 rounded-full shadow-lg hover:scale-110 transition-all border-2 border-[#121214] hover:bg-blue-500 disabled:opacity-50"
                    title="Change Photo"
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 text-white animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4 text-white" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight ">{user.name}</h1>
                <div className="flex flex-col items-center gap-1">
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-0.5 text-[10px] font-bold uppercase tracking-tighter">
                    {user.role}
                  </Badge>
                  <p className=" font-medium text-sm mt-2">{user.location || "Location not set"}</p>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <SocialIcon icon={<GithubIcon className="h-5 w-5" />} href={user.githubUrl} />
                <SocialIcon icon={<LinkedinIcon className="h-5 w-5" />} href={user.linkedinUrl} />
                <SocialIcon icon={<Globe className="h-5 w-5" />} href={user.websiteUrl} />
              </div>
            </div>

            <Button
              onClick={handleLogout}
              disabled={logout.isPending}
              variant="ghost"
              className="mt-12  hover:text-red-400 hover:bg-red-400/5 rounded-2xl px-8 gap-2 w-full transition-all duration-300 border border-transparent hover:border-red-400/10"
            >
              {logout.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
              Sign Out
            </Button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-8 md:p-12 space-y-12">
            {/* Header Actions */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold  flex items-center gap-2">
                <div className="h-8 w-1 bg-blue-500 rounded-full" />
                Student Portfolio
              </h2>
              <Button
                onClick={() => setIsEditModalOpen(true)}
                variant="outline"
                className="bg-white/5 border-white/10  hover:bg-white/10 rounded-xl gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
              {/* Account Info */}
              <div className="space-y-6">
                <SectionHeader icon={<Mail className="h-5 w-5" />} title="Account Details" />
                <div className="space-y-5">
                  <InfoRow icon={<Mail className="h-4 w-4 " />} label="Email Address" value={user.email} />
                  <InfoRow icon={<Layers className="h-4 w-4 " />} label="Account Type" value={user.role} />
                  <InfoRow icon={<Briefcase className="h-4 w-4 " />} label="Member Since" value={new Date(user.createdAt).toLocaleDateString()} />
                </div>
              </div>

              {/* Bio Section */}
              <div className="space-y-6">
                <SectionHeader icon={<Briefcase className="h-5 w-5" />} title="About Me" />
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6 relative overflow-hidden group h-full">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Briefcase className="h-12 w-12 text-white" />
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-3xl relative z-10 whitespace-pre-wrap">
                    {user.bio || "No bio added yet. Tell the world about your journey!"}
                  </p>
                </div>
              </div>

              {/* Skills Section */}
              <div className="md:col-span-2 space-y-6">
                <SectionHeader icon={<Layers className="h-5 w-5" />} title="Expertise & Skills" />
                <div className="flex flex-wrap gap-3">
                  {user.skills && user.skills.length > 0 ? (
                    user.skills.map((skill: string) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-white/5 text-slate-300 hover:bg-blue-500/20 hover:text-blue-300 border border-white/5 px-4 py-2 text-xs font-medium rounded-xl transition-all duration-300 cursor-default"
                      >
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm italic">No skills listed yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Edit Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-[#121214] border-white/10 text-white rounded-[2rem] overflow-hidden p-0 shadow-2xl">
          <div className="p-8 space-y-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-xl">
                  <Edit3 className="h-5 w-5 text-blue-500" />
                </div>
                Edit Profile
              </DialogTitle>
              <p className="text-slate-400 text-sm">Update your personal details and professional profile.</p>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2.5">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="Your Name"
                  className="bg-white/5 border-white/10 rounded-xl focus:ring-blue-500/50 h-11"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              {/* Location */}
              <div className="space-y-2.5">
                <Label htmlFor="location" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="City, Country"
                  className="bg-white/5 border-white/10 rounded-xl focus:ring-blue-500/50 h-11"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              {/* Skills Management */}
              <div className="md:col-span-2 space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                  Skills & Expertise
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill (e.g. React, Python)"
                    className="bg-white/5 border-white/10 rounded-xl focus:ring-blue-500/50 h-11 flex-1"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  />
                  <Button 
                    type="button"
                    onClick={handleAddSkill}
                    className="bg-blue-600 hover:bg-blue-500 h-11 rounded-xl px-4"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                  {formData.skills.length > 0 ? (
                    formData.skills.map((skill) => (
                      <Badge 
                        key={skill} 
                        variant="secondary" 
                        className="bg-blue-500/10 text-blue-300 border-blue-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2 group"
                      >
                        {skill}
                        <button 
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-red-400 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                  ) : (
                    <p className="text-slate-600 text-xs italic py-1">No skills added yet.</p>
                  )}
                </div>
              </div>

              {/* GitHub */}
              <div className="space-y-2.5">
                <Label htmlFor="github" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                  GitHub Profile
                </Label>
                <div className="relative group">
                  <GithubIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <Input
                    id="github"
                    placeholder="github.com/username"
                    className="bg-white/5 border-white/10 rounded-xl focus:ring-blue-500/50 h-11 pl-10"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                  />
                </div>
              </div>

              {/* LinkedIn */}
              <div className="space-y-2.5">
                <Label htmlFor="linkedin" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                  LinkedIn Profile
                </Label>
                <div className="relative group">
                  <LinkedinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <Input
                    id="linkedin"
                    placeholder="linkedin.com/in/username"
                    className="bg-white/5 border-white/10 rounded-xl focus:ring-blue-500/50 h-11 pl-10"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="md:col-span-2 space-y-2.5">
                <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                  Professional Bio
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about your journey, skills, and goals..."
                  className="min-h-[120px] bg-white/5 border-white/10 rounded-xl focus:ring-blue-500/50 resize-none p-4"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                />
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/5">
              <Button
                variant="ghost"
                onClick={handleDeleteBio}
                disabled={updateProfile.isPending || !user.bio}
                className="text-red-400 hover:text-red-300 hover:bg-red-400/5 rounded-xl px-6 order-2 sm:order-1 h-11"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Bio
              </Button>
              <div className="flex-1" />
              <div className="flex gap-3 w-full sm:w-auto order-1 sm:order-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 sm:flex-none bg-white/5 border-white/10 hover:bg-white/10 rounded-xl px-6 h-11"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateProfile}
                  disabled={updateProfile.isPending}
                  className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-8 shadow-lg shadow-blue-500/20 h-11"
                >
                  {updateProfile.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Save Profile
                </Button>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SocialIcon({ icon, href }: { icon: React.ReactNode, href?: string | null }) {
  if (!href) return (
    <div className="p-3 rounded-2xl bg-white/[0.03] text-slate-600 cursor-not-allowed border border-white/5">
      {icon}
    </div>
  )

  return (
    <a
      href={href.startsWith('http') ? href : `https://${href}`}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 rounded-2xl bg-white/[0.03] text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-300 border border-white/5 hover:border-blue-500/20 group"
    >
      <div className="group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
    </a>
  )
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function SectionHeader({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <div className="flex items-center gap-3 pb-2">
      <div className="p-2 rounded-xl ">
        {icon}
      </div>
      <h3 className="text-sm font-bold uppercase tracking-[0.2em] ">{title}</h3>
    </div>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex flex-col gap-1 group">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[10px] font-bold  uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-sm font-medium  pl-6  transition-colors duration-300">{value}</span>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="min-h-full w-full bg-[#0a0a0c] p-4 md:p-8 flex items-center justify-center">
      <Card className="w-full max-w-6xl border-white/5 bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] flex flex-col md:flex-row overflow-hidden border">
        <div className="w-full md:w-1/3 p-8 md:p-12 flex flex-col items-center gap-8 border-r border-white/5">
          <Skeleton className="h-44 w-44 rounded-full bg-white/5" />
          <div className="space-y-4 w-full">
            <Skeleton className="h-8 w-3/4 mx-auto bg-white/5" />
            <Skeleton className="h-4 w-1/2 mx-auto bg-white/5" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-xl bg-white/5" />
            <Skeleton className="h-10 w-10 rounded-xl bg-white/5" />
            <Skeleton className="h-10 w-10 rounded-xl bg-white/5" />
          </div>
        </div>
        <div className="flex-1 p-8 md:p-12 space-y-12">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-40 bg-white/5" />
            <Skeleton className="h-10 w-32 bg-white/5" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-6 w-1/2 bg-white/5" />
                <Skeleton className="h-4 w-full bg-white/5" />
                <Skeleton className="h-4 w-3/4 bg-white/5" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}

function ProfileError() {
  return (
    <div className="min-h-full w-full bg-[#0a0a0c] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-white/5 bg-white/[0.03] backdrop-blur-xl p-8 text-center rounded-3xl border">
        <div className="h-16 w-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Failed to load profile</h2>
        <p className="text-slate-400 mb-8">We couldn't retrieve your profile data. Please try logging in again.</p>
        <Button
          onClick={() => window.location.reload()}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-12"
        >
          Retry Connection
        </Button>
      </Card>
    </div>
  )
}
