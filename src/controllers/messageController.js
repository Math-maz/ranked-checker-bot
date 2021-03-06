const players = require("../util/players");
const axios = require("axios");
const parseArgs = require("minimist");
const { MessageEmbed } = require("discord.js");
const {
  formatLeagueAPIQuery,
  formatSummonerLeagueAPIQuery,
} = require("../util/helpers");
module.exports = {
  messageManager: async (msg) => {
    const messageArr = msg.content.split(" ");
    const parsedMsg = parseArgs(messageArr);
    const command = parsedMsg._[0];
    const nick = parsedMsg._[1] || null;

    if (command === "!ranked-check") {
      await msg.reply("Performing ranked check on everybody!");
      players.forEach(async (playerID) => {
        console.log(formatLeagueAPIQuery(playerID));
        const response = await axios.get(formatLeagueAPIQuery(playerID));
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
          .setColor("#dddddd");
        if (soloQStats) {
          embed.addField(
            "Solo/Duo",
            `Tier: ${soloQStats.tier}-${soloQStats.rank} ${
              soloQStats.miniSeries ? `(${soloQStats.miniSeries.progress})` : ""
            }\nWinRate: ${Math.floor(
              (soloQStats.wins / (soloQStats.wins + soloQStats.losses)) * 100
            )}%`
          );
        } else {
          embed.addField("Solo/Duo", "Unranked");
        }
        if (flexStats) {
          embed.addField(
            "Flex",
            `Tier: ${flexStats.tier}-${flexStats.rank} ${
              flexStats.miniSeries ? `(${flexStats.miniSeries.progress})` : ""
            }\nWinRate: ${Math.floor(
              (flexStats.wins / (flexStats.wins + flexStats.losses)) * 100
            )}%`
          );
        } else {
          embed.addField("Flex", "Unranked");
        }
        await msg.channel.send(embed);
      });
    } else if (command === "!check") {
      if (nick) {
        try {
          await msg.reply(`Performing ranked check for ${nick}`);

          const summonerResponse = await axios.get(
            formatSummonerLeagueAPIQuery(nick)
          );
          const summonerId = summonerResponse.data.id;
          const rankedStatsResponse = await axios.get(
            formatLeagueAPIQuery(summonerId)
          );
          let soloQStats, flexStats;
          if (rankedStatsResponse.data[0].queueType == "RANKED_FLEX_SR") {
            flexStats = rankedStatsResponse.data[0];
            soloQStats = rankedStatsResponse.data[1];
          } else {
            flexStats = rankedStatsResponse.data[1];
            soloQStats = rankedStatsResponse.data[0];
          }
          const { summonerName } = rankedStatsResponse.data[0];
          const embed = new MessageEmbed()
            .setTitle(summonerName)
            .setColor("#dddddd");
          if (soloQStats) {
            embed.addField(
              "Solo/Duo",
              `Tier: ${soloQStats.tier}-${soloQStats.rank} ${
                soloQStats.miniSeries
                  ? `(${soloQStats.miniSeries.progress})`
                  : ""
              }\nWinRate: ${Math.floor(
                (soloQStats.wins / (soloQStats.wins + soloQStats.losses)) * 100
              )}%`
            );
          } else {
            embed.addField("Solo/Duo", "Unranked");
          }
          if (flexStats) {
            embed.addField(
              "Flex",
              `Tier: ${flexStats.tier}-${flexStats.rank} ${
                flexStats.miniSeries ? `(${flexStats.miniSeries.progress})` : ""
              }\nWinRate: ${Math.floor(
                (flexStats.wins / (flexStats.wins + flexStats.losses)) * 100
              )}%`
            );
          } else {
            embed.addField("Flex", "Unranked");
          }

          await msg.channel.send(embed);
        } catch (err) {
          if (err.response) {
            await msg.reply(err.response.data.status.message);
          }
        }
      }
    }
  },
};
