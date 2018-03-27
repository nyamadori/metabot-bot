/**
 * import * as metabot from 'metabot-bot'
 * import * as echo from './commands/echo'
 *
 * export const bot = metabot.defineBot({
 *   commands: { echo }
 * })
 *
 * export const command = 'echo <message>'
 * export const desc = 'Echos your message'
 *
 * export async function execute({ args, message }) {
 *   return {
 *     response_type: "in_channel",
 *     text: `${args.message}`
 *   }
 * }
 * export const subcommands = { }
 */
import BotDefinition from './BotDefinition'
import BotExector from './BotExector'

export function defineBot(definition: BotDefinition) {
  return new BotExector(definition)
}
