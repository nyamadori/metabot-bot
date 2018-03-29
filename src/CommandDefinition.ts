import * as yargs from 'yargs'
import { BotContext } from './BotContext'

export interface CommandDefinition {
  command: string,
  desc: string,
  handler({ args, context }: { args: {}; context: BotContext }): Promise<any>,
  params?: { [key: string]: yargs.PositionalOptions },
  options?: { [key: string]: yargs.Options }
  subcommands?: { [key: string]: CommandDefinition },
}
