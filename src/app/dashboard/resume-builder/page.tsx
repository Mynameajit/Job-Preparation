"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ResumeForm from "@/components/dashboard/resume-builder/ResumeForm";
import ResumePreview from "@/components/dashboard/resume-builder/ResumePreview";
import { generateResumePDF } from "@/lib/generateResumePDF";

// TYPES FIXED
type Education = {
  degree: string;
  school: string;
  startDate: string;
  endDate: string;
  location: string;
};

type Project = {
  title: string;
  description: string;
  link: string;
};

type Language = {
  name: string;
  level: string;
};

type ResumeData = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  heading: string;
  summary: string;
  skills: string[];
  education: Education[];
  languages: Language[];
  projects: Project[];
};

export default function ResumeBuilder() {
  const [data, setData] = useState<ResumeData>({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    heading: "",
    summary: "",
    skills: [],
    education: [],
    languages: [],
    projects: [],
  });

  // LOAD FROM LOCALSTORAGE
  useEffect(() => {
    const saved = localStorage.getItem("resumeData");
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  // AUTO SAVE
  useEffect(() => {
    localStorage.setItem("resumeData", JSON.stringify(data));
  }, [data]);

  return (
    <div className="p-4 space-y-4">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

        <div>
          <h1 className="text-2xl font-bold">Resume Builder</h1>
          <p className="text-muted-foreground text-sm">
            Create a professional ATS-friendly resume
          </p>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-2">
          <Button onClick={() => {
            console.log("PDF clicked")
            generateResumePDF(data)
          }}>
            Download PDF
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              localStorage.setItem("resumeData", JSON.stringify(data))
            }
          >
            Save
          </Button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT FORM */}
        <div className="h-[85vh] overflow-y-auto pr-2 scrollbar-hide">
          <ResumeForm data={data} setData={setData} />
        </div>

        {/* RIGHT PREVIEW */}
        <div className="h-[95vh] overflow-y-auto border rounded-xl bg-gray-white shadow-lg dark:bg-gray-900 p-4 scrollbar-hide">
          <ResumePreview data={data} />
        </div>

      </div>
    </div >
  );
}