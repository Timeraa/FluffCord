import { resolveColor } from "../util/resolveColor.ts";

export interface Embed {
	title?: string;
	type?: "rich" | "image" | "video" | "gifv" | "article" | "link";
	description?: string;
	url?: string;
	timestamp?: number;
	color?: string | number;
	footer?: {
		text: string;
		icon_url?: string;
		proxy_icon_url?: string;
	};
	image?: {
		url?: string;
		proxy_url?: string;
		height?: number;
		width?: number;
	};
	thumbnail?: {
		url?: string;
		proxy_url?: string;
		height?: number;
		width?: number;
	};
	video?: {
		url?: string;
		height?: number;
		width?: number;
	};
	provider?: {
		name?: string;
		url?: string;
	};
	author?: {
		name?: string;
		url?: string;
		icon_url?: string;
		proxy_icon_url?: string;
	};
	fields?: {
		name: string;
		value: string;
		inline?: boolean;
	}[];
}

export class MessageEmbed {
	public embed: Embed;
	constructor(embed?: Embed) {
		if (embed?.color) embed.color = resolveColor(embed.color);

		if (embed) {
			if (!embed.fields) embed.fields = [];
			if (embed.type && embed.type !== "rich")
				throw "Embed type must be 'rich'";
			this.embed = embed;
		} else {
			this.embed = {
				fields: [],
				type: "rich"
			};
		}
	}

	setTitle(title: string) {
		if (title.length > 256) throw "Embed title must not exceed 256 characters";
		this.embed.title = title;
		return this;
	}
	setDescription(description: string) {
		if (description.length > 2048)
			throw "Embed description must not exceed 256 characters";
		this.embed.description = description;
		return this;
	}
	setURL(url: string) {
		this.embed.url = url;
		return this;
	}
	setTimestamp(date: number = Date.now()) {
		this.embed.timestamp = date;
		return this;
	}
	setColor(color: number) {
		this.embed.color = resolveColor(color);
	}
	setFooter(text: string, icon_url?: string, proxy_icon_url?: string) {
		if (text.length > 2048)
			throw "Embed footer text must not exceed 2048 characters";
		this.embed.footer = { text, icon_url, proxy_icon_url };
		return this;
	}
	setAuthor(name: string, url?: string, icon_url?: string) {
		this.embed.author = { name, url, icon_url };
		return this;
	}
	setImage(url: string, height?: number, width?: number, proxy_url?: string) {
		this.embed.image = { url, height, width, proxy_url };
		return this;
	}
	setThumbnail(
		url: string,
		height?: number,
		width?: number,
		proxy_url?: string
	) {
		this.embed.thumbnail = { url, height, width, proxy_url };
		return this;
	}
	addField(name: string, value: string, inline: boolean = false) {
		if (this.embed.fields?.length! > 25)
			throw "Embed fields must not exceed 25";
		if (name.length > 256)
			throw "Embed field name must not exceed 256 characters";
		if (value.length > 1024)
			throw "Embed field value must not exceed 1024 characters";
		this.embed.fields?.push({ name, value, inline });
	}
}
