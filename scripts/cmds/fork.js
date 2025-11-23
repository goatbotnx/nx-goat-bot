module.exports = {
  config: {
    name: "fork",
    version: "1.1",
    author: "xalman",
    countDown: 2,
    role: 0,
    shortDescription: "Show official fork link",
    category: "utils",
    guide: {
      en: "{pn} → show official fork link"
    }
  },

  langs: {
    en: {
      current: "🔗 Official Fork Link:\n%1"
    }
  },

  onStart: async function ({ message, getLang }) {
    const link = "https://github.com/goatbotnx";
    return message.reply(getLang("current", link));
  }
};
