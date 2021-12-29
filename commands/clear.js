/* eslint-disable no-restricted-globals */
/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clears set number of messages.')
    .addIntegerOption((option) => option.setName('int').setDescription('Enter an integer')),
  async execute(interaction, integer) {
    if (!integer) return interaction.reply('Please enter the number of interactions you want to clear!');
    if (isNaN(integer)) return interaction.reply('Please enter a real number!');
    if (integer > 10) return interaction.reply('You can only clear 10 messages at a time!');
    if (integer < 1) return interaction.reply('You must delete at least one message!');

    await interaction.channel.messages.fetch({ limit: integer }).then((messages) => {
      interaction.channel.bulkDelete(messages);
      return interaction.reply(`Deleted ${integer} messages`);
    });
  },
};
