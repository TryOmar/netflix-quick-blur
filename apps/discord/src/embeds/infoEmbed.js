import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { config } from '../config.js';

export function createInfoEmbeds(guild) {
  let brokenSelectorsMention = '**#🚨・broken-selectors**';
  if (guild && guild.channels && guild.channels.cache) {
    const brokenCh = guild.channels.cache.find(
      (c) => c.name && c.name.includes('broken-selectors')
    );
    if (brokenCh) {
      brokenSelectorsMention = `<#${brokenCh.id}>`;
    }
  }

  // Card 1: Hero & Mission
  const headerEmbed = new EmbedBuilder()
    .setColor(config.colors.netflixRed)
    .setTitle('🎬 Netflix Quick Blur — Protocol & Mission')
    .setDescription(
      '> **“Instant, native-feeling privacy for Netflix.”**\n' +
      '> A production-grade, open-source privacy and controls ecosystem for Netflix. Shroud sensitive scenes, prevent subtitle plot spoilers, and engage instant privacy with a single keystroke.'
    );

  // Card 2: Core Engineering Capabilities (2-Line Key/Value with Spacing)
  const featuresEmbed = new EmbedBuilder()
    .setColor(config.colors.netflixRed)
    .setTitle('⚡ Architectural Capabilities')
    .setDescription(
      '**🎯 Native Player Bar Injection**\n' +
      'Injected directly into Netflix’s playback bar beside Fullscreen.\n\n' +
      '**⌨️ Instant Playback Veil (Key B)**\n' +
      'One-key visual shroud: hardware-accelerated CSS blur + dimming.\n\n' +
      '**🛡️ Spacebar Focus Integrity**\n' +
      'Automatically releases button focus (`btn.blur()`) so Spacebar always plays/pauses.\n\n' +
      '**🚫 Subtitle Dialogue Shield**\n' +
      'Conceals `.player-timedtext` subtitles simultaneously with blur to eliminate spoilers.\n\n' +
      '**🔒 100% Offline Enclave**\n' +
      'Zero remote telemetry, zero analytics, zero external network requests.'
    );

  // Card 3: Official Release Links & Downloads
  const linksEmbed = new EmbedBuilder()
    .setColor(config.colors.netflixRed)
    .setTitle('🚀 Official Release Channels')
    .setDescription(
      '**💻 1. GitHub Repository**\n' +
      '[Source Code & Monorepo Architecture](' + config.brand.links.githubRepo + ')\n\n' +
      '**🌐 2. Official Website & Live Simulator**\n' +
      '[Test the Player Live in Your Browser](' + config.brand.links.website + ')\n\n' +
      '**🧩 3. Chrome Web Store**\n' +
      '[Install Manifest V3 Extension](' + config.brand.links.chromeWebStore + ')\n\n' +
      '**📜 4. Tampermonkey Userscript (.user.js)**\n' +
      '[1-Click Direct Script Install](' + config.brand.links.userscript + ')\n\n' +
      '**🟢 5. Selector Health & Status Dashboard**\n' +
      '[Real-Time DOM Health & Changelog](' + config.brand.links.status + ')'
    );

  // Card 4: Support & Broken Selectors Triage
  const supportEmbed = new EmbedBuilder()
    .setColor(config.colors.netflixRed)
    .setTitle('🚨 Rapid Triage & Support')
    .setDescription(
      'Netflix frequently rolls out client updates and A/B layout experiments.\n\n' +
      '**🚨 Broken Button or Disappeared Controls?**\n' +
      `Post in ${brokenSelectorsMention} with your Netflix URL layout and a screenshot.\n` +
      'Because all selectors live in `packages/core/src/selectors.ts`, fixes are pushed in under 60 seconds.\n\n' +
      '**🎮 Sister Ecosystem**\n' +
      '[Pray Then Play — Salah First. Gaming Second.](' + config.brand.links.sisterProject + ')'
    )
    .setFooter({
      text: 'Netflix Quick Blur • 100% Offline • Zero Telemetry • MIT License',
    })
    .setTimestamp();

  // Button Row 1: Primary Links
  const row1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel('GitHub Repo')
      .setStyle(ButtonStyle.Link)
      .setURL(config.brand.links.githubRepo),
    new ButtonBuilder()
      .setLabel('Showcase & Simulator')
      .setStyle(ButtonStyle.Link)
      .setURL(config.brand.links.website),
    new ButtonBuilder()
      .setLabel('Chrome Web Store')
      .setStyle(ButtonStyle.Link)
      .setURL(config.brand.links.chromeWebStore),
    new ButtonBuilder()
      .setLabel('1-Click Userscript')
      .setStyle(ButtonStyle.Link)
      .setURL(config.brand.links.userscript)
  );

  return {
    embeds: [headerEmbed, featuresEmbed, linksEmbed, supportEmbed],
    components: [row1],
  };
}
