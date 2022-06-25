const {Client, Guild, Role} = require("discord.js");
const fs = require("fs");
const path = require("path");

const COLORS = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
];

const UPDATE_INTERVAL = 5000;

class RgbManager {
    static instance = null;

    static getInstance(client) {
        if (RgbManager.instance === null) {
            RgbManager.instance = new RgbManager(client);
        }

        return RgbManager.instance;
    }

    constructor(client) {
        /** @property {Client} */
        this.client = client;

        /** @type {Role[]} */
        this.rolesToUpdate = [];
        this.nextColorIndex = 0;

        this.loadConfigFromJsonFile();

        setInterval(this.changeRolesColor.bind(this), UPDATE_INTERVAL);
    }

    changeRolesColor() {
        this.rolesToUpdate.forEach(role => {
            role.setColor(COLORS[this.nextColorIndex]);
        });

        ++this.nextColorIndex;
        if (this.nextColorIndex >= COLORS.length) {
            this.nextColorIndex = 0;
        }
    }

    /**
     * @param {Guild} guild
     * @param {Map<Role>} roles
     */
    enable(guild, roles) {
        const config = JSON.parse(this.getConfigJsonContent());

        if (!config.hasOwnProperty(guild.id)) {
            config[guild.id] = [];
        }

        roles.forEach(([roleId, role]) => {
            if (!this.ensureRoleBelongsToGuils(role, guild)) {
                return;
            }

            if (!config[guild.id].includes(roleId)) {
                config[guild.id].push(roleId);
            }
        });

        this.writeConfigJsonContent(JSON.stringify(config));
        this.loadConfigFromJsonFile();
    }

    disable(guild, roles) {
        const config = JSON.parse(this.getConfigJsonContent());

        roles.forEach(([roleId, role]) => {
            if (!this.ensureRoleBelongsToGuils(role, guild)) {
                return;
            }

            config[guild.id] = config[guild.id].filter(enabledRoleId => enabledRoleId !== roleId);
        });

        this.writeConfigJsonContent(JSON.stringify(config));
        this.loadConfigFromJsonFile();
    }

    /**
     * @param {Role} role
     * @param {Guild} guild
     */
    ensureRoleBelongsToGuils(role, guild) {
        const resolvedRole = guild.roles.resolve(role);

        return !!resolvedRole;
    }

    getConfigJsonContent() {
        return fs.readFileSync(path.resolve(__dirname, './config/rgbConfig.json')).toString();
    }

    writeConfigJsonContent(jsonContent) {
        return fs.writeFileSync(path.resolve(__dirname, './config/rgbConfig.json'), jsonContent);
    }

    async loadConfigFromJsonFile() {
        const guilds = await this.client.guilds.fetch();
        const fetchedGuilds = {};

        const config = JSON.parse(this.getConfigJsonContent());

        /** @type {Role[]} */
        const rolesToUpdate = [];

        for (const guildId in config) {
            const oauth2Guild = guilds.get(guildId);

            if (!oauth2Guild) {
                continue;
            }

            if (!fetchedGuilds.hasOwnProperty(guildId)) {
                fetchedGuilds[guildId] = await oauth2Guild.fetch();
            }

            const guild = fetchedGuilds[guildId];
            const roleManager = guild.roles;

            config[guildId].forEach(async roleId => {
                const role = await roleManager.fetch(roleId);
                rolesToUpdate.push(role);
            });
        }

        this.rolesToUpdate = rolesToUpdate;
    }
}

module.exports = RgbManager;
