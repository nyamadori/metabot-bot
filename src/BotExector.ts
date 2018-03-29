import * as yargs from 'yargs'
import { BotDefinition } from './BotDefinition'
import { BotContext } from './BotContext'
import { CommandDefinition } from './CommandDefinition'

export class BotExector {
  private definition: BotDefinition

  constructor(definition: BotDefinition) {
    this.definition = definition
  }

  execute(command: string[], context: BotContext): Promise<any> {
    const cmdStr = command.join(' ')
    const rootCommand = command[0]

    return new Promise((resolve, reject) => {
      this.yargs(rootCommand).parse(cmdStr, (err, parsedArgs, output) => {
        if (err || output) {
          return resolve(this.buildMessageForCmdHelp(rootCommand, cmdStr, output))
        }

        const commandPath = parsedArgs._
        const commandDef = this.commandDefinitionFrom(commandPath)

        commandDef
          .handler({ args: parsedArgs, context })
          .catch(reject)
          .then(resolve)
      })
    })
  }

  private commandDefinitionFrom(commandPath: string[]) {
    var commands = this.definition.commands
    let currentCommand: CommandDefinition = commands['root']

    commandPath.slice(1).forEach((cmd) => {
      currentCommand = commands[cmd]
      commands = currentCommand.subcommands
    })

    return currentCommand
  }

  private toYargsCommandModule(rootCommand: string, def: CommandDefinition) {
    const command = def.command.replace('%{botNickname}', rootCommand)

    const commandModule: yargs.CommandModule = {
      describe: def.desc,
      command: command,
      builder: (yargs) => {
        if (def.subcommands) {
          Object.keys(def.subcommands).forEach((cmd) => {
            yargs.command(this.toYargsCommandModule(rootCommand, def.subcommands[cmd]))
          })
        }

        if (def.params) {
          Object.keys(def.params).forEach((param) => {
            yargs.positional(param, def.params[param])
          })
        }

        if (def.options) {
          Object.keys(def.options).forEach((opt) => {
            yargs.option(opt, def.params[opt])
          })
        }

        return yargs
      },
      handler: () => {}
    }

    return commandModule
  }

  private yargs(rootCommand: string) {
    const base =
      yargs
        .strict()
        .help()
        .version()
        .recommendCommands()
        .showHelpOnFail(false)
        .wrap(72)

    Object.keys(this.definition.commands).forEach((cmd) => {
      const cmdDef = this.toYargsCommandModule(rootCommand, this.definition.commands[cmd])
      base.command(cmdDef)
    })

    return base
  }

  private buildMessageForCmdHelp(rootCommand, restCommand, message) {
    return {
      text: `${rootCommand} ${restCommand}`,
      attachments: [
        {
          text: "```" + message + "```"
        }
      ]
    }
  }
}
