const replies = [
  "Amar boss Nx busy ase",
  "Amar boss ke Dak dibi na",
  "nx er permission chara tag bondho",
  "Boss sleep ditese, disturb korish na",
  "Boss er mood baje, tag diye ki korbi?",
  "Tag dile boss rage jabe",
  "Tag korar age chinta koros?"
];

module.exports = {
  config: {
    name: "mentionnx",
    version: "1.0",
    author: "T A N J I L",
    shortDescription: {
      en: "Replies when specific user is mentioned",
    },
    longDescription: {
      en: "Automatically responds with random lines if a specific user is mentioned.",
    },
    category: "no prefix",
    usages: "",
    cooldowns: 3,
  },

  onStart: async function () {},

  onChat: async ({ event, api }) => {
    const mentionList = Object.entries(event.mentions || {});
    const targetUIDs = "100081088184521" 

    // Check if at least one mentioned user matches target UIDs
    const mentionedIDs = mentionList.map(([id]) => id);

    if (mentionedIDs.some(id => targetUIDs.includes(id))) {
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      return api.sendMessage(randomReply, event.threadID, event.messageID);
    }
  }
};
