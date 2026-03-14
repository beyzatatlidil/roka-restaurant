document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("chatbot-toggle");
  const box = document.getElementById("chatbot-box");
  const close = document.getElementById("chatbot-close");
  const send = document.getElementById("chatbot-send");
  const input = document.getElementById("chatbot-input");
  const messages = document.getElementById("chatbot-messages");

  if (!toggle) return;

  toggle.onclick = () => {
    box.classList.toggle("active");
  };

  close.onclick = () => {
    box.classList.remove("active");
  };

  function addMessage(sender, text) {
    const wrapper = document.createElement("div");
    wrapper.className = "chat-message " + sender;

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";
    bubble.innerHTML = text;

    wrapper.appendChild(bubble);
    messages.appendChild(wrapper);
    messages.scrollTop = messages.scrollHeight;
  }

  async function askStackAI(text) {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: text })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.reply || "AI response could not be generated.");
    }

    return data.reply;
  }

  send.onclick = async () => {
    const text = input.value.trim();
    if (!text) return;

    addMessage("user", text);
    input.value = "";

    addMessage("bot", "Typing...");

    try {
      const reply = await askStackAI(text);

      const botMessages = messages.querySelectorAll(".chat-message.bot");
      const lastBotMessage = botMessages[botMessages.length - 1];

      if (lastBotMessage) {
        lastBotMessage.querySelector(".chat-bubble").innerHTML = reply;
      }
    } catch (error) {
      const botMessages = messages.querySelectorAll(".chat-message.bot");
      const lastBotMessage = botMessages[botMessages.length - 1];

      if (lastBotMessage) {
        lastBotMessage.querySelector(".chat-bubble").innerHTML =
          "Sorry, something went wrong while contacting the AI assistant.";
      }
      console.error(error);
    }
  };

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      send.click();
    }
  });
});
