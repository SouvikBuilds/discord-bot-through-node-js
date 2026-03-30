import { Client, GatewayIntentBits, Partials, Events } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageTyping,
  ],
  partials: [Partials.Message, Partials.Reaction, Partials.Channel],
});

client.on(Events.ClientReady, (readyClient) => {
  console.log(`[LOG]: ${readyClient.user.tag} logged in`);
});

client.on(Events.MessageCreate, (message) => {
  if (message.author.bot) return;
  if (
    message.content.trim().toLowerCase() === "hi" ||
    message.content.trim().toLowerCase() === "hello"
  ) {
    message.channel.send("Hi, From Bot 🤖");
  }
});

client.on(Events.TypingStart, (message) => {
  console.log(`${message.user.tag} is typing in ${message.channel.name}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const url = interaction.options.getString("url");
  if (interaction.commandName === "short") {
    await interaction.reply(`Generating Short Url for ${url}`);
  }
});

client.login(process.env.TOKEN);
