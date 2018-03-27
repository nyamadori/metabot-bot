import * as yargs from 'yargs'
import BotDefinition from './BotDefinition'
import BotContext from './BotContext'
import CommandDefinition from './CommandDefinition'

export default class Exector {
  private definition: BotDefinition

  constructor(definition: BotDefinition) {
    this.definition = definition
  }

  execute(context: BotContext): Promise<any> {
    return new Promise((resolve, reject) => {
      const messageText = context.message['text']

      this.yargs().parse(messageText, (err, parsedArgs, output) => {
        if (err || output) {
          return resolve(this.buildMessageForCmdHelp(messageText, output))
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
    let currentCommand: CommandDefinition = null

    commandPath.forEach((cmd) => {
      currentCommand = commands[cmd]
      commands = currentCommand.subcommands
    })

    return currentCommand
  }

  private toYargsCommandModule(def: CommandDefinition) {
    const commandModule: yargs.CommandModule = {
      describe: def.desc,
      command: def.command,
      builder: (yargs) => {
        if (def.subcommands) {
          Object.keys(def.subcommands).forEach((cmd) => {
            yargs.command(this.toYargsCommandModule(def.subcommands[cmd]))
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

  private yargs() {
    const base =
      yargs
        .strict()
        .help()
        .version()
        .recommendCommands()
        .showHelpOnFail(false)
        .wrap(72)

    Object.keys(this.definition.commands).forEach((cmd) => {
      const cmdDef = this.toYargsCommandModule(this.definition.commands[cmd])
      base.command(cmdDef)
    })

    return base
  }

  private buildMessageForCmdHelp(cmd, message) {
    return {
      text: `/meta ${cmd}`,
      attachments: [
        {
          text: "```" + message + "```"
        }
      ]
    }
  }
}
