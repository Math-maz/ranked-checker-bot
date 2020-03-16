module.exports = {
  formatLeagueAPIQuery: id => {
    return `https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${process.env.LEAGUE_API_KEY}`;
  },
  formatSummonerLeagueAPIQuery: summonerName => {
    return `https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${process.env.LEAGUE_API_KEY}`;
  }
};
