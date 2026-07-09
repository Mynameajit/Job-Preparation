"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  Trash2,
  Download,
  Mail,
  Phone,
  MapPin,
  Globe,
  User,
  Layout,
  BookOpen,
  Award,
  Code2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Printer,
  File
} from "lucide-react"
import { toast } from "sonner"


// Types for Resume Data
interface Education {
  id: string
  school: string
  degree: string
  startYear: string
  endYear: string
  location: string
}

interface Language {
  id: string
  language: string
  proficiency: string
}

interface Project {
  id: string
  title: string
  description: string
  link: string
  date: string
}

interface ResumeData {
  personal: {
    fullName: string
    tagline: string
    email: string
    phone: string
    location: string
    linkedin: string
    github: string
    website: string
  }
  summary: string
  education: Education[]
  skills: {
    frontend: string[]
    backend: string[]
    database: string[]
    tools: string[]
  }
  languages: Language[]
  projects: Project[]
}

/**
 * Premium Resume Builder Page.
 * Side-by-side layout for large screens.
 * A4-formatted real-time preview.
 * Exact PDF export match.
 */
export default function ResumeBuilderPage() {
  const exportRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState<string | null>(null)

  const [resumeData, setResumeData] = useState<ResumeData>({
    personal: {
      fullName: "Ajit Kumar Verma",
      tagline: "Full Stack Web Developer (MERN)",
      email: "ajitkumar96411@gmail.com",
      phone: "7667040574",
      location: "Deoghar, Jharkhand, India",
      linkedin: "linkedin.com/in/ajit",
      github: "github.com/mynameajit",
      website: "dev-ajit.vercel.app"
    },
    summary: "Full Stack Web Developer with practical experience in MERN stack development. Experienced in building responsive user interfaces, REST APIs, authentication systems, and deploying applications using modern tools like Vercel and Render.",
    education: [
      { id: "1", school: "GLA University, Mathura", degree: "Bachelor of Computer Applications (BCA)", startYear: "07/2023", endYear: "Present", location: "Mathura, India" },
      { id: "2", school: "SB Roy High School, Simra", degree: "Intermediate (12th)", startYear: "2019", endYear: "2021", location: "Deoghar, Jharkhand, India" }
    ],
    skills: {
      frontend: ["HTML", "CSS", "JavaScript (ES6+)", "React.js", "Material UI (MUI)", "Tailwind CSS", "Responsive Design"],
      backend: ["Node.js", "Express.js", "REST APIs", "JWT Authentication", "Role-Based Access Control"],
      database: ["MongoDB", "Firebase"],
      tools: ["Git", "GitHub", "Vercel", "Render"]
    },
    languages: [
      { id: "1", language: "Hindi", proficiency: "Native" },
      { id: "2", language: "English", proficiency: "Basic" }
    ],
    projects: [
      { id: "1", title: "SwadMitra", description: "Full Stack Food Delivery Web Application", link: "https://swadmitra.vercel.app/", date: "8/2024 - 10/2025" },
      { id: "2", title: "Real-Time Chat Application (Chatora)", description: "High performance chat app", link: "https://devloper-ajit--chatapp.web.app/", date: "06/2024 - 07/2024" }
    ]
  })

  // Handlers
  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setResumeData(prev => ({
      ...prev,
      personal: { ...prev.personal, [name]: value }
    }))
  }

  const addSkill = (category: keyof typeof resumeData.skills, skill: string) => {
    if (skill && !resumeData.skills[category].includes(skill)) {
      setResumeData(prev => ({
        ...prev,
        skills: { ...prev.skills, [category]: [...prev.skills[category], skill] }
      }))
    }
  }

  const removeSkill = (category: keyof typeof resumeData.skills, skill: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: { ...prev.skills, [category]: prev.skills[category].filter(s => s !== skill) }
    }))
  }

  const addEducation = () => {
    const newEdu: Education = { id: Date.now().toString(), school: "", degree: "", startYear: "", endYear: "", location: "" }
    setResumeData(prev => ({ ...prev, education: [...prev.education, newEdu] }))
  }

  const removeEducation = (id: string) => {
    setResumeData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }))
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(e => (e.id === id ? { ...e, [field]: value } : e))
    }))
  }

  const addProject = () => {
    const newProj: Project = { id: Date.now().toString(), title: "", description: "", link: "", date: "" }
    setResumeData(prev => ({ ...prev, projects: [...prev.projects, newProj] }))
  }

  const removeProject = (id: string) => {
    setResumeData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }))
  }

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(p => (p.id === id ? { ...p, [field]: value } : p))
    }))
  }

  const handleDownloadPDF = async () => {
    if (!exportRef.current || isExporting) return
    
    const toastId = toast.loading("Generating your resume PDF...")
    setIsExporting("pdf")

    try {
      const jspdfModule = await import("jspdf")
      const jsPDF = jspdfModule.jsPDF || jspdfModule.default || jspdfModule

      const element = exportRef.current

      // Add a small delay for any rendering to complete
      await new Promise(resolve => setTimeout(resolve, 500))

      // @ts-ignore
      const htmlToImageModule = await import("@/lib/html-to-image.js");
      const htmlToImage = htmlToImageModule.default || htmlToImageModule;
      const toJpeg = htmlToImage.toJpeg || (window as any).htmlToImage?.toJpeg;

      if (!toJpeg) {
         throw new Error("Could not initialize html-to-image rendering engine");
      }

      const imgData = await toJpeg(element, {
        quality: 1,
        backgroundColor: "#ffffff",
        pixelRatio: 2 // High DPI for clear text
      });
      
      const pdfWidth = 210; // A4 width in mm
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Calculate scaled height based on original element dimensions
      const canvasRatio = element.offsetHeight / element.offsetWidth
      const canvasHeightInMm = pdfWidth * canvasRatio

      // Pagination support for long resumes
      let heightLeft = canvasHeightInMm
      let position = 0

      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, canvasHeightInMm)
      heightLeft -= 297

      while (heightLeft > 1) {
        position -= 297
        pdf.addPage()
        pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, canvasHeightInMm)
        heightLeft -= 297
      }
      
      const fileName = `${resumeData.personal.fullName.trim().replace(/\s+/g, '_')}_Resume.pdf`
      pdf.save(fileName)
      
      toast.success("Resume PDF downloaded!", { id: toastId })
    } catch (error: any) {
      console.error("PDF Export Error:", error)
      toast.error(`Error: ${error.message || "Could not generate PDF"}`, { id: toastId })
    } finally {
      setIsExporting(null)
    }
  }

  const handleDownloadPNG = async () => {
    if (!exportRef.current || isExporting) return
    setIsExporting("png")
    const toastId = toast.loading("Generating PNG image...")

    try {
      const element = exportRef.current
      await new Promise(resolve => setTimeout(resolve, 500))

      // @ts-ignore
      const htmlToImageModule = await import("@/lib/html-to-image.js");
      const htmlToImage = htmlToImageModule.default || htmlToImageModule;
      const toPng = htmlToImage.toPng || (window as any).htmlToImage?.toPng || htmlToImage.toJpeg;

      if (!toPng) throw new Error("Could not initialize html-to-image");

      const dataUrl = await toPng(element, { quality: 1, backgroundColor: "#ffffff", pixelRatio: 2 });
      
      const link = document.createElement("a")
      link.download = `${resumeData.personal.fullName.trim().replace(/\s+/g, '_')}_Resume.png`
      link.href = dataUrl
      link.click()
      
      toast.success("PNG downloaded!", { id: toastId })
    } catch (error: any) {
      console.error("PNG Export Error:", error)
      toast.error(`Error: ${error.message || "Could not generate PNG"}`, { id: toastId })
    } finally {
      setIsExporting(null)
    }
  }

  const handleDownloadDOC = () => {
    const toastId = toast.loading("Generating Word Document...")
    try {
      const element = exportRef.current
      if (!element) throw new Error("Resume container not found")
      
      // Inline styles for basic word compatibility
      const html = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>Resume</title>
          <style>
            body { font-family: 'Inter', sans-serif, Arial; color: #000; }
            h1, h2, h3, h4 { color: #000; margin-bottom: 5px; }
            .section-title { border-bottom: 2px solid #4f46e5; padding-bottom: 2px; margin-bottom: 10px; font-weight: bold; font-size: 14px; color: #4338ca; }
            .contact-info { text-align: center; font-size: 12px; margin-bottom: 15px; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; padding: 10px 0; }
          </style>
        </head>
        <body>
          <div style="text-align:center;">
            <h1 style="font-size:24pt; margin:0;">${resumeData.personal.fullName}</h1>
            <p style="font-size:12pt; font-style:italic;">${resumeData.personal.tagline}</p>
          </div>
          <div class="contact-info">
            ${resumeData.personal.email ? `<span>Email: ${resumeData.personal.email} | </span>` : ''}
            ${resumeData.personal.phone ? `<span>Phone: ${resumeData.personal.phone} | </span>` : ''}
            ${resumeData.personal.location ? `<span>Location: ${resumeData.personal.location} | </span>` : ''}
            ${resumeData.personal.linkedin ? `<span>LinkedIn: ${resumeData.personal.linkedin} | </span>` : ''}
            ${resumeData.personal.github ? `<span>GitHub: ${resumeData.personal.github}</span>` : ''}
          </div>
          
          <h2 class="section-title">PROFESSIONAL SUMMARY</h2>
          <p>${resumeData.summary}</p>
          
          <h2 class="section-title">EDUCATION</h2>
          ${resumeData.education.map(edu => `
            <div style="margin-bottom: 10px;">
              <strong>${edu.degree}</strong> - ${edu.startYear} to ${edu.endYear}<br>
              <em>${edu.school}</em>
            </div>
          `).join('')}

          <h2 class="section-title">TECHNICAL SKILLS</h2>
          <ul>
            <li><strong>Frontend:</strong> ${resumeData.skills.frontend.join(", ")}</li>
            <li><strong>Backend:</strong> ${resumeData.skills.backend.join(", ")}</li>
            <li><strong>Database:</strong> ${resumeData.skills.database.join(", ")}</li>
            <li><strong>Tools:</strong> ${resumeData.skills.tools.join(", ")}</li>
          </ul>

          <h2 class="section-title">KEY PROJECTS</h2>
          ${resumeData.projects.map(proj => `
            <div style="margin-bottom: 10px;">
              <strong>${proj.title}</strong> (${proj.date})<br>
              <em>${proj.description}</em><br>
              ${proj.link ? `<a href="${proj.link}">${proj.link}</a>` : ''}
            </div>
          `).join('')}

          <h2 class="section-title">LANGUAGES</h2>
          <ul>
            ${resumeData.languages.map(lang => `
              <li><strong>${lang.language}:</strong> ${lang.proficiency}</li>
            `).join('')}
          </ul>
        </body>
        </html>
      `
      
      const blob = new Blob(['\ufeff', html], { type: 'application/msword' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${resumeData.personal.fullName.trim().replace(/\s+/g, '_')}_Resume.doc`
      link.click()
      URL.revokeObjectURL(url)
      toast.success("Word Document downloaded!", { id: toastId })
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, { id: toastId })
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      <div className="min-h-screen px-2 md:px-8 py-1 print:hidden">
        {/* Header with Dashboard-style Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-1">
          <div>
            <h1 className="text-3xl font-semibold tracking-tighter text-indigo-600 dark:text-indigo-400">RESUME PRO</h1>
            <p className="text-slate-500 text-[14px] font-medium">Create and Export perfectly formatted A4 resumes.</p>
          </div>
          <div className="flex gap-2">
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button disabled={!!isExporting} className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed">
                    {isExporting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
                    {isExporting === "pdf" ? "GENERATING PDF..." : isExporting === "png" ? "GENERATING PNG..." : "EXPORT OPTIONS"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-xl shadow-xl border-indigo-100 p-2">
                  <DropdownMenuItem onClick={handleDownloadPDF} className="cursor-pointer font-medium py-3 rounded-lg focus:bg-indigo-50 focus:text-indigo-700 dark:focus:bg-indigo-950">
                    <FileText className="mr-3 h-5 w-5 text-red-500" /> Download as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownloadPNG} className="cursor-pointer font-medium py-3 rounded-lg focus:bg-indigo-50 focus:text-indigo-700 dark:focus:bg-indigo-950">
                    <ImageIcon className="mr-3 h-5 w-5 text-indigo-500" /> Download as Image (PNG)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownloadDOC} className="cursor-pointer font-medium py-3 rounded-lg focus:bg-indigo-50 focus:text-indigo-700 dark:focus:bg-indigo-950">
                    <File className="mr-3 h-5 w-5 text-blue-600" /> Download for MS Word (.doc)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handlePrint} className="cursor-pointer font-medium py-3 rounded-lg focus:bg-indigo-50 focus:text-indigo-700 dark:focus:bg-indigo-950">
                    <Printer className="mr-3 h-5 w-5 text-gray-700 dark:text-gray-300" /> Print Resume
                  </DropdownMenuItem>
                </DropdownMenuContent>
             </DropdownMenu>
          </div>
        </div>

        {/* Main Side-by-Side Content */}
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center max-w-[1600px] mx-auto overflow-hidden h-[calc(100vh-180px)] py-3">

          {/* Left Side: Form Editor */}
          <div className="w-full lg:w-1/2 h-full overflow-y-auto pr-2 custom-scrollbar">
            <Card className="border-none shadow-xl backdrop-blur-xl rounded-2xl overflow-hidden">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-5 p-1 rounded-none">
                  <TabsTrigger value="personal" title="Personal Info"><User className="h-4 w-4" /></TabsTrigger>
                  <TabsTrigger value="education" title="Education"><BookOpen className="h-4 w-4" /></TabsTrigger>
                  <TabsTrigger value="skills" title="Skills"><Code2 className="h-4 w-4" /></TabsTrigger>
                  <TabsTrigger value="projects" title="Projects"><Layout className="h-4 w-4" /></TabsTrigger>
                  <TabsTrigger value="extra" title="Languages"><Award className="h-4 w-4" /></TabsTrigger>
                </TabsList>

                <div className="p-6 custom-scrollbar">
                  {/* Personal Information Tab */}
                  <TabsContent value="personal" className="mt-0 space-y-4">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input name="fullName" value={resumeData.personal.fullName} onChange={handlePersonalChange} />
                      </div>
                      <div className="space-y-2">
                        <Label>Professional Tagline</Label>
                        <Input name="tagline" value={resumeData.personal.tagline} onChange={handlePersonalChange} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2"><Label>Email</Label><Input name="email" value={resumeData.personal.email} onChange={handlePersonalChange} /></div>
                        <div className="space-y-2"><Label>Phone</Label><Input name="phone" value={resumeData.personal.phone} onChange={handlePersonalChange} /></div>
                      </div>
                      <div className="space-y-2"><Label>Location</Label><Input name="location" value={resumeData.personal.location} onChange={handlePersonalChange} /></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2"><Label>LinkedIn</Label><Input name="linkedin" value={resumeData.personal.linkedin} onChange={handlePersonalChange} /></div>
                        <div className="space-y-2"><Label>GitHub</Label><Input name="github" value={resumeData.personal.github} onChange={handlePersonalChange} /></div>
                      </div>
                      <div className="space-y-2"><Label>Website</Label><Input name="website" value={resumeData.personal.website} onChange={handlePersonalChange} /></div>
                      <div className="space-y-2">
                        <Label>Professional Summary</Label>
                        <Textarea value={resumeData.summary} onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))} className="min-h-[120px]" />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Education Tab */}
                  <TabsContent value="education" className="mt-0 space-y-4">
                    {resumeData.education.map((edu) => (
                      <div key={edu.id} className="p-4 border rounded-xl relative group bg-indigo-50/30 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30">
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeEducation(edu.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                        <div className="space-y-3">
                          <Input value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} placeholder="Degree" />
                          <Input value={edu.school} onChange={(e) => updateEducation(edu.id, "school", e.target.value)} placeholder="School/University" />
                          <div className="grid grid-cols-2 gap-2">
                            <Input value={edu.startYear} onChange={(e) => updateEducation(edu.id, "startYear", e.target.value)} placeholder="Start Date" />
                            <Input value={edu.endYear} onChange={(e) => updateEducation(edu.id, "endYear", e.target.value)} placeholder="End Date" />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" onClick={addEducation} className="w-full border-dashed border-indigo-300"><Plus className="mr-2 h-4 w-4" /> Add Education</Button>
                  </TabsContent>

                  {/* Skills Tab */}
                  <TabsContent value="skills" className="mt-0 space-y-6">
                    {(["frontend", "backend", "database", "tools"] as const).map(cat => (
                      <div key={cat} className="space-y-3">
                        <Label className="capitalize font-bold text-indigo-500">{cat} Skills</Label>
                        <div className="flex gap-2">
                          <Input id={`newSkill-${cat}`} placeholder="Add skill..." onKeyDown={(e) => {
                            if (e.key === 'Enter') { addSkill(cat, e.currentTarget.value); e.currentTarget.value = '' }
                          }} />
                          <Button size="sm" onClick={() => {
                            const input = document.getElementById(`newSkill-${cat}`) as HTMLInputElement
                            addSkill(cat, input.value); input.value = ''
                          }}>Add</Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {resumeData.skills[cat].map(s => (
                            <Badge key={s} variant="secondary" className="px-2 py-1 gap-1">
                              {s} <button onClick={() => removeSkill(cat, s)}><Trash2 className="h-3 w-3" /></button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  {/* Projects Tab */}
                  <TabsContent value="projects" className="mt-0 space-y-4">
                    {resumeData.projects.map((proj) => (
                      <div key={proj.id} className="p-4 border rounded-xl relative group bg-indigo-50/30 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30">
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeProject(proj.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                        <div className="space-y-3">
                          <Input value={proj.title} onChange={(e) => updateProject(proj.id, "title", e.target.value)} placeholder="Title" />
                          <Input value={proj.date} onChange={(e) => updateProject(proj.id, "date", e.target.value)} placeholder="Date Range" />
                          <Input value={proj.description} onChange={(e) => updateProject(proj.id, "description", e.target.value)} placeholder="Description" />
                          <Input value={proj.link} onChange={(e) => updateProject(proj.id, "link", e.target.value)} placeholder="Project Link" />
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" onClick={addProject} className="w-full border-dashed border-indigo-300"><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
                  </TabsContent>

                  {/* Extra (Languages) */}
                  <TabsContent value="extra" className="mt-0 space-y-6">
                    <div className="space-y-4">
                      <Label className="font-bold">Languages</Label>
                      {resumeData.languages.map(lang => (
                        <div key={lang.id} className="flex gap-4 items-center">
                          <Input value={lang.language} placeholder="Language" onChange={(e) => {
                            setResumeData(prev => ({ ...prev, languages: prev.languages.map(l => l.id === lang.id ? { ...l, language: e.target.value } : l) }))
                          }} />
                          <select className="bg-slate-50 dark:bg-slate-800 border rounded-md p-2 text-sm flex-1" value={lang.proficiency} onChange={(e) => {
                            setResumeData(prev => ({ ...prev, languages: prev.languages.map(l => l.id === lang.id ? { ...l, proficiency: e.target.value } : l) }))
                          }}>
                            <option value="Native">Native</option><option value="Fluent">Fluent</option><option value="Basic">Basic</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          </div>

          {/* Right Side: Visual Preview Container (Scaled Down to fit without scrolling) */}
          <div className="hidden lg:flex w-1/2 h-full rounded-2xl justify-center items-start overflow-hidden pt-4">
            <div className="origin-top transform-gpu scale-[0.45] xl:scale-[0.55] 2xl:scale-[0.65] transition-all duration-300 shadow-2xl">
              <ResumeTemplate data={resumeData} />
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Export Container - Becomes visible only when printing */}
      <div className="hidden print:flex print:justify-center print:w-full print:bg-white print:m-0 print:p-0">
        <ResumeTemplate data={resumeData} />
      </div>

      {/* Hidden Container strictly for JS Export (PDF/PNG) to ensure rendering isn't clipped */}
      <div
        className="fixed -left-[9999px] top-0 pointer-events-none print:hidden"
        style={{ width: "210mm", backgroundColor: "#ffffff" }}
      >
        <div ref={exportRef} style={{ width: "210mm", minHeight: "297mm", backgroundColor: "#ffffff" }}>
          <ResumeTemplate data={resumeData} />
        </div>
      </div>
    </>
  )
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="border-b-2 border-[#4f46e5] pt-3 pb-0.5 mb-2">
      <h2 className="text-[10pt] font-black tracking-wider text-[#4338ca]">{title}</h2>
    </div>
  )
}

function ResumeTemplate({ data }: { data: ResumeData }) {
  return (
    <div
      className="p-[15mm]"
      style={{
        backgroundColor: "#ffffff",
        color: "#000000",
        width: "210mm",
        minHeight: "297mm",
        boxSizing: "border-box",
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-[26pt] font-extrabold leading-tight tracking-tight" style={{ fontFamily: "serif" }}>{data.personal.fullName}</h1>
          <p className="text-[11pt] italic font-medium text-[#1e293b]">{data.personal.tagline}</p>
        </div>

        {/* Contacts */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-[9pt] font-medium border-b border-t py-3 border-[#e2e8f0]">
          {data.personal.email && <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {data.personal.email}</span>}
          {data.personal.phone && <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {data.personal.phone}</span>}
          {data.personal.location && <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {data.personal.location}</span>}
          {data.personal.linkedin && <span className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> {data.personal.linkedin}</span>}
          {data.personal.github && <span className="flex items-center gap-1.5"><Code2 className="h-3.5 w-3.5" /> {data.personal.github}</span>}
        </div>

        {/* Profile */}
        <SectionTitle title="PROFESSIONAL SUMMARY" />
        <p className="text-[9.5pt] leading-snug text-justify font-medium">{data.summary}</p>

        {/* Education */}
        <SectionTitle title="EDUCATION" />
        <div className="space-y-4">
          {data.education.map(edu => (
            <div key={edu.id} className="space-y-0.5">
              <div className="flex justify-between items-baseline font-bold text-[10pt]">
                <h3>{edu.degree}</h3>
                <span>{edu.startYear} – {edu.endYear}</span>
              </div>
              <p className="text-[9pt] italic font-medium">{edu.school}</p>
            </div>
          ))}
        </div>

        {/* Skills */}
        <SectionTitle title="TECHNICAL SKILLS" />
        <div className="grid grid-cols-2 gap-4">
          {(["frontend", "backend", "database", "tools"] as const).map(cat => (
            <div key={cat} className="space-y-1">
              <h4 className="text-[9pt] font-bold capitalize text-[#4338ca]">{cat}</h4>
              <p className="text-[8.5pt] font-medium leading-normal">{data.skills[cat].join(", ")}</p>
            </div>
          ))}
        </div>

        {/* Projects */}
        <SectionTitle title="KEY PROJECTS" />
        <div className="space-y-4">
          {data.projects.map(proj => (
            <div key={proj.id} className="space-y-1">
              <div className="flex justify-between items-baseline font-bold text-[10pt]">
                <h3>{proj.title}</h3>
                <span>{proj.date}</span>
              </div>
              <p className="text-[9pt] italic font-medium">{proj.description}</p>
              {proj.link && <p className="text-[8pt] font-medium text-[#1d4ed8] underline">{proj.link}</p>}
            </div>
          ))}
        </div>

        {/* Languages */}
        <SectionTitle title="LANGUAGES" />
        <div className="flex flex-wrap gap-x-8 text-[9pt] font-medium">
          {data.languages.map(lang => (
            <span key={lang.id} className="flex gap-2"><strong>{lang.language}:</strong> {lang.proficiency}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
