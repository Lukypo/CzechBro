
require("dotenv").config();

const { token } = process.env;
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

const ClashClient = require('clashofclans.js').Client;
const cocClient = new ClashClient();
const { ClanWar, ClanWarMember, WarClan, ClanWarAttack } = require('clashofclans.js');

const client = new Client({ intents: GatewayIntentBits.Guilds });
client.commands = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));

    for(const file of functionFiles){
        require(`./functions/${folder}/${file}`)(client);
    }
}

async function clashApiSetup(){
  await cocClient.login({ email: 'lukypotv@gmail.com', password: 'Mad0namadona' });
}
clashApiSetup();

async function getWarInfo(){
  memberResults = `Attacks:\n\n`;
  
  const clanWarInfo = await cocClient.getClanWar('#PU9VGY2V');
  
  clanWarInfo.clan.members.forEach(mem => {
    memberResults += `${mem.name} ${mem.attacks.length}\n`;
    console.log(mem.name + " " + mem.attacks.length);
  })

  return memberResults;
}

cocClient.events.addWars('#PU9VGY2V');
const channelId = '1023646354540613685';
cocClient.events.setWarEvent({
  name: 'warEnded',
  filter: (prevState, newState) =>{
    return (prevState.state === newState.state) && newState.isWarEnded;
  }
});

cocClient.on('warEnded', async (prevState, newState) => {
  console.log(prevState.state, newState.state);
  const message = await getWarInfo();
  client.channels.cache.get(channelId).send(message);
})

client.handleEvents();
client.handleCommands();
client.login(token);

//getWarInfo();
(async function () {
  await cocClient.events.init();
})();
