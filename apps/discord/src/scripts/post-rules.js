import { createRulesEmbed } from '../embeds/rulesEmbed.js';

export async function postRules(guild) {
  const channel = guild.channels.cache.find(
    (c) => c.name.includes('rules') && c.isTextBased()
  );

  if (!channel) {
    console.error('  ! Could not find #rules channel to post embeds.');
    return;
  }

  try {
    const messages = await channel.messages.fetch({ limit: 20 });
    for (const msg of messages.values()) {
      if (msg.author.id === guild.client.user.id) {
        await msg.delete().catch(() => {});
      }
    }

    const embed = createRulesEmbed();
    await channel.send({ embeds: [embed] });
    console.log('  ✓ Published #rules Code of Conduct embed.');
  } catch (err) {
    console.error('  ! Failed to post #rules embed:', err.message);
  }
}
