"use client";

import { useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Education {
  degree: string;
  school: string;
  startDate: string;
  endDate: string;
  location: string;
}

export default function EducationForm() {
  const [educationList, setEducationList] = useState<Education[]>([]);

  const [education, setEducation] = useState<Education>({
    degree: "",
    school: "",
    startDate: "",
    endDate: "",
    location: "",
  });

  const handleChange = (e: any) => {
    setEducation({ ...education, [e.target.name]: e.target.value });
  };

  const handleAddEducation = () => {
    if (!education.degree || !education.school) return;

    setEducationList([...educationList, education]);

    // reset form
    setEducation({
      degree: "",
      school: "",
      startDate: "",
      endDate: "",
      location: "",
    });
  };

  return (
    <CardContent className="px-4 py-3 space-y-4">
      <h2 className="font-semibold text-lg">Education</h2>

      {/* INPUTS */}
      <div className="grid md:grid-cols-2 gap-3">
        <Input
          name="degree"
          placeholder="Degree (BCA, B.Tech...)"
          value={education.degree}
          onChange={handleChange}
        />

        <Input
          name="school"
          placeholder="School / University"
          value={education.school}
          onChange={handleChange}
        />

        <Input
          name="startDate"
          placeholder="Start Date (07/2023)"
          value={education.startDate}
          onChange={handleChange}
        />

        <Input
          name="endDate"
          placeholder="End Date (Present / 2025)"
          value={education.endDate}
          onChange={handleChange}
        />

        <Input
          name="location"
          placeholder="Location (Mathura, India)"
          value={education.location}
          onChange={handleChange}
          className="md:col-span-2"
        />
      </div>

      {/* ADD BUTTON */}
      <Button onClick={handleAddEducation} className="w-full">
        + Add Education
      </Button>

      {/* PREVIEW LIST */}
      <div className="space-y-3">
        {educationList.map((edu: any, index) => (
          <div
            key={index}
            className="border rounded-lg p-3 bg-muted/30"
          >
            <div className="flex justify-between text-sm font-medium">
              <span>{edu.degree}</span>
              <span>
                {edu.startDate} - {edu.endDate}
              </span>
            </div>
            <p className="text-sm italic">{edu.school}</p>
            <p className="text-xs text-gray-500">{edu.location}</p>
          </div>
        ))}
      </div>
    </CardContent>
  );
}