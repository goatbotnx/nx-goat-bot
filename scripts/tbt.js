const deltaNext = global.GoatBot.configCommands.envCommands.rank.deltaNext;
const expToLevel = exp => Math.floor((1 + Math.sqrt(1 + 8 * exp / deltaNext)) / 2);

const fs = require("fs-extra");
const path = require("path");
const Canvas = require("canvas");
const GIFEncoder = require("gifencoder");
const axios = require("axios");

module.exports = {
  config: {
    name: "rankup",
    version: "4.5-fixed",
    author: "Xalman | using GPT-5",
    countDown: 5,
    role: 0,
    description: { en: "Animated neon GIF rankup card (fully fixed)" },
    category: "rank",
    guide: { en: "{pn} [on | off]" },
    envConfig: { deltaNext: 5 }
  },

  langs: {
    en: {
      syntaxError: "Syntax error, only use {pn} on or {pn} off",
      turnedOn: "✅ Rankup notification turned ON (Auto Rank Card enabled)",
      turnedOff: "❌ Rankup notification turned OFF"
    }
  },

  // -------------------- Toggle System --------------------
  onStart: async function ({ message, event, threadsData, args, getLang }) {
    if (!["on", "off"].includes(args[0]))
      return message.reply(getLang("syntaxError"));

    await threadsData.set(event.threadID, args[0] == "on", "settings.sendRankupMessage");
    return message.reply(args[0] == "on" ? getLang("turnedOn") : getLang("turnedOff"));
  },

  // -------------------- Safe Image Loader --------------------
  async loadImageSafe(url, fallback = null) {
    try {
      const res = await axios({
        url,
        method: "GET",
        responseType: "arraybuffer",
        timeout: 12000,
        validateStatus: () => true
      });

      if (!res.data || res.status >= 400) throw new Error("Bad Image Response");

      return await Canvas.loadImage(Buffer.from(res.data));
    } catch (e) {
      console.log("Image load failed:", url, e.message);

      if (fallback) {
        try {
          return await Canvas.loadImage(fallback);
        } catch (_) { }
      }

      // Final fallback – solid background
      const tmp = Canvas.createCanvas(512, 512);
      const ctx = tmp.getContext("2d");
      ctx.fillStyle = "#111827";
      ctx.fillRect(0, 0, 512, 512);
      return tmp;
    }
  },

  // -------------------- Rankup Event --------------------
  onChat: async function ({ threadsData, usersData, event, message }) {
    const threadData = await threadsData.get(event.threadID);
    const sendRankupMessage = threadData.settings.sendRankupMessage;
    if (!sendRankupMessage) return;

    const userData = await usersData.get(event.senderID);
    const { exp } = userData;

    const currentLevel = expToLevel(exp);
    const prevLevel = expToLevel(Math.max(0, exp - 1));

    if (currentLevel <= prevLevel) return;

    // -------------------- Setup --------------------
    const width = 1280;
    const height = 376;
    const frames = 18;
    const delay = 60;

    const bgList = [
      "https://i.imgur.com/IwUrBB5.jpeg",
      "https://i.imgur.com/7z4lYQz.jpeg",
      "https://i.imgur.com/qPQT1wL.jpeg",
      "https://i.imgur.com/lR7UuRZ.jpeg"
    ];

    const bgUrl = bgList[Math.floor(Math.random() * bgList.length)];

    // -------- Load Avatar & Background (Fixed) --------
    const avatarURL = `https://graph.facebook.com/${event.senderID}/picture?width=512&height=512`;

    const avatarImage = await this.loadImageSafe(
      avatarURL,
      "https://i.ibb.co/ZTq5wq6/default-avatar.png"
    );

    const bgImage = await this.loadImageSafe(bgUrl);

    // -------------------- GIF Encoder --------------------
    const encoder = new GIFEncoder(width, height);
    const tmpFilename = `rankup_${event.senderID}_${Date.now()}.gif`;
    const tmpPath = path.join(__dirname, tmpFilename);

    const writeStream = fs.createWriteStream(tmpPath);
    encoder.createReadStream().pipe(writeStream);

    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(delay);
    encoder.setQuality(10);

    const canvas = Canvas.createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // -------------------- Animation Frame Builder --------------------
    for (let i = 0; i < frames; i++) {
      ctx.clearRect(0, 0, width, height);

      ctx.drawImage(bgImage, 0, 0, width, height);
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.fillRect(0, 0, width, height);

      // Neon Animation Values
      const t = i / frames;
      const glow = 0.4 + 0.6 * Math.abs(Math.sin(t * Math.PI * 2));
      const glowWidth = 6 + 8 * Math.abs(Math.sin(t * Math.PI * 2));
      const hue = Math.floor(180 + 80 * Math.sin(t * Math.PI * 2));

      // Outer Neon Border
      ctx.save();
      ctx.beginPath();
      roundRect(ctx, 10, 10, width - 20, height - 20, 24);
      ctx.shadowBlur = 30 + glowWidth;
      ctx.shadowColor = `hsla(${hue}, 100%, 60%, ${glow})`;
      ctx.lineWidth = glowWidth;
      ctx.strokeStyle = `hsla(${hue},100%,60%,${0.6 * glow})`;
      ctx.stroke();
      ctx.restore();

      // Avatar Glow
      const x = 40, y = 120, size = 160;

      ctx.save();
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2 + 12, 0, Math.PI * 2);
      ctx.shadowBlur = 40;
      ctx.shadowColor = `hsla(${hue + 40},100%,60%, ${glow})`;
      ctx.fillStyle = "rgba(255,255,255,0.03)";
      ctx.fill();
      ctx.restore();

      // Avatar
      ctx.save();
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(avatarImage, x, y, size, size);
      ctx.restore();

      // Username
      ctx.font = "bold 38px Sans";
      ctx.fillStyle = "#fff";
      const name = (userData.name || "User");
      ctx.fillText(name.substring(0, 26), 240, 170);

      // Level
      ctx.font = "28px Sans";
      ctx.fillStyle = "#dffcf0";
      ctx.fillText(`🎯 Level ${currentLevel}`, 240, 215);

      encoder.addFrame(ctx);
    }

    encoder.finish();

    // -------------------- Send & Cleanup --------------------
    await new Promise(r => writeStream.on("finish", r));

    await message.reply({
      body: `🎉 Congratulations ${userData.name}!\nYou've reached level ${currentLevel}!`,
      attachment: fs.createReadStream(tmpPath)
    });

    await fs.remove(tmpPath).catch(() => { });
  }
};


// ---------- Helper Rounded Rectangle ----------
function roundRect(ctx, x, y, w, h, r) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
	}
