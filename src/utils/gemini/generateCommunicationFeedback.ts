export async function generateCommunicationFeedback(
	responses: {
		understanding?: string;
		approach?: string;
		reflection?: string;
	}
): Promise<string> {
	const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

	if (!apiKey) {
		return "Gemini API key not configured.";
	}

	const prompt = `
You are a senior technical interviewer.

Evaluate the candidate's communication based ONLY on the responses provided.
Do NOT penalize missing sections.
Do NOT judge code correctness.

Provide:
• Overall assessment
• Communication strengths
• Areas for improvement
• Interview tips

Candidate Responses:

${responses.understanding ? `Understanding:\n${responses.understanding}\n` : ""}
${responses.approach ? `Approach:\n${responses.approach}\n` : ""}
${responses.reflection ? `Reflection:\n${responses.reflection}\n` : ""}
`;

	try {
		const res = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					contents: [
						{
							parts: [{ text: prompt }],
						},
					],
				}),
			}
		);

		const data = await res.json();
		console.log("✅ Gemini raw response:", data);

		return (
			data?.candidates?.[0]?.content?.parts?.[0]?.text ||
			"No AI feedback generated."
		);
	} catch (err) {
		console.error("❌ Gemini API error:", err);
		return "Error generating AI feedback.";
	}
}
