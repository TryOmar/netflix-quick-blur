import { ChannelType, PermissionFlagsBits } from 'discord.js';
import { config } from '../config.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function syncChannels(guild) {
  console.log(`[CHANNELS] Syncing layout for: ${guild.name} (${guild.id})`);

  const founderRole = guild.roles.cache.find((r) => r.name === 'Founder');
  const adminRole = guild.roles.cache.find((r) => r.name === 'Admin');

  for (const catDef of config.categories) {
    let category = guild.channels.cache.find(
      (c) =>
        c.type === ChannelType.GuildCategory &&
        c.name.toLowerCase() === catDef.name.toLowerCase()
    );

    if (!category) {
      try {
        category = await guild.channels.create({
          name: catDef.name,
          type: ChannelType.GuildCategory,
          reason: 'Netflix Quick Blur Category Layout',
        });
        console.log(`  + Created Category: "${catDef.name}"`);
        await delay(400);
      } catch (err) {
        console.error(`  ! Failed to create category "${catDef.name}":`, err.message);
        continue;
      }
    }

    // Sync channels under this category
    for (const chDef of catDef.channels) {
      const isVoice = chDef.type === 'voice';
      const targetType = isVoice ? ChannelType.GuildVoice : ChannelType.GuildText;

      let channel = guild.channels.cache.find(
        (c) =>
          c.name.toLowerCase() === chDef.name.toLowerCase() &&
          c.parentId === category.id
      );

      const permissionOverwrites = [];

      if (catDef.readOnly) {
        permissionOverwrites.push({
          id: guild.roles.everyone.id,
          deny: [PermissionFlagsBits.SendMessages],
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory],
        });
        if (founderRole) {
          permissionOverwrites.push({
            id: founderRole.id,
            allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
          });
        }
        if (adminRole) {
          permissionOverwrites.push({
            id: adminRole.id,
            allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
          });
        }
      }

      if (!channel) {
        try {
          channel = await guild.channels.create({
            name: chDef.name,
            type: targetType,
            parent: category.id,
            topic: chDef.topic || undefined,
            permissionOverwrites: permissionOverwrites.length > 0 ? permissionOverwrites : undefined,
            reason: 'Netflix Quick Blur Channel Layout',
          });
          console.log(`    + Created Channel: #${chDef.name}`);
          await delay(400);
        } catch (err) {
          console.error(`    ! Failed to create channel "${chDef.name}":`, err.message);
        }
      } else {
        try {
          await channel.edit({
            parent: category.id,
            topic: chDef.topic || undefined,
            permissionOverwrites: permissionOverwrites.length > 0 ? permissionOverwrites : undefined,
          });
          console.log(`    * Verified Channel: #${chDef.name}`);
        } catch (err) {
          console.error(`    ! Failed to update channel "${chDef.name}":`, err.message);
        }
      }
    }
  }

  console.log('[CHANNELS] Layout sync completed.');
}
