import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { syncRoles } from './sync-roles.js';
import { syncChannels } from './sync-channels.js';
import { postRules } from './post-rules.js';
import { postInfo } from './post-info.js';
import { config } from '../config.js';

dotenv.config();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function deployAll(guild) {
  console.log('\n======================================================');
  console.log('NETFLIX QUICK BLUR — DISCORD SERVER PROVISIONING');
  console.log(`Target Server: ${guild.name} (${guild.id})`);
  console.log('======================================================\n');

  console.log('[1/4] SYNCING ROLES (NO EMOJIS)...');
  await syncRoles(guild);
  await delay(1000);

  console.log('\n[2/4] SYNCING CATEGORIES & CHANNELS...');
  await syncChannels(guild);
  await delay(1000);

  console.log('\n[3/4] PUBLISHING BRAND EMBEDS...');
  await postRules(guild);
  await delay(500);
  await postInfo(guild);

  console.log('\n======================================================');
  console.log('🎉 DISCORD SERVER PROVISIONED SUCCESSFULLY! 🎉');
  console.log('======================================================\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  });

  client.once('clientReady', async () => {
    console.log(`[Client] Logged in as ${client.user.tag}`);
    try {
      const targetGuildId = process.env.GUILD_ID || config.guildId;
      const guild = await client.guilds.fetch(targetGuildId);
      if (!guild) {
        console.error(`Could not find Guild ID: ${targetGuildId}`);
        process.exit(1);
      }
      await deployAll(guild);
      process.exit(0);
    } catch (err) {
      console.error('Deployment error:', err.message);
      process.exit(1);
    }
  });

  client.login(process.env.DISCORD_TOKEN || config.token);
}
