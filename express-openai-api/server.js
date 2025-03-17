require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Health Check API
app.get("/", (req, res) => {
    res.json({ message: "Health check passed!" });
});

// Process API
app.post("/process", async (req, res) => {
    try {
        const { text, option } = req.body;
        // console.log(`Received request: Text="${text}", Option="${option}"`);

        // Define prompt based on option
        const prompt = {
            "Summarize": `Summarize the following text: ${text}`,
            "Paraphrase": `Paraphrase the following text: ${text}`,
            "Expand": `Expand on the following text: ${text}`,
            "Translate": `Translate the following text to Spanish: ${text}`
        }[option] || "Invalid option selected.";
    
        console.log({prompt})
        // OpenAI API call
        const response = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-4o",
            "messages": [
                    {
                        "role": "developer",
                        "content": "You are a helpful assistant. Answer below user query."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
            ],
            max_tokens: 150,
            temperature: 0.7
        }, {
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        console.log({response})
        const generatedText = response.data.choices[0].text.trim();
        console.log(`Processed successfully: ${generatedText}`);

        res.json({ message: generatedText });

    } catch (error) {
        console.error("Error processing request:", error.message);
        res.status(500).json({ message: "Failed to process the text" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
