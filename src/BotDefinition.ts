import { CommandDefinition } from './CommandDefinition'

export interface BotDefinition {
  commands: { [key: string]: CommandDefinition }
}
