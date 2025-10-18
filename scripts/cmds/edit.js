const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "edit",
    version: "1.0",
    author: "RI F AT | NeoKEX",
    countDown: 5,
    role: 0,
    shortDescription: "Edit image using prompt",
    longDescription: "Edit an uploaded image based on your prompt.",
    category: "AI-IMAGE",
    guide: "{p}edit [prompt] (reply to image)"
  },

  onStart: async function ({ api, event, args, message }) {
    const prompt = args.join(" ");
    const repliedImage = event.messageReply?.attachments?.[0];

    if (!prompt || !repliedImage || repliedImage.type !== "photo") {
      return message.reply("Please reply to a photo with your prompt to edit it.");
    }
    
    api.setMessageReaction("🛠️", event.messageID, () => {}, true);

    const imgPath = path.join(__dirname, "cache", `${Date.now()}_edit.jpg`);

    try {
      const imgURL = repliedImage.url;
      const imageUrl = `https://edit-and-gen.onrender.com/gen?prompt=${encodeURIComponent(prompt)}&image=${encodeURIComponent(imgURL)}`;
      const res = await axios.get(imageUrl, { responseType: "arraybuffer" });

      await fs.ensureDir(path.dirname(imgPath));
      await fs.writeFile(imgPath, Buffer.from(res.data, "binary"));

      message.reply({
        body: `✅ Edited image for: "${prompt}"`,
        attachment: fs.createReadStream(imgPath)
      });
      
      api.setMessageReaction("✅", event.messageID, () => {}, true);

    } catch (err) {
      console.error("EDIT Error:", err);
      message.reply("Failed to edit image. Please try again later.");
      
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      
    } finally {
      if (fs.existsSync(imgPath)) {
        await fs.remove(imgPath);
      }
    }
  }
};
