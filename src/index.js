const {Client, Intents} = require("discord.js");

require('dotenv').config();

const addBotUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=268437504&scope=bot`;

console.log(`Add bot to your servers: ${addBotUrl}`);

const client = new Client({intents: [Intents.FLAGS.GUILDS]});

client.once('ready', () => {
    console.log('Client ready');
});

client.login(process.env.BOT_TOKEN);
