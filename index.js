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
        console.log("emojis", msg.guild.emojis.cache);
        const emotes = msg.guild.emojis.cache.map(
          emoji =>
            emoji.name === "1Q" ||
            emoji.name === "1X" ||
            emoji.name === "1T" ||
            emoji.name === "3Q" ||
            emoji.name === "3X"
        );

        reactionMessageID = msg.id;

        emotes.forEach(emote => msg.react(emote));
      });
  });
});

client.on("messageReactionAdd", (reaction, user) => {
  console.log(user);
  if (reaction.message.id == reactionMessageID) {
    //console.log(messageReaction);
    var emoji = reaction.message.guild.emojis.cache.find(
      emoji => emoji.name === reaction._emoji.name
    );

    if (!emoji) {
      user.send("Kunne ikke finde denne emoji!");
      reaction.remove();
      return;
    }

    var role = reaction.message.guild.roles.cache.find(
      role => role.name === reaction._emoji.name
    );

    if (!role) {
      user.send("Kunne ikke finde nogen rolle med denne emoji!");
      reaction.remove();
      return;
    }

    //console.log(role);
    user.send(
      "Du reagerede med " +
        reaction._emoji.name +
        " og vil modtage rollen: " +
        role.name
    );

    let gMember = reaction.message.guild.member(user);
    gMember.roles.add(role);
  }
});

client.login(process.env.TOKEN);
