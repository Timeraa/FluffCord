# FluffCord

Discord API Wrapper for deno.

## 🚧 Highly WIP!

# TODO

- Set a max cache length for messages etc.
- .test.ts files
- better README

# Example

```ts
// Import module
import { Client, Message } from "https://deno.land/x/fluffcord/mod.ts";

// Creating a client
const client = new Client({
	token: "TOKEN"
});

// Listening to events
client.on("messageCreate", async (message: Message) => {
	// Ignore bot messages
	if (msg.author.bot) return;

	// Ping command
	if (msg.content.startsWith("s!ping")) {
		// Delete the user message
		msg.delete();
		// Send a ping message
		const message = await msg.channel.send("Pinging..."),
			// Calculate timestamps
			now = message.timestamp - msg.timestamp;
		// Edit message with ping times
		await message.edit(`Pong! REST: \`${now}\`ms - WS: \`${client.ping}\`ms`);
		// Delete the previous sent message after 5 seconds
		message.delete({ timeout: 5 * 1000 });
		return;
	}
});
```
