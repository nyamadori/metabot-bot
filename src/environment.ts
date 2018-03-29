import { SlashCommand } from './slack'

export class CommandEnvironment {
  message: SlashCommand
  brain: any
}
