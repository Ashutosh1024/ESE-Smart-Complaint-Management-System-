const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @route   POST /api/ai/analyze
// @desc    AI Complaint Analyzer
// @access  Private
exports.analyzeComplaint = async (req, res) => {
    const { title, description, category, location } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required for analysis.' });
    }

    try {
        // The Gemini 1.5 models are versatile and work with most use cases
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

        const prompt = `
        You are an AI assistant for a Smart Complaint Management System. 
        Analyze the following complaint and provide the output in JSON format with exactly the following keys:
        - "priority": Detect the complaint urgency (e.g., "High", "Medium", "Low"). If it's a "Water leakage" or "Electricity issue", set it to "High".
        - "department": Suggest the responsible department (e.g., "Water Department", "Sanitation Department", "Electricity Board", "Public Works"). If garbage complaint, "Sanitation department".
        - "summary": A concise 1-2 sentence summary of the complaint.
        - "autoResponse": Generate an empathetic and professional automatic response message to the user acknowledging the issue.

        Complaint Details:
        Title: ${title}
        Description: ${description}
        Category: ${category}
        Location: ${location}

        Return ONLY a raw JSON object. Do not use Markdown formatting or code blocks.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Clean up text in case the model returns markdown code blocks
        text = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();

        const analysis = JSON.parse(text);

        res.json(analysis);
    } catch (err) {
        console.error('Error analyzing complaint with AI:', err);
        res.status(500).json({ message: 'Failed to analyze complaint', error: err.message });
    }
};
