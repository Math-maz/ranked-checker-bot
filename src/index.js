require("dotenv/config");
const { Client, MessageEmbed } = require("discord.js");
const client = new Client();
const axios = require("axios");
const { formatLeagueAPIQuery } = require("./util/helpers");
const players = require("./util/players");
client.on("ready", () => {
  console.log("i'm ready to interact!");
});
client.on("message", async msg => {
  if (msg.content === "!ranked-check") {
    await msg.reply("Perfoming ranked check on everybody!");

    players.forEach(async playerID => {
      const response = await axios.get(formatLeagueAPIQuery(playerID));
      console.log(response.data);
      const soloQStats = response.data[0];
      const flexStats = response.data[1];
      const { summonerName } = response.data[0];
      const embed = new MessageEmbed()
        .setTitle(summonerName)
        .addField(
          "Solo/Duo",
          `Tier: ${soloQStats.tier}-${soloQStats.rank}\nWinRate: ${Math.floor(
            (soloQStats.wins / (soloQStats.wins + soloQStats.losses)) * 100
          )}%`
        )
        .setColor("#ddd")
        .addField(
          "Flex",
          `Tier: ${flexStats.tier}-${flexStats.rank}\nWinRate: ${Math.floor(
            (flexStats.wins / (flexStats.wins + flexStats.losses)) * 100
          )}%`
        );

      await msg.channel.send(embed);
    });
  }
});
client.login(process.env.TOKEN);
