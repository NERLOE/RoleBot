const Discord = require("discord.js");
const client = new Discord.Client();
const { config } = require("dotenv");

config({
  path: __dirname + "/.env"
});

async function clear(channel) {
  const fetched = await channel.messages.fetch({ limit: 99 });
  channel.bulkDelete(fetched);
}

var reactionMessageID;
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  client.guilds.cache.forEach(guild => {
    const channel = guild.channels.cache.get("687625065608642560");
    clear(channel);

    channel
      .send(
        "@everyone Reagér på denne besked med følgende emojis, og i vil herefter modtage ranks som passer til jeres klasse og årgang."
      )
      .then(msg => {
        reactionMessageID = msg.id;
        console.log(msg);
      });
  });
});

client.on("messageReactionAdd", (messageReaction, user) => {
  if (!messageReaction.message.id == reactionMessageID) {
    var role = message.guild.roles.find(
      role => role.name === messageReaction._emoji.name
    );
    messageReaction.author.send(
      "Du reagerede med " +
        messageReaction._emoji.name +
        " og vil modtage rollen: " +
        role
    );
  }
});

client.login(process.env.TOKEN);
