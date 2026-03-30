import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
  {
    name: "short",
    description: "Shorten any url",
    options: [
      {
        name: "url",
        type: 3,
        description: "Enter the URL",
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: 10 }).setToken(process.env.TOKEN);
try {
  console.log("Started refreshing application (/) commands.");

  await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID,
    ),
    {
      body: commands,
    },
  );

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.error(error);
}
