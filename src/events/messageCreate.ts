import {
	deleteMessage,
	sendMessage,
	Bot,
	DiscordenoMessage, 
} from "../deps.ts";

export function messageCreate(bot: Bot, message: DiscordenoMessage) {
	// anti-invites for users lol
	if (message.content.match(/(https:\/\/)?(discord.((gg\/\w+)|(com\/(invite\/\w+))))/g)) {
		sendMessage(bot, message.channelId, "No send invites!!! help <@632319035102462004>");
		deleteMessage(bot, message.channelId, message.id);
	}
}