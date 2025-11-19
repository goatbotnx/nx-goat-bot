module.exports = {
    config: {
        name: "ping",
        aliases: ["pong"],
        version: "1.3",
        author: "xalman ",
        countDown: 3,
        role: 0,
        shortDescription: "Bot er ping check korar command",
        cetagory: "system",
    },

    onStart: async function ({ message }) {
        const start = Date.now();
        const sentMessage = await message.reply("🏓 pong ...");
        const end = Date.now();
        const latency = end - start;
        await message.reply(`🏓your  ping : ${latency}ms`);
    }
};
