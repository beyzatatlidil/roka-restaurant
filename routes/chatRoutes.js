require("dotenv").config();

const express = require("express");
const axios = require("axios");
const Menu = require("../models/Menu");
const Order = require("../models/Order");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const message = req.body.message;

        // 📦 SİPARİŞ DURUMU
        if (
            message &&
            (message.toLowerCase().includes("sipariş") ||
                message.toLowerCase().includes("siparis"))
        ) {
            const orders = await Order.find().sort({ createdAt: -1 });

            if (!orders.length) {
                return res.json({
                    reply: "Henüz oluşturulmuş bir sipariş bulunmuyor.",
                });
            }

            const lastOrder = orders[0];

            let statusText = "";

            if (lastOrder.status === "pending") {
                statusText = "Siparişiniz alındı, hazırlık aşamasına geçecek.";
            } else if (lastOrder.status === "preparing") {
                statusText = "Siparişiniz hazırlanıyor 👨‍🍳";
            } else if (lastOrder.status === "delivered") {
                statusText = "Siparişiniz teslim edildi 🚀";
            } else {
                statusText = lastOrder.status;
            }

            return res.json({
                reply: statusText,
            });
        }

        // ❗ boş mesaj kontrolü
        if (!message || !message.trim()) {
            return res.status(400).json({ reply: "Mesaj boş olamaz." });
        }

        // 🍽️ Menü çek
        const menuItems = await Menu.find();

        let menuText = "Menüde şu anda kayıtlı ürün yok.";

        if (menuItems.length > 0) {
            menuText = menuItems
                .map((item) => {
                    const type = item.isVegetarian ? "vejetaryen" : "normal";
                    return `${item.name} - ${item.price} TL - ${type}`;
                })
                .join("\n");
        }

        // 🤖 Prompt
        const prompt =
            "You work at Roka Restaurant.\n\n" +
            "Menu:\n" +
            menuText +
            "\n\n" +
            "Rules:\n" +
            "- Never say you are an AI.\n" +
            "- Never introduce yourself.\n" +
            "- Speak Turkish.\n" +
            "- Be short, natural and helpful.\n" +
            "- Only suggest items that exist in the menu.\n" +
            "- If user asks vegan options and menu does not clearly say vegan, explain that vegan information is not available yet.\n" +
            "- If user asks vegetarian options, suggest vegetarian items only.\n\n" +
            "User: " +
            message;

        const response = await axios.post(
            "https://api.stackai.com/inference/v0/run/78f6eb4d-dd6c-4875-a361-4033082aa3cc/69af18e462cd769a9fbbfa34",
            {
                user_id: "web-user",
                "in-0": prompt,
            },
            {
                headers: {
                    Authorization: "Bearer " + process.env.STACKAI_API_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        const data = response.data;

        let reply = "Cevap alınamadı.";

        if (Array.isArray(data?.outputs)) {
            reply = data.outputs[0]?.value || reply;
        } else if (data?.outputs?.["out-0"]) {
            reply = data.outputs["out-0"].value || data.outputs["out-0"];
        } else if (data?.completion) {
            reply = data.completion;
        } else if (data?.output) {
            reply = data.output;
        }

        return res.json({ reply });

    } catch (error) {
        console.error("❌ Chat error:", error.response?.data || error.message);

        return res.status(500).json({
            reply: "Şu anda asistana ulaşılamıyor.",
        });
    }
});

module.exports = router;