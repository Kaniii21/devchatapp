const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

const analyzeCode = async (code, language) => {
    if (!GEMINI_API_KEY) {
        throw new Error('Missing GEMINI_API_KEY. Please add it to your environment variables.');
    }

    const prompt = `Analyze the following ${language} code for bugs, suggest improvements, and provide a fixed version.

Code:
\`\`\`
${code}
\`\`\`

Return the analysis in a JSON object with the following structure: { issues: [], suggestions: [], fixedCode: "" }`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const analysisText = data.candidates[0].content.parts[0].text;

        // Clean the response to get a valid JSON
        const cleanedJson = analysisText.replace(/```json/g, '').replace(/```/g, '');
        const analysis = JSON.parse(cleanedJson);

        return analysis;
    } catch (error) {
        console.error('Error analyzing code with Gemini:', error);
        throw new Error('Failed to analyze code with Gemini. Please check your API key and network connection.');
    }
};

export { analyzeCode };