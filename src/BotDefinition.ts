import CommandDefinition from './CommandDefinition'

export default interface BotDefinition {
  commands: { [key: string]: CommandDefinition }
}
