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

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === "debug") {
    try {
      const code = interaction.options.getString("code");
      const error = interaction.options.getString("error");

      await interaction.deferReply();

      const prompt = `You are an expert debugging assistant.

        Analyze the following code and:
        1. Identify the problem
        2. Explain the issue clearly
        3. Provide a corrected version
        4. Also detect programming language automatically.
        5. Return corrected code inside proper code blocks (like js, python etc).
        6. Explain in simple terms suitable for beginners.
        7. and format in the following pattern:
                Problem:
                Fix:
                Explanation:

        Code:
        ${code}

        Error:
        ${error || "Not provided"}`;

      const answer = await askAi(prompt);
      //   console.log(answer);

      const embed = new EmbedBuilder()
        .setTitle("Debug Result")
        .setDescription(`Answer: ${answer}`)
        .setColor("Yellow");

      interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      console.log("Error: ", error);
      interaction.editReply("Something Went Wrong while debugging code");
    }
  }
});

client.login(process.env.TOKEN);
