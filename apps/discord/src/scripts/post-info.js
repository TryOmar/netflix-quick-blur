import { createInfoEmbeds } from '../embeds/infoEmbed.js';

export async function postInfo(guild) {
  const channel = guild.channels.cache.find(
    (c) => c.name.includes('info') && c.isTextBased()
  );

  if (!channel) {
    console.error('  ! Could not find #info channel to post embeds.');
    return;
  }

  try {
    // Clear old bot messages in info channel
    const messages = await channel.messages.fetch({ limit: 20 });
    for (const msg of messages.values()) {
      if (msg.author.id === guild.client.user.id) {
        await msg.delete().catch(() => {});
      }
    }

    const payload = createInfoEmbeds(guild);
    await channel.send(payload);
    console.log('  ✓ Published 4 modular #info cards with Action Buttons.');
  } catch (err) {
    console.error('  ! Failed to post #info embeds:', err.message);
  }
}
