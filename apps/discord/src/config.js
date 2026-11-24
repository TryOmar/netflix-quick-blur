import dotenv from 'dotenv';
dotenv.config();

export const config = {
  token: process.env.DISCORD_TOKEN || '',
  clientId: process.env.CLIENT_ID || '1538247541311930539',
  guildId: process.env.GUILD_ID || '1574873571367321651',

  colors: {
    netflixRed: '#E50914',
    darkObsidian: '#0D0D10',
    goldAmber: '#F59E0B',
    emerald: '#10B981',
    royalPurple: '#8B5CF6',
    electricBlue: '#3B82F6',
    cyan: '#06B6D4',
    slateMuted: '#94A3B8',
  },

  brand: {
    name: 'Netflix Quick Blur',
    tagline: 'Instant, native-feeling privacy for Netflix.',
    description:
      'A production-grade, open-source privacy and controls ecosystem for Netflix. 1-key veil, dialogue subtitle concealment, and spacebar-safe playback controls.',
    links: {
      githubRepo: 'https://github.com/TryOmar/netflix-quick-blur',
      website: 'https://tryomar.github.io/netflix-quick-blur/',
      chromeWebStore: 'https://chrome.google.com/webstore',
      userscript: 'https://tryomar.github.io/netflix-quick-blur/downloads/netflix-quick-blur.user.js',
      greasyfork: 'https://greasyfork.org/',
      status: 'https://tryomar.github.io/netflix-quick-blur/status.html',
      sisterProject: 'https://github.com/TryOmar/pray-then-play',
    },
  },

  // Role Definitions (STRICTLY NO EMOJIS IN ROLE NAMES)
  roles: [
    // 1. Staff & Management
    {
      name: 'Founder',
      color: '#F59E0B',
      hoist: true,
      permissions: ['Administrator'],
      mentionable: true,
      key: 'founder',
    },
    {
      name: 'Admin',
      color: '#10B981',
      hoist: true,
      permissions: [
        'ManageMessages',
        'KickMembers',
        'BanMembers',
        'ModerateMembers',
        'ManageThreads',
        'ViewAuditLog',
      ],
      mentionable: true,
      key: 'admin',
    },
    {
      name: 'Bot',
      color: '#06B6D4',
      hoist: true,
      permissions: [
        'ManageChannels',
        'ManageRoles',
        'EmbedLinks',
        'AttachFiles',
        'ManageMessages',
      ],
      mentionable: false,
      key: 'bot',
    },
    {
      name: 'Supporter',
      color: '#8B5CF6',
      hoist: true,
      permissions: ['ChangeNickname', 'UseExternalEmojis', 'AttachFiles'],
      mentionable: false,
      key: 'supporter',
    },
    {
      name: 'Beta Tester',
      color: '#3B82F6',
      hoist: true,
      permissions: ['ViewChannel', 'SendMessages', 'AttachFiles'],
      mentionable: false,
      key: 'tester',
    },
    {
      name: 'Member',
      color: '#99AAB5',
      hoist: false,
      permissions: [],
      key: 'member',
    },

    // 2. Platform Roles (Self-Assignable)
    { name: '─── PLATFORMS ───', color: '#2B2D31', hoist: false, isDivider: true, key: 'div_platforms' },
    { name: 'Extension User', color: '#E50914', hoist: false, key: 'role_extension' },
    { name: 'Userscript User', color: '#F59E0B', hoist: false, key: 'role_userscript' },

    // 3. Notification Roles (Self-Assignable)
    { name: '─── NOTIFICATIONS ───', color: '#2B2D31', hoist: false, isDivider: true, key: 'div_notifications' },
    { name: 'New Releases & Updates', color: '#E50914', hoist: false, key: 'role_notify_releases' },
    { name: 'Selector Alerts & Patch Notes', color: '#F59E0B', hoist: false, key: 'role_notify_selectors' },
  ],

  // Category and Channel Taxonomy
  categories: [
    {
      name: '⛩️・PROTOCOL',
      type: 'category',
      readOnly: true,
      channels: [
        {
          name: '💎・info',
          type: 'text',
          topic: 'About Netflix Quick Blur, official store links, downloads, and selector health.',
          embedType: 'info',
        },
        {
          name: '📜・rules',
          type: 'text',
          topic: 'Code of conduct and community guidelines.',
          embedType: 'rules',
        },
        {
          name: '📢・announcements',
          type: 'text',
          topic: 'Major version releases, Chrome Web Store updates, and features.',
        },
        {
          name: '🎭・roles',
          type: 'text',
          topic: 'Self-assignable roles for extension users, userscript users, and release alerts.',
        },
      ],
    },
    {
      name: '💬・COMMUNITY',
      type: 'category',
      channels: [
        {
          name: '💬・general',
          type: 'text',
          topic: 'Main community discussion for Netflix Quick Blur.',
        },
        {
          name: '💡・feedback',
          type: 'text',
          topic: 'Feature suggestions, hotkey ideas, preset requests, and enhancements.',
        },
      ],
    },
    {
      name: '🛠️・SUPPORT & DEV',
      type: 'category',
      channels: [
        {
          name: '🚨・broken-selectors',
          type: 'text',
          topic: 'Did a Netflix client update move or hide the button? Post here with screenshots for a rapid patch.',
        },
        {
          name: '🧪・beta-testing',
          type: 'text',
          topic: 'Testing unreleased .zip builds and userscripts before store publishing.',
        },
        {
          name: '💻・github-feed',
          type: 'text',
          topic: 'Automated GitHub webhooks for commits, releases, and pull requests.',
        },
      ],
    },
    {
      name: '🔊・VOICE',
      type: 'category',
      channels: [
        {
          name: '🔊・Lounge',
          type: 'voice',
        },
        {
          name: '🌙・AFK',
          type: 'voice',
        },
      ],
    },
  ],
};
