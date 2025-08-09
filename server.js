import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/suggestions", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "أنت مساعد طعام ذكي تقدم اقتراحات وجبات سريعة في الأردن بناءً على الطلب" },
          { role: "user", content: message }
        ],
        max_tokens: 300
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "خطأ في الاتصال بالذكاء الصناعي" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
