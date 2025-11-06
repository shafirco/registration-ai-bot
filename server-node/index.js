import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Route: return random Hebrew message
app.get("/random-message", async (req, res) => {
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "תן משפט רנדומלי ומעורר השראה בעברית, עד 15 מילים בלבד.",
        },
      ],
    });

    const quote = completion.choices[0].message.content.trim();
    res.json({ quote });
  } catch (error) {
    console.error("Error fetching OpenAI message:", error.message);
    res.status(500).json({ error: "Failed to fetch message" });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 Node server running on port ${PORT}`));
