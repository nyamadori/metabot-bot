import { Command, CommandBase, SubCommand, Positional, Option, Parser, DefaultHelpCommand } from '../src/command'

describe('Parser', () => {
  @Command('invite <botName>', 'Invite a bot')
  class InviteCommand extends CommandBase {
    @Positional('botname')
    botName: string
  }

  @Command('metabot <command> [args..]', 'Echos your message')
  @SubCommand('invite', InviteCommand)
  class MetabotCommand extends CommandBase {
    @Positional('msg')
    message: string

    @Option('toggle bold', { alias: '-b' })
    bold: boolean
  }

  const parser = new Parser(MetabotCommand)

  describe('#parse', () => {
    it('returns InviteCommand object', () => {
      const cmd = <InviteCommand>parser.parse(['metabot', 'invite', 'hoge'])

      expect(cmd).toBeInstanceOf(InviteCommand)
      expect(cmd.botName).toEqual('hoge')
    })

    describe('when typo', () => {
      it('returns DefaultHelpCommand object', () => {
        const cmd = <DefaultHelpCommand>parser.parse(['metabot', 'inv', 'hoge'])

        expect(cmd).toBeInstanceOf(DefaultHelpCommand)
      })
    })
  })
})
