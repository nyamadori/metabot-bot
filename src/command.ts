import 'reflect-metadata'
import * as yargs from 'yargs'
import { CommandEnvironment } from './environment'

export class Parser {
  constructor(
    private rootCommandClass: typeof CommandBase,
    private helpCommandClass: typeof CommandBase = DefaultHelpCommand
  ) { }

  parse(args: string[]) {
    const nickname = args[0]
    const parser = this.createYarg(nickname)

    let cmd: CommandBase

    parser.parse(args, (err, parsedArgs, output) => {
      if (err || output) {
        cmd = new this.helpCommandClass({ output, command: args.join(' ') })
        return
      }

      const commandPath = parsedArgs._
      const commandCtor = this.retrieveCommandCtor(commandPath)

      cmd = new commandCtor(parsedArgs)
    })

    return cmd
  }

  private retrieveCommandCtor(commandPath: string[]) {
    var commands = this.rootCommandClass.subCommands
    let currentCommand = CommandBase

    commandPath.slice(1).forEach((cmd) => {
      currentCommand = commands[cmd]
      commands = currentCommand.subCommands
    })

    return currentCommand
  }

  private createYarg(nickname: string) {
    const parser =
      yargs
        .strict()
        .help()
        .version()
        .recommendCommands()
        .showHelpOnFail(false)
        .wrap(72)

    parser.command(this.toYargsCommandModule(nickname, this.rootCommandClass))

    return parser
  }

  private toYargsCommandModule(nickname: string, cmdClass: typeof CommandBase) {
    const command = cmdClass.command.replace('$nickname', nickname)

    const commandModule: yargs.CommandModule = {
      describe: cmdClass.description,
      command: command,
      builder: (yargs) => {
        if (cmdClass.subCommands) {
          Object.keys(cmdClass.subCommands).forEach((cmd) => {
            yargs.command(this.toYargsCommandModule(nickname, cmdClass.subCommands[cmd]))
          })
        }

        if (cmdClass.positionals) {
          Object.keys(cmdClass.positionals).forEach((param) => {
            yargs.positional(param, cmdClass.positionals[param])
          })
        }

        if (cmdClass.options) {
          Object.keys(cmdClass.options).forEach((opt) => {
            yargs.option(opt, cmdClass.options[opt])
          })
        }

        return yargs
      },
      handler: () => { }
    }

    return commandModule
  }

}

export interface ICommand {
  execute(env: CommandEnvironment): Promise<any>
}

export class CommandBase implements ICommand {
  constructor(args: {}) {
    Object.keys(args).forEach((key) => {
      this[key] = args[key]
    })
  }

  execute(env: CommandEnvironment): Promise<any> {
    return null
  }

  static command: string
  static description: string
  static positionals: {}
  static options: {}
  static subCommands: {}
  static transactional: boolean = false
}

export class DefaultHelpCommand extends CommandBase{
  command: string
  output: string
}

export function Command(command: string, description: string) {
  return (ctor: typeof CommandBase) => {
    ctor.command = command
    ctor.description = description
    ctor.subCommands = ctor.subCommands || {}
  }
}

export function SubCommand(name: string, command: typeof CommandBase) {
  return (ctor: typeof CommandBase) => {
    ctor.subCommands = Object.assign(ctor.subCommands || {}, { [name]: command })
  }
}

export function Transactional(ctor: typeof CommandBase) {
  ctor.transactional = true
}

export function Positional(description?: string, options = {}) {
  return (target: CommandBase, property: string) => {
    const attrs = options || {}
    const ctor = Reflect.getMetadata('design:type', target, property)

    attrs['type'] = ctor.name.toLowerCase()
    attrs['description'] = description

    target.constructor['positionals'] = target.constructor['positionals'] || {}
    target.constructor['positionals'][property] = attrs
  }
}

export function Option(description?: string, options = {}) {
  return (target: CommandBase, property: string) => {
    const attrs = options || {}
    const ctor = Reflect.getMetadata('design:type', target, property)

    attrs['type'] = ctor.name.toLowerCase()
    attrs['description'] = description

    target.constructor['options'] = target.constructor['options'] || {}
    target.constructor['options'][property] = attrs
  }
}
