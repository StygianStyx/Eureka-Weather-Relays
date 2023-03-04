const { Client } = require("discord.js");
const fs = require("fs");
const EorzeaWeather = require("eorzea-weather");

const configData = JSON.parse(fs.readFileSync("config.json", "utf-8"));
const databaseData = JSON.parse(fs.readFileSync("database.json", "utf-8"));

const client = new Client({
  intents: [
    "Guilds",
    "GuildMembers",
    "GuildBans",
    "GuildEmojisAndStickers",
    "GuildIntegrations",
    "GuildWebhooks",
    "GuildInvites",
    "GuildPresences",
    "GuildMessages",
    "GuildMessageReactions",
    "GuildMessageTyping",
    "DirectMessages",
    "DirectMessageReactions",
    "DirectMessageTyping",
    "MessageContent",
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot == false && message.content.startsWith("^")) {
    let parserMessage = messageParser(message);
    let cmd = parserMessage[0];
    let args = parserMessage[1];
    args = args.filter(function (e) {
      return e !== "";
    });

    if (cmd == "reminder") {
      if (args.length < 4) {
        message.channel.send("Not Enought Argument");
        return;
      }

      if (!args[0].includes("<@&")) {
        message.channel.send("Wrong Format Role");
        return;
      }

      if (!args[1].includes("<#")) {
        message.channel.send("Wrong Format Channel");
        return;
      }

      if (!databaseData.weather[args[2]]) {
        message.channel.send("Wrong Format Weather");
        return;
      }

      if (!databaseData.zones.includes(args[3])) {
        message.channel.send("Wrong Format Zone");
        return;
      }

      var role = args[0];
      var channel = args[1].slice(2).slice(0, -1);
      var weather = args[2];
      var zone = args[3];

      var currentConfig = JSON.parse(fs.readFileSync("config.json", "utf-8"));
      currentConfig.data.push({
        id: Math.floor(100000 + Math.random() * 900000),
        guildid: message.guild.id,
        channelid: channel,
        role: role,
        weather: weather,
        zone: zone,
        reminded: 0,
      });
      fs.writeFileSync("config.json", JSON.stringify(currentConfig));

      message.channel.send("Success set reminder");
    } else if (cmd == "listreminder") {
      var sendedMessage = "";
      var currentConfig = JSON.parse(fs.readFileSync("config.json", "utf-8"));
      var nowDataArray = currentConfig.data;
      for (let index = 0; index < nowDataArray.length; index++) {
        var nowdata = nowDataArray[index];
        var role_name = message.guild.roles.cache.find((c) => c.id == nowdata["role"].slice(3).slice(0, -1)).name;
        var channel_name = message.guild.channels.cache.find((c) => c.id == nowdata["channelid"]).name;
        sendedMessage = sendedMessage + `- ${nowdata.id} : Reminder ${role_name} role at ${channel_name} channel, For ${nowdata["zone"]} Zone and ${nowdata["weather"]} Weather \n`;
      }

      if (nowDataArray.length == 0) {
        message.channel.send("Nothing...");
      } else {
        message.channel.send(sendedMessage);
      }
    } else if (cmd == "unremind") {
      if (args.length < 1) {
        message.channel.send("Not Enought Argument");
        return;
      }

      var currentConfig = JSON.parse(fs.readFileSync("config.json", "utf-8"));
      var nowDataArray = currentConfig.data;
      var newDataArray = [];

      for (let index = 0; index < nowDataArray.length; index++) {
        if (nowDataArray[index].id != args[0]) {
          newDataArray.push(nowDataArray[index]);
        }
      }
      currentConfig.data = newDataArray;
      fs.writeFileSync("config.json", JSON.stringify(currentConfig));

      message.channel.send(`Success Unremind with id : ${args[0]}`);
    } else if (cmd == "listweather") {
      message.channel.send(
        "WEATHER_BLIZZARDS\nWEATHER_CLEAR_SKIES\nWEATHER_CLOUDS\nWEATHER_DUST_STORMS\nWEATHER_FAIR_SKIES\nWEATHER_FOG\nWEATHER_GALES\nWEATHER_GLOOM\nWEATHER_HEAT_WAVES\nWEATHER_RAIN\nWEATHER_SHOWERS\nWEATHER_SNOW\nWEATHER_THUNDER\nWEATHER_THUNDERSTORMS\nWEATHER_UMBRAL_STATIC\nWEATHER_UMBRAL_WIND\nWEATHER_WIND\n"
      );
    } else if (cmd == "listzone") {
      message.channel.send(
        "ZONE_AMH_ARAENG\nZONE_AZYS_LLA\nZONE_BOZJAN_SOUTHERN_FRONT\nZONE_CENTRAL_SHROUD\nZONE_CENTRAL_THANALAN\nZONE_COERTHAS_CENTRAL_HIGHLANDS\nZONE_COERTHAS_WESTERN_HIGHLANDS\nZONE_EAST_SHROUD\nZONE_EASTERN_LA_NOSCEA\nZONE_EASTERN_THANALAN\nZONE_EULMORE\nZONE_EUREKA_ANEMOS\nZONE_EUREKA_HYDATOS\nZONE_EUREKA_PAGOS\nZONE_EUREKA_PYROS\nZONE_GRIDANIA\nZONE_IDYLLSHIRE\nZONE_IL_MHEG\nZONE_ISHGARD\nZONE_KHOLUSIA\nZONE_KUGANE\nZONE_LAKELAND\nZONE_LIMSA_LOMINSA\nZONE_LOWER_LA_NOSCEA\nZONE_MIDDLE_LA_NOSCEA\nZONE_MIST\nZONE_MOR_DHONA\nZONE_NORTH_SHROUD\nZONE_NORTHERN_THANALAN\nZONE_OUTER_LA_NOSCEA\nZONE_RHALGRS_REACH\nZONE_SHIROGANE\nZONE_SOUTH_SHROUD\nZONE_SOUTHERN_THANALAN\nZONE_THE_AZIM_STEPPE\nZONE_THE_CHURNING_MISTS\nZONE_THE_CRYSTARIUM\nZONE_THE_DIADEM\nZONE_THE_DRAVANIAN_FORELANDS\nZONE_THE_DRAVANIAN_HINTERLANDS\nZONE_THE_FRINGES\nZONE_THE_GOBLET\nZONE_THE_LAVENDER_BEDS\nZONE_THE_LOCHS\nZONE_THE_PEAKS\nZONE_THE_RAKTIKA_GREATWOOD\nZONE_THE_RUBY_SEA\nZONE_THE_SEA_OF_CLOUDS\nZONE_THE_TEMPEST\nZONE_ULDAH\nZONE_UPPER_LA_NOSCEA\nZONE_WESTERN_LA_NOSCEA\nZONE_WESTERN_THANALAN\nZONE_WOLVES_DEN_PIER\nZONE_YANXIA\nZONE_ZADNOR\n"
      );
    } else if (cmd == "help") {
      message.channel.send("^listzone \n ^listweather \n ^reminder <MetionedRole> <MentionedChannel> <Weather> <Zone> \n ^listreminder \n ^unremind <id_reminder> \n");
    }
  }
});

