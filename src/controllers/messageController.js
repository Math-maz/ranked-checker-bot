const players = require("../util/players");
const axios = require("axios");
const { formatLeagueAPIQuery } = require("../util/helpers");
const { MessageEmbed } = require("discord.js");
module.exports = {
  messageManager: async msg => {
    if (msg.content === "!ranked-check") {
      await msg.reply("Perfoming ranked check on everybody!");

      players.forEach(async playerID => {
        const response = await axios.get(formatLeagueAPIQuery(playerID));
        console.log(response.data);
        let soloQStats, flexStats;
        if (response.data[0].queueType == "RANKED_FLEX_SR") {
          flexStats = response.data[0];
          soloQStats = response.data[1];
        } else {
          flexStats = response.data[1];
          soloQStats = response.data[0];
        }
        const { summonerName } = response.data[0];
        const embed = new MessageEmbed()
          .setTitle(summonerName)
          .addField(
            "Solo/Duo",
            `Tier: ${soloQStats.tier}-${soloQStats.rank}\nWinRate: ${Math.floor(
              (soloQStats.wins / (soloQStats.wins + soloQStats.losses)) * 100
            )}%`
          )
          .addField(
            "Flex",
            `Tier: ${flexStats.tier}-${flexStats.rank}\nWinRate: ${Math.floor(
              (flexStats.wins / (flexStats.wins + flexStats.losses)) * 100
            )}%`
          )
          .setColor("#dddddd");

        await msg.channel.send(embed);
      });
    }
  }
};
