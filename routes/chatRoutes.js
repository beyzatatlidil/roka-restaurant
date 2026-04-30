const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ reply: "Message is required." });
        }

        const response = await axios.post(
            "https://api.stackai.com/inference/v0/run/78f6eb4d-dd6c-4875-a361-4033082aa3cc/69af18e462cd769a9fbbfa34",
            {
                user_id: "web-user",
                "in-0": message,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.STACKAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const data = response.data;

        let reply = "AI response error";

        if (data?.outputs?.["out-0"]) {
            reply = data.outputs["out-0"];
        } else if (data?.completion) {
            reply = data.completion;
        }

        res.json({ reply });
    } catch (error) {
        console.error("Chat error:", error.message);
        res.status(500).json({ reply: "AI error" });
    }
});

module.exports = router;