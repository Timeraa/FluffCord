import { Client, User, Role, Guild, GuildMember } from "../mod.ts";

export enum ActivityType {
	GAME,
	STREAMING,
	LISTENING,
	WATCHING,
	CUSTOM
}

export interface Activity {
	name: string;
	type: ActivityType;
	url?: string;
	created_at: number;
	timestamps?: {
		start?: number;
		end?: number;
	};
	application_id?: string;
	details?: string | null;
	state?: string | null;
	emoji?: {
		name: string;
		id?: string;
		animated?: boolean;
	} | null;
	party?: {
		id?: number;
		size?: [number, number];
	};
	assets?: {
		large_image?: string;
		large_text?: string;
		small_image?: string;
		small_text?: string;
	};
	secrets?: {
		join?: string;
		specate?: string;
		match?: string;
	};
	instance?: boolean;
	flags?: number;
}

export type ClientStatus = "online" | "idle" | "dnd" | "offline";

export default class Presence {
	member: GuildMember;
	game: Activity;
	guild: Guild;
	status: "online" | "idle" | "dnd" | "offline" = "offline";
	activities: Activity[] = [];
	client_status: {
		desktop?: ClientStatus;
		mobile?: ClientStatus;
		web?: ClientStatus;
	} = {};
	constructor(client: Client, data: any) {
		this.guild = client.guilds.get(data.guild_id)!;
		this.member = this.guild.members.get(data.user_id)!;
		this.game = data.game;
		this.activities = data.activities;
		this.status = data.status;
		this.client_status = data.client_status;
	}
}
