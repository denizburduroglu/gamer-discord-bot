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
    const axios = require('axios');

    axios({
      url: 'https://the-one-api.dev/v2/quote',
      method: 'get',
      timeout: 1000,
      headers: {
        Authorization: `Bearer ${lotrToken}`,
      },
    }).then((response) => {
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
      console.log('dialogs', dialogs);
      // Send random reply
      const randomDialog = dialogs[Math.floor(Math.random() * (dialogs.length - 1))];
      console.log('randomDialog', randomDialog);
      interaction.reply(randomDialog.dialog);
    })
      .catch((error) => {
        console.error(error);
        interaction.reply('MAN THE GATES!');
      });
  },
};
