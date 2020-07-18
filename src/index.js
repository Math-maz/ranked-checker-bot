require("dotenv/config");
const { Client } = require("discord.js");
const client = new Client();

const { messageManager } = require("./controllers/messageController");
client.on("ready", () => {
  console.log("i'm ready to interact!");
  client.user.setActivity({
    name: "!check *insert player nick without spaces*",
    type: "LISTENING",
  });
});

client.on("message", messageManager);
client.login(process.env.TOKEN);
