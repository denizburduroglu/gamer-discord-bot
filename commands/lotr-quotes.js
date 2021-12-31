/* eslint-disable global-require */
/* eslint-disable no-restricted-globals */
/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balrog')
    .setDescription('You\'ve been balrogged.'),
  async execute(interaction, lotrToken) {
    const quoteMessage = {
      movieName: '',
      characterName: '',
      quote: '',
    };

    const axios = require('axios');
    const params = {
      timeout: 1000,
      headers: {
        Authorization: `Bearer ${lotrToken}`,
      },
    };

    axios.get('https://the-one-api.dev/v2/quote', params).then((response) => {
      /*
        Array of dialog
        [{
          _id: '5cd96e05de30eff6ebcce83d',
          dialog: 'Oh! Well here is a sight I have never seen before.',
          movie: '5cd95395de30eff6ebccde5d',
          character: '5cd99d4bde30eff6ebccfc38'
        }...]
      */
      const dialogs = response.data.docs;
      // Send random reply
      const randomDialog = dialogs[Math.floor(Math.random() * (dialogs.length - 1))];
      console.log('randomDialog', randomDialog);
      quoteMessage.quote = randomDialog.dialog;
      return Promise.all([
        axios.get(`https://the-one-api.dev/v2/movie/${randomDialog.movie}`, params),
        axios.get(`https://the-one-api.dev/v2/character/${randomDialog.character}`, params),
      ]);
    }).then((movieAndCharacter) => {
      /*
        Movie response:
        [
          {
            _id: '5cd95395de30eff6ebccde5b',
            name: 'The Two Towers ',
            runtimeInMinutes: 179,
            budgetInMillions: 94,
            boxOfficeRevenueInMillions: 926,
            academyAwardNominations: 6,
            academyAwardWins: 2,
            rottenTomatoesScore: 96
          }
        ],
        ------------------------------------------------------
        Character response:
        [
          {
            _id: '5cd99d4bde30eff6ebccfd81',
            height: '',
            race: 'Elf',
            gender: 'Male',
            birth: '',
            spouse: '',
            death: 'Still alive, departed to ,Aman ,FO 120',
            realm: '',
            hair: 'Uncertain (book), Blonde (films)',
            name: 'Legolas',
            wikiUrl: 'http://lotr.wikia.com//wiki/Legolas'
          }
        ],
      */
      quoteMessage.movieName = movieAndCharacter[0].data.docs[0].name;
      quoteMessage.characterName = movieAndCharacter[1].data.docs[0].name;
      interaction.reply(`\`\`\`
      "${quoteMessage.quote}"
      
        ${quoteMessage.characterName}
        ${quoteMessage.movieName}
      \`\`\``);
    })
      .catch((error) => {
        console.error(error);
        interaction.reply('MAN THE GATES!');
      });
  },
};
