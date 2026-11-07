module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    const question = req.body?.question;

    if (
        typeof question !== "string" ||
        !question.trim() ||
        question.length > 1000
    ) {
        return res.status(400).json({
            error: "Please enter a question under 1000 characters."
        });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            error: "Server API key is not configured."
        });
    }

    try {
        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "openai/gpt-oss-20b",
                    temperature: 0.7,
                    messages: [
                        {
                            role: "system",
                            content: `You are Yash Dadoo's personal portfolio chatbot.

Information about Yash:
- Name: Yash Dadoo
- Education: BTech in Artificial Intelligence and Machine Learning
- University: JECRC University
- Skills: C, C++, HTML, CSS, JavaScript and Python.
- Interests: Programming, web development and problem solving.
- GitHub: https://github.com/YashDevCodes

Projects:
1. Palindrome Checker
2. Personal Portfolio
3. Fibonacci Series
4. Factorial Calculator

Answer questions about Yash using only this information.
Be friendly, professional and concise.
Never invent personal information.
Keep answers under 80 words.`
                        },
                        {
                            role: "user",
                            content: question.trim()
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Groq API error:", data);
            return res.status(502).json({
                error: "The AI service could not process your request."
            });
        }

        const reply = data.choices?.[0]?.message?.content;

        if (!reply) {
            return res.status(502).json({
                error: "No AI response received."
            });
        }

        return res.status(200).json({ reply });

    } catch (error) {
        console.error("Chat API error:", error);

        return res.status(500).json({
            error: "Something went wrong. Please try again."
        });
    }
};