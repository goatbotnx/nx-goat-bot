module.exports = {
  config: {
    name: "emojiAudio",
    version: "3.0",
    author: "ChatGPT",
    countDown: 3,
    role: 0,
    shortDescription: "emoji → funny audio",
    category: "fun",
    longDescription: "no prefix emoji reaction with audio",
    category: "no prefix",
  },

  onStart: async () => {},

  onChat: async function ({ event, message }) {
    if (!event.body) return;
    const text = event.body.trim();

    // EMOJI + Audio + Reply List
    const emojiPack = {
      "😆": { reply: "🤪🥴", audio: "https://files.catbox.moe/1c6jpm.ogg" },
      "😂": { reply: "🤣🤣", audio: "https://files.catbox.moe/1c6jpm.ogg" },
      "🤣": { reply: "😆😂🤣", audio: "https://files.catbox.moe/1c6jpm.ogg" },
      "😹": { reply: "😹😹", audio: "https://files.catbox.moe/1c6jpm.ogg" },
      "😁": { reply: "😄✨", audio: "https://files.catbox.moe/1c6jpm.ogg" },
      "😹": { reply: "😝🔥", audio: "https://files.catbox.moe/1c6jpm.ogg" },
      "😸": { reply: "😛🤪", audio: "https://files.catbox.moe/1c6jpm.ogg" },
      "😄": { reply: "😅😂", audio: "https://files.catbox.moe/1c6jpm.ogg" }
    };

    // If user sent emoji that exists
    if (emojiPack[text]) {
      return message.reply({
        body: emojiPack[text].reply,
        attachment: await global.utils.getStreamFromURL(emojiPack[text].audio)
      });
    }
  }
};
