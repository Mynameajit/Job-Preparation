"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

export default function ResumeForm({ data, setData }: any) {
  const [skillInput, setSkillInput] = useState("");
  const [language, setLanguage] = useState({ name: "", level: "" });
  const [project, setProject] = useState({
    title: "",
    description: "",
    link: "",
  });

  const [education, setEducation] = useState({
    degree: "",
    school: "",
    startDate: "",
    endDate: "",
    location: "",
  });

  const handleChange = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // ================= SKILLS =================
  const addSkill = () => {
    if (!skillInput.trim()) return;
    setData({ ...data, skills: [...data.skills, skillInput] });
    setSkillInput("");
  };

  const removeSkill = (i: number) => {
    setData({
      ...data,
      skills: data.skills.filter((_: any, index: number) => index !== i),
    });
  };

  // ================= EDUCATION =================
  const addEducation = () => {
    if (!education.degree || !education.school) return;

    setData({
      ...data,
      education: [...data.education, education],
    });

    setEducation({
      degree: "",
      school: "",
      startDate: "",
      endDate: "",
      location: "",
    });
  };

  // ================= LANGUAGE =================
  const addLanguage = () => {
    if (!language.name || !language.level) return;

    setData({
      ...data,
      languages: [...data.languages, language],
    });

    setLanguage({ name: "", level: "" });
  };

  // ================= PROJECT =================
  const addProject = () => {
    if (!project.title) return;

    setData({
      ...data,
      projects: [...data.projects, project],
    });

    setProject({ title: "", description: "", link: "" });
  };

  return (
    <div className="space-y-6">

      {/* PERSONAL */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <h2 className="font-semibold">Personal Information</h2>

          <div className="grid md:grid-cols-2 gap-3">
            <Input name="fullName" placeholder="Full Name" onChange={handleChange} />
            <Input name="email" placeholder="Email" onChange={handleChange} />
            <Input name="phone" placeholder="Phone" onChange={handleChange} />
            <Input name="location" placeholder="Location" onChange={handleChange} />
            <Input name="linkedin" placeholder="LinkedIn" onChange={handleChange} />
            <Input name="github" placeholder="GitHub" onChange={handleChange} />
          </div>

          <Input name="heading" placeholder="Heading" onChange={handleChange} />
        </CardContent>
      </Card>

      {/* SUMMARY */}
      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold mb-2">Professional Summary</h2>
          <Textarea name="summary" placeholder="Summary" onChange={handleChange} />
        </CardContent>
      </Card>

      {/* EDUCATION */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h2 className="font-semibold">Education</h2>

          <div className="grid md:grid-cols-2 gap-3">
            <Input placeholder="Degree" onChange={(e) => setEducation({ ...education, degree: e.target.value })} />
            <Input placeholder="Collage/University" onChange={(e) => setEducation({ ...education, school: e.target.value })} />
            <Input placeholder="Start Date" onChange={(e) => setEducation({ ...education, startDate: e.target.value })} />
            <Input placeholder="End Date" onChange={(e) => setEducation({ ...education, endDate: e.target.value })} />
            <Input placeholder="Location" className="md:col-span-2" onChange={(e) => setEducation({ ...education, location: e.target.value })} />
          </div>

          <Button onClick={addEducation}>+ Add Education</Button>
        </CardContent>
      </Card>

      {/* SKILLS */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h2 className="font-semibold">Skills</h2>

          <div className="flex gap-2">
            <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Add skill (React, Node...)" />
            <Button onClick={addSkill}>Add</Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill: string, i: number) => (
              <div key={i} className="bg-black text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {skill}
                <span onClick={() => removeSkill(i)} className="cursor-pointer">✕</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* LANGUAGES */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h2 className="font-semibold">Languages</h2>

          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Language (Hindi)"
              onChange={(e) => setLanguage({ ...language, name: e.target.value })}
            />

            <select
              className="border rounded px-2 bg-white dark:bg-gray-800"
              onChange={(e) => setLanguage({ ...language, level: e.target.value })}
            >
              <option value="">Select Level</option>
              <option>Native</option>
              <option>Fluent</option>
              <option>Intermediate</option>
              <option>Basic</option>
            </select>
          </div>

          <Button onClick={addLanguage}>+ Add Language</Button>

          {data.languages.map((lang: any, i: number) => (
            <div key={i} className="text-sm">
              {lang.name} - <span className="text-gray-500">{lang.level}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* PROJECTS */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h2 className="font-semibold">Projects</h2>

          <Input placeholder="Project Title" onChange={(e) => setProject({ ...project, title: e.target.value })} />

          <Textarea placeholder="Description" onChange={(e) => setProject({ ...project, description: e.target.value })} />

          <Input placeholder="Project Link" onChange={(e) => setProject({ ...project, link: e.target.value })} />

          <Button onClick={addProject}>+ Add Project</Button>

          {data.projects.map((p: any, i: number) => (
            <div key={i} className="border p-2 rounded">
              <h3 className="font-medium">{p.title}</h3>
              <p className="text-sm">{p.description}</p>
              <a href={p.link} className="text-blue-500 text-xs">{p.link}</a>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
}