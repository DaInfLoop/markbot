import {
	config,
	createSlashCommand, 
	createBot,
	startBot,
	ApplicationCommandTypes,
	Bot,
	DotenvConfig
} from "./deps.ts";

import { readDir } from "./util/readDir.ts";
import { alive } from "./util/alive.ts";

import { interactionCreate } from "./events/interactionCreate.ts";
import { messageCreate } from "./events/messageCreate.ts";
import { messageDelete } from "./events/messageDelete.ts";
import { ready } from "./events/ready.ts";

const env: DotenvConfig = config();

// bot setup
const bot: Bot = createBot({
	token: env.TOKEN,
	botId: BigInt(env.ID),
	applicationId: BigInt(env.ID),
	events: {
		interactionCreate,
		messageCreate,
		messageDelete,
		ready
	},
	intents: ["Guilds", "GuildMessages"],
	cache: {
		isAsync: false,
	},
});

// load interactions (commands and buttons)
export const commands = new Map();
export const commandNames: string[] = [];
export const buttonsActions = new Map();

readDir("src/commands", (file) => {
	import(`./commands/${file.name}`).then((file: any) => {
		const command = file.default();

		createSlashCommand(bot, {
			name: command.name,
			description: command.description,
			options: command.options,
			type: ApplicationCommandTypes.ChatInput
		}, 883781994583056384n);

		commands.set(command.name, command);
		commandNames.push(command.name);
	});
});

readDir("src/buttons", (file) => {
	import(`./buttons/${file.name}`).then((file: any) => {
		const button = file.default();

		buttonsActions.set(button.name, button);
	});
});

// run alive for 24/7 (doubtful) and start bot
startBot(bot);
alive();