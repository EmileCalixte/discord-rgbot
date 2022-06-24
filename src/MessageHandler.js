const {Message} = require("discord.js");
const RgbManager = require("./RgbManager");

const COMMAND_PREFIX = "!rgb";

/**
 * @property {Message} message
 * @property {string[]} words
 */
class MessageHandler {
    constructor(message) {
        this.message = message;
        this.words = message.content.split(' ');
    }

    handle() {
        const author = this.message.member;

        if (this.words.length === 0 || this.words[0] !== COMMAND_PREFIX) {
            return;
        }

        // User must be an administrator
        if (!author.permissions.has("ADMINISTRATOR")) {
            return;
        }

        if (this.message.mentions.roles.size === 0) {
            this.replyHelp();
            return;
        }

        switch (this.words[1]) {
            case 'enable':
                RgbManager.getInstance().enable(author.guild, Array.from(this.message.mentions.roles));
                break;
            case 'disable':
                RgbManager.getInstance().disable(author.guild, Array.from(this.message.mentions.roles));
                break;
            default:
                this.replyHelp();
        }
    }

    replyHelp() {
        this.message.reply("Use `!rgb enable <@Role>` and `!rgb disable <@Role>` to enable or disable RGB");
    }
}

module.exports = MessageHandler;
