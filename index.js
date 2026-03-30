import {
  Client,
  GatewayIntentBits,
  Partials,
  Events,
  EmbedBuilder,
} from "discord.js";
import dotenv from "dotenv";
dotenv.config();

import axios from "axios";

import { askAi } from "./service/aiService.js";

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
  if (interaction.commandName === "short") {
    const url = interaction.options.getString("url");
    await interaction.deferReply();

    try {
      const res = await axios.post(
        "https://url-shortener-by6a.onrender.com/api/v1/url",
        {
          redirectUrl: url,
        },
      );
      const shortUrl = res.data.data.shotUrl;
      const embed = new EmbedBuilder()
        .setTitle("URL Shortened")
        .setDescription(`Short Url: ${shortUrl}`)
        .setColor("Green");

      return interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      console.log("Error: ", error);
      await interaction.editReply("Failed To Generate Short Url");
    }
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ask") {
    try {
      const question = interaction.options.getString("question");
      await interaction.deferReply();

      const answer = await askAi(question);
      //   console.log(answer);
      const embed = new EmbedBuilder()
        .setTitle("Answer")
        .setDescription(`**Q:** ${question}\n\n**A:** ${answer}`)
        .setColor("Blue");

      return interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      console.log("Error: ", error);
      return interaction.editReply(
        "Somethign went wrong while generating Answer.",
      );
    }
  }
});

client.login(process.env.TOKEN);
