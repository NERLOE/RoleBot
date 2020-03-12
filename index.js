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

var ready = false;
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
        //console.log("emojis", msg.guild.emojis.cache);
        const emotes = [];
        msg.guild.emojis.cache.forEach(emoji => {
          if (
            emoji.name === "1Q" ||
            emoji.name === "1X" ||
            emoji.name === "1T" ||
            emoji.name === "3Q" ||
            emoji.name === "3X"
          ) {
            emotes.push(emoji);
          }
        });

        reactionMessageID = msg.id;

        emotes.forEach(emote => msg.react(emote));
        ready = true;
      });
  });
});

client.on("messageReactionAdd", (reaction, user) => {
  if (user.id == "687618530283225168") return;

  if (reaction.message.id == reactionMessageID) {
    //console.log(messageReaction);
    var emoji = reaction.message.guild.emojis.cache.find(
      emoji => emoji.name === reaction._emoji.name
    );

    if (!emoji) {
      user.send("**FEjL!** Kunne ikke finde nogen rolle med denne emoji!");
      reaction.remove();
      return;
    }

    var role = reaction.message.guild.roles.cache.find(
      role => role.name === reaction._emoji.name
    );

    if (!role) {
      user.send("**FEjL!** Kunne ikke finde nogen rolle med denne emoji!");
      reaction.remove();
      return;
    }

    let gMember = reaction.message.guild.member(user);
    if (
      gMember.roles.cache.find(
        gRole =>
          gRole.name != role.name &&
          (gRole.name == "1Q" ||
            gRole.name == "1T" ||
            gRole.name == "1X" ||
            gRole.name == "3Q" ||
            gRole.name == "3X")
      )
    ) {
      user.send("**FEjL!** Du har allerede modtaget en klasserolle!");
      reaction.users.remove(user);
      return;
    }

    //user.send("Du har nu modtaget din klasserolle: **" + role.name + "**");
    gMember.roles.add(role);
  }
});

client.on("messageReactionRemove", (reaction, user) => {
  if (user.id == "687618530283225168") return;

  if (ready || reaction.message.id == reactionMessageID) {
    //console.log(messageReaction);
    var emoji = reaction.message.guild.emojis.cache.find(
      emoji => emoji.name === reaction._emoji.name
    );

    if (!emoji) {
      user.send("**FEjL!** Kunne ikke finde nogen rolle med denne emoji!");
      return;
    }

    var role = reaction.message.guild.roles.cache.find(
      role => role.name === reaction._emoji.name
    );

    if (!role) {
      user.send("**FEjL!** Kunne ikke finde nogen rolle med denne emoji!");
      return;
    }

    //console.log(role);
    //user.send("Du har nu fået fjernet klasserollen: **" + role.name + "**");

    let gMember = reaction.message.guild.member(user);
    gMember.roles.remove(role);
  }
});

client.login(process.env.TOKEN);
