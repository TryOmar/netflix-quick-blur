import { PermissionFlagsBits, PermissionsBitField } from 'discord.js';
import { config } from '../config.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function syncRoles(guild) {
  console.log(`[ROLES] Syncing roles for: ${guild.name} (${guild.id})`);

  let created = 0;
  let updated = 0;

  for (const roleDef of config.roles) {
    let existingRole = guild.roles.cache.find(
      (r) => r.name.toLowerCase() === roleDef.name.toLowerCase()
    );

    const perms = (roleDef.permissions || []).map(
      (p) => PermissionFlagsBits[p] || PermissionsBitField.Flags[p]
    );

    if (!existingRole) {
      try {
        await guild.roles.create({
          name: roleDef.name,
          color: roleDef.color || '#99AAB5',
          hoist: !!roleDef.hoist,
          permissions: perms,
          mentionable: !!roleDef.mentionable,
          reason: 'Netflix Quick Blur Role Hierarchy',
        });
        console.log(`  + Created: "${roleDef.name}" (${roleDef.color})`);
        created++;
        await delay(350);
      } catch (err) {
        console.error(`  ! Failed to create role "${roleDef.name}":`, err.message);
      }
    } else {
      try {
        await existingRole.edit({
          color: roleDef.color || '#99AAB5',
          hoist: !!roleDef.hoist,
          permissions: perms,
        });
        console.log(`  * Updated: "${roleDef.name}"`);
        updated++;
      } catch (err) {
        console.error(`  ! Failed to update role "${roleDef.name}":`, err.message);
      }
    }
  }

  console.log(`[ROLES] Finished. Created: ${created}, Updated: ${updated}`);
}
