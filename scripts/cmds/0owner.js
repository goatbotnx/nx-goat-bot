const { getStreamFromURL } = global.utils;
module.exports = {
  config: {
    name: "owner",
    aliases: "info", "admininfo", "ownerinfo",
    version: 2.1,
    author: "Jani nh ke manger nati cng marche 🙂",
    longDescription: "Info about bot and owner",
    category: "Special",
    guide: {
      en: "{p}owner or just type owner"
    },
    usePrefix: false
  },
  onStart: async function (context) {
    await module.exports.sendOwnerInfo(context);
  },
  onChat: async function ({ event, message, usersData }) {
    const prefix = global.GoatBot.config.prefix;
    const body = (event.body || "").toLowerCase().trim();
    const triggers = ["owner", `${prefix}owner`];
    if (!triggers.includes(body)) return;
    await module.exports.sendOwnerInfo({ event, message, usersData });
  },
  sendOwnerInfo: async function ({ event, message, usersData }) {
    const videoURL = " https://video.xx.fbcdn.net/v/t42.3356-2/501304392_10079169508772619_3565141936249234512_n.mp4?_nc_cat=110&_nc_cb=47395efc-686078dc&ccb=1-7&_nc_sid=4f86bc&_nc_ohc=TeTRZ6zjL3AQ7kNvwHlmFjr&_nc_oc=Adl8A-1ryYV3GVLXH28UFS-Vnba2jW1FtGnz0eLLPtPQPxqEg8Zatidsy6fOYXY0uwA&_nc_zt=28&_nc_ht=video.xx&_nc_gid=NiIdyM7VDQSabBLfsc0ENw&oh=03_Q7cD2QF5s41P2Qo_rLTddJTAqM4SXXjkquHv4sdgrdu_bjDT4A&oe=68398048&dl=1";
    const attachment = await getStreamFromURL(videoURL);
    const id = event.senderID;
    const userData = await usersData.get(id);
    const name = userData.name;
    const mentions = [{ id, tag: name }];
    const info = `
⫷          O᩶w᩶n᩶e᩶r᩶ I᩶n᩶f᩶o᩶          ⫸
┃ ☁️ 𝗡𝗮𝗺𝗲:     Máybè Nx 
┃ ⚙️ 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲:  💋♡your baby♡💌🦋 くめ
┃ 🎂 𝗔𝗴𝗲:             18
┃ 🧠 𝗖𝗹𝗮𝘀𝘀:           Continues work
┃ ❤️ 𝗥𝗲𝗹𝗮𝘁𝗶𝗼𝗻:      Single 
┃ ♂️ 𝗚𝗲𝗻𝗱𝗲𝗿:         Male
┃ 🏠 𝗙𝗿𝗼𝗺:           Narsingdi 
┃ 💬 𝗠𝗲𝘀𝘀𝗲𝗻𝗴𝗲𝗿:     https://m.me/nx210.2.0.is.back
♡ 𝐓𝐡𝐚𝐧𝐤𝐬 𝐟𝐨𝐫 𝐮𝐬𝐢𝐧𝐠 𝐦𝐲 𝐛𝐨𝐭 ♡
    `.trim();
    message.reply({
      body: info,
      attachment,
      mentions
    });
  }
};
