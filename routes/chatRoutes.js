const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ reply: "Message is required." });
    }

    const response = await axios.post(
      "https://api.stackai.com/inference/v0/run/78f6eb4d-dd6c-4875-a361-4033082aa3cc/69af18e462cd769a9fbbfa34",
      {
        user_id: "web-user",
        "in-0": message
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.STACKAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const data = response.data;
    console.log("STACKAI FULL RESPONSE:", JSON.stringify(data, null, 2));
      
      let reply = "Sorry, I could not generate a response.";

      if (data?.outputs?.["out-0"]) {
        reply = data.outputs["out-0"];
      } else if (data?.completion) {
        reply = data.completion;
      }
      
    res.json({ reply });
  } catch (error) {
    console.error("StackAI error:", error.response?.data || error.message);
    res.status(500).json({ reply: "AI response could not be generated." });
  }
});

module.exports = router;
