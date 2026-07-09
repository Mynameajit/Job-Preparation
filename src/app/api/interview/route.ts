import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, topic } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing in environment variables. Please add it to your .env file." },
        { status: 500 }
      );
    }

    const systemPrompt = `You are an expert technical interviewer conducting a mock interview for a ${topic || "Software Engineering"} role. 
Your goal is to assess the candidate's skills, provide brief, constructive feedback on their answers, and ask follow-up or new questions.
RULES:
1. Ask ONLY ONE question at a time.
2. Keep your responses concise (2-3 sentences max). This is a voice-based interview, so long text is bad.
3. If the candidate answers well, acknowledge it briefly and move to the next question.
4. If the candidate is struggling, give a small hint or move on.
5. Be professional but encouraging.`;

    const formattedHistory = messages.map((m: any) => `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.content}`).join('\n');
    const prompt = `${systemPrompt}\n\nHere is the conversation so far:\n${formattedHistory}\n\nInterviewer:`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to fetch from Gemini API");
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I didn't quite catch that. Could you elaborate?";

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error("Interview API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

