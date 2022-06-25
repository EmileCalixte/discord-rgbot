const {Client, Intents} = require("discord.js");
const MessageHandler = require("./MessageHandler");
const RgbManager = require("./RgbManager");
require('dotenv').config();

const addBotUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=268437504&scope=bot`;

console.log(`Add bot to your servers: ${addBotUrl}`);

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
    ]
});

client.once('ready', () => {
    console.log('Client ready');

    RgbManager.getInstance(client);
});

client.login(process.env.BOT_TOKEN);

client.on('messageCreate', async(message) => {
    (new MessageHandler(message)).handle();
});

client.on('rateLimit', (rateLimitData) => {
    console.log(rateLimitData);
    process.exit(429);
});

client.on('apiResponse', (request, response) => {
    console.log(Array.from(response.headers.values));
});

