const axios = require('axios');
const fs = require('fs');

const xyz = "ArYANAHMEDRUDRO";

module.exports = {
  config: {
    name: "5k",
    version: "1.0.0",
    role: 0,
    credits: "cyber bot team (fixed by nx)",
    premium: false,
    description: "Enhance Photo ",
    category: "image",
    usages: "Reply to an image or provide image URL",
    cooldowns: 5,
    dependencies: {
      path: "",
      'fs-extra': ""
    }
  },

  // 👇 run এর পরিবর্তে onStart ব্যবহার করা হলো
  onStart: async function ({ api, event, args }) {
    const tempImagePath = __dirname + '/cache/enhanced_image.jpg';
    const { threadID, messageID } = event;

    const imageUrl = event.messageReply ?
      event.messageReply.attachments[0].url :
      args.join(' ');

    if (!imageUrl) {
      return api.sendMessage("Please reply to an image or provide an image URL", threadID, messageID);
    }

    try {
      const processingMsg = await api.sendMessage("𝐏𝐥𝐞𝐚𝐬𝐞 𝐖𝐚𝐢𝐭 𝐁𝐚𝐛𝐲...😘", threadID);

      const apiUrl = `https://aryan-xyz-upscale-api-phi.vercel.app/api/upscale-image?imageUrl=${encodeURIComponent(imageUrl)}&apikey=${xyz}`;

      const enhancementResponse = await axios.get(apiUrl);
      const enhancedImageUrl = enhancementResponse.data?.resultImageUrl;

      if (!enhancedImageUrl) {
        throw new Error("Failed to get enhanced image URL.");
      }

      const enhancedImage = (await axios.get(enhancedImageUrl, { responseType: 'arraybuffer' })).data;
      fs.writeFileSync(tempImagePath, Buffer.from(enhancedImage, 'binary'));

      api.sendMessage({
        body: "✅ 𝐈𝐦𝐚𝐠𝐞 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐞𝐝 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲!",
        attachment: fs.createReadStream(tempImagePath)
      }, threadID, () => fs.unlinkSync(tempImagePath), messageID);

      api.unsendMessage(processingMsg.messageID);

    } catch (error) {
      api.sendMessage(`❌ Error: ${error.message}`, threadID, messageID);
    }
  }
};
