module.exports = {
  formatLeagueAPIQuery: id => {
    return `https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${process.env.LEAGUE_API_KEY}`;
  }
};
