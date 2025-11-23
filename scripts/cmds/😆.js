module.exports = {
  config: {
    name: "emojiAudio",
    version: "3.0",
    author: "xalman",
    countDown: 3,
    role: 0,
    shortDescription: "emoji → funny audio",
    category: "fun",
    longDescription: "no prefix emoji reaction with audio",

    // ✅ Added User Guide
    guide: {
      en:
`💬 *How to use emojiAudio*
Just send any supported emoji in chat and bot will reply with funny audio.

🎧 *Supported Emojis Example:*
😆 😂 🤣 😵‍💫 😅 🤭 😞 😍 😱 😿 🍼 💔 🤫 😏 🫣 🐸

✔ No prefix needed
✔ Works automatically when emoji is sent`
    }
  },

  onStart: async () => {},

  onChat: async function ({ event, message }) {
    if (!event.body) return;
    const text = event.body.trim();

    // Default Emoji Pack
    const emojiPack = {
      "😆": { reply: "🤪🥴", audio: "https://files.catbox.moe/1c6jpm.ogg" },
      "😂": { reply: "🤣🤣", audio: "https://files.catbox.moe/1c6jpm.ogg" },
      "🤣": { reply: "😆😂🤣", audio: "https://files.catbox.moe/1c6jpm.ogg" },
      "😵‍💫": { reply: "😹😹", audio: "https://files.catbox.moe/8o4is6.mp4" },
      "😁": { reply: "😄✨", audio: "https://files.catbox.moe/1c6jpm.ogg" },
      "😸": { reply: "😛🤪", audio: "https://files.catbox.moe/1c6jpm.ogg" },
      "🖕": { reply: "😅😂", audio: "https://files.catbox.moe/eydq8h.mp3" }
    };

    // Your Added Audio Map
    const emojiAudioMap = {
      "🥱": "https://files.catbox.moe/9pou40.mp3",
      "😌": "https://files.catbox.moe/epqwbx.mp3",
      "🥺": "https://files.catbox.moe/wc17iq.mp3",
      "🤭": "https://files.catbox.moe/cu0mpy.mp3",
      "😅": "https://files.catbox.moe/jl3pzb.mp3",
      "😏": "https://files.catbox.moe/z9e52r.mp3",
      "😞": "https://files.catbox.moe/tdimtx.mp3",
      "🤫": "https://files.catbox.moe/0uii99.mp3",
      "🍼": "https://files.catbox.moe/p6ht91.mp3",
      "🤔": "https://files.catbox.moe/hy6m6w.mp3",
      "🥰": "https://files.catbox.moe/dv9why.mp3",
      "🤦": "https://files.catbox.moe/ivlvoq.mp3",
      "😘": "https://files.catbox.moe/sbws0w.mp3",
      "😑": "https://files.catbox.moe/p78xfw.mp3",
      "😢": "https://files.catbox.moe/shxwj1.mp3",
      "🙊": "https://files.catbox.moe/3bejxv.mp3",
      "🤨": "https://files.catbox.moe/4aci0r.mp3",
      "😡": "https://files.catbox.moe/shxwj1.mp3",
      "🙈": "https://files.catbox.moe/3qc90y.mp3",
      "😍": "https://files.catbox.moe/qjfk1b.mp3",
      "😭": "https://files.catbox.moe/itm4g0.mp3",
      "😱": "https://files.catbox.moe/mu0kka.mp3",
      "😻": "https://files.catbox.moe/y8ul2j.mp3",
      "😿": "https://files.catbox.moe/tqxemm.mp3",
      "💔": "https://files.catbox.moe/6yanv3.mp3",
      "🥹": "https://files.catbox.moe/jf85xe.mp3",
      "😩": "https://files.catbox.moe/b4m5aj.mp3",
      "🫣": "https://files.catbox.moe/ttb6hi.mp3",
      "🐸": "https://files.catbox.moe/utl83s.mp3"
    };

    // Merge Your Emojis Into Main Pack
    for (const emo in emojiAudioMap) {
      emojiPack[emo] = {
        reply: emo,
        audio: emojiAudioMap[emo]
      };
    }

    // If emoji matched → reply with audio
    if (emojiPack[text]) {
      return message.reply({
        body: emojiPack[text].reply,
        attachment: await global.utils.getStreamFromURL(emojiPack[text].audio)
      });
    }
  }
};
