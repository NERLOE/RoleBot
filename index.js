const Discord = require("discord.js");
const client = new Discord.Client();
const { config } = require("dotenv");

config({
  path: __dirname + "/.env"
});

async function clear(channel) {
  const fetched = await channel.fetchMessages({ limit: 99 });
  channel.bulkDelete(fetched);
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  client.guilds.forEach(guild => {
    const channel = guild.channels.get("610224312196136995");
    clear(channel);

    channel.send(
      "@everyone Reagér på denne besked med følgende emojis, og i vil herefter modtage ranks som passer til jeres klasse og årgang."
    );
  });
});

client.login(process.env.TOKEN);