client.login(configData.token);

console.log(`Bot invite url: https://discord.com/api/oauth2/authorize?client_id=${configData.appid}&permissions=8&scope=bot%20applications.commands`);

setInterval(() => {
  var currentConfig = JSON.parse(fs.readFileSync("config.json", "utf-8"));
  var time20ahead = new Date(new Date().getTime() + 20 * 60000);
  var nowDataArray = currentConfig.data;

  for (let index = 0; index < nowDataArray.length; index++) {
    var nowData = nowDataArray[index];
    var correctFormat = databaseData.weather[nowData.weather].charAt(0).toUpperCase() + databaseData.weather[nowData.weather].slice(1);
    var wheatherCheck = EorzeaWeather.getWeather(EorzeaWeather[nowData["zone"]], time20ahead);

    if (wheatherCheck == correctFormat) {
      if (currentConfig.data[index].reminded == 0) {
        var reqServer = client.guilds.cache.find((guild) => guild.id === nowData["guildid"]);
        var boundChn = reqServer.channels.cache.find((c) => c.id == nowData["channelid"]);

        boundChn.send(`In less than 20 minutes the weather change to ${wheatherCheck} in ${nowData["zone"]} ${nowData["role"]}`);
        currentConfig.data[index].reminded = 1;
      }
    } else {
      currentConfig.data[index].reminded = 0;
    }
  }
  fs.writeFileSync("config.json", JSON.stringify(currentConfig));
}, 1000 * 30);

function messageParser(message) {
  let cmd;
  let args = [];

  if (message.content.split(" ").length == 0) {
    cmd = message.content;
  } else {
    cmd = message.content.split(" ")[0];

    args = message.content.split(" ");
    args.shift();
  }

  cmd = cmd.substring(1);
  cmd = cmd.toLowerCase();

  return [cmd, args];
}
