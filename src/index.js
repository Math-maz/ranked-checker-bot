require("dotenv/config");
const { Client } = require("discord.js");
const client = new Client();

const messageController = require("./controllers/messageController");
client.on("ready", () => {
  console.log("i'm ready to interact!");
  client.user.setActivity({ name: "!ranked-check", type: "LISTENING" });
});

client.on("message", messageController.messageManager);
client.login(process.env.TOKEN);
