import { EmbedBuilder } from 'discord.js';
import { config } from '../config.js';

export function createRulesEmbed() {
  return new EmbedBuilder()
    .setColor(config.colors.netflixRed)
    .setTitle('📜 Netflix Quick Blur — Code of Conduct')
    .setDescription(
      'Welcome to the official Netflix Quick Blur community. Please adhere to these core tenets:\n\n' +
      '**1. Mutual Respect & Decorum**\n' +
      'Treat fellow members, testers, and open-source contributors with courtesy. Harassment, toxicity, or hate speech will result in immediate bans.\n\n' +
      '**2. Constructive Bug Reports**\n' +
      'When reporting broken selectors in **#broken-selectors**, include your browser name, Netflix URL pathname, and a screenshot so our maintainers can verify immediately.\n\n' +
      '**3. No Piracy or Credential Sharing**\n' +
      'Do not share, trade, or distribute Netflix accounts, login credentials, or pirated media streams. This community is strictly dedicated to client-side productivity and accessibility extensions.\n\n' +
      '**4. Open Source Transparency**\n' +
      'All source code is publicly auditable under the MIT license at https://github.com/TryOmar/netflix-quick-blur.'
    )
    .setFooter({
      text: 'Netflix Quick Blur Community Standards',
    })
    .setTimestamp();
}
