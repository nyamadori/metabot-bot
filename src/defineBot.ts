import { BotDefinition } from './BotDefinition'
import { BotExector } from './BotExector'

export function defineBot(definition: BotDefinition) {
  return new BotExector(definition)
}
