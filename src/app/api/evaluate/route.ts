import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { question, answer, topic } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing in environment variables. Please add it to your .env file." },
        { status: 500 }
      );
    }

    const systemPrompt = `You are an expert technical interviewer conducting a mock interview for a ${topic || "Software Engineering"} role. 
A candidate has just answered the following interview question:
Question: "${question}"

Candidate's Answer:
"${answer}"

Evaluate their answer based on correctness, clarity, and completeness.
Keep your evaluation concise (3-5 sentences).
Be encouraging but provide specific, constructive feedback on what they did well and what they could improve.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to fetch from Gemini API");
    }

    const feedback = data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate feedback at this time.";

    return NextResponse.json({ feedback });

  } catch (error: any) {
    console.error("Evaluation API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
