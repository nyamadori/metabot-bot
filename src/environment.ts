import { SlashCommand } from './slack'

export interface CommandEnvironment {
  message: SlashCommand
  brain: any
}
