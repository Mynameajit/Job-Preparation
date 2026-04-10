"use client";

import { Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";

export default function ResumePreview({ data }: any) {
  return (
    <div
      id="resume"
      className=" p-6 text-[12px] w-full max-w-[800px] mx-auto "
    >

      {/* NAME */}
      <h1 className="text-center text-xl font-bold uppercase">
        {data.fullName || "John Dev"}
      </h1>

      <p className="text-center italic text-sm">
        {data.heading || "Full Stack Web Developer (MERN)"}
      </p>

      {/* CONTACT */}
      <div className="flex flex-wrap justify-center gap-4 mt-2 text-[11px] items-center">

        <div className="flex items-center gap-1">
          <Mail size={12} /> {data.email || "johndev@gmail.com"}
        </div>

        <div className="flex items-center gap-1">
          <Phone size={12} /> {data.phone || "+91 9999999999"}
        </div>

        <div className="flex items-center gap-1">
          <MapPin size={12} /> {data.location || "India"}
        </div>

        {data.linkedin && (
          <div className="flex items-center gap-1">
            <Linkedin size={12} /> {data.linkedin}
          </div>
        )}

        {data.github && (
          <div className="flex items-center gap-1">
            <Github size={12} /> {data.github}
          </div>
        )}

      </div>

      <hr className="my-3 border-gray-400" />

      {/* PROFILE */}
      {data.summary && (
        <>
          <h2 className="font-bold uppercase ">
            Profile
          </h2>
          <p className="mt-1 text-[11px] leading-relaxed">
            {data.summary}
          </p>
          <hr className="my-3 border-gray-300" />
        </>
      )}

      {/* EDUCATION */}
      {data.education?.length > 0 && (
        <>
          <h2 className="font-bold uppercase ">
            Education
          </h2>

          <div className="mt-2 space-y-2">
            {data.education.map((edu: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between font-semibold">
                  <span>{edu.degree}</span>
                  <span className="text-[11px]">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>

                <div className="flex justify-between text-[11px] italic">
                  <span>{edu.school}</span>
                  <span>{edu.location}</span>
                </div>
              </div>
            ))}
          </div>

          <hr className="my-3 border-gray-300" />
        </>
      )}

      {/* SKILLS */}
      {data.skills?.length > 0 && (
        <>
          <h2 className="font-bold uppercase ">
            Skills
          </h2>

          <div className="flex flex-wrap gap-2 mt-2">
            {data.skills.map((skill: string, i: number) => (
              <span
                key={i}
                className="border px-2 py-[2px] rounded text-[11px]"
              >
                {skill}
              </span>
            ))}
          </div>

          <hr className="my-3 border-gray-300" />
        </>
      )}

      {/* LANGUAGES */}
      {data.languages?.length > 0 && (
        <>
          <h2 className="font-bold uppercase ">
            Languages
          </h2>

          <div className="mt-2 text-[11px] space-y-1">
            {data.languages.map((lang: any, i: number) => (
              <div key={i}>
                {lang.name} -{" "}
                <span className="italic">{lang.level}</span>
              </div>
            ))}
          </div>

          <hr className="my-3 border-gray-300" />
        </>
      )}

      {/* PROJECTS */}
      {data.projects?.length > 0 && (
        <>
          <h2 className="font-bold uppercase border-b ">
            Projects
          </h2>

          <div className="mt-2 space-y-2">
            {data.projects.map((p: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between font-semibold">
                  <span>{p.title}</span>
                  {p.link && (
                    <span className="text-[10px] text-blue-600">
                      {p.link}
                    </span>
                  )}
                </div>

                <p className="text-[11px]">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
}