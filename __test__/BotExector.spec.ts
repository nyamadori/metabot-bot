import { BotExector } from '../src/BotExector'

describe('BotExector', () => {
  describe('#execute', () => {
    it('returns Promise object', () => {
      const exector = new BotExector({ commands: {} })
      expect(exector.execute('cmd', { message: { text: 'cmd' } })).toBeInstanceOf(Promise)
    })

    it('calls handler of matched command and returns message', async () => {
      const exector = new BotExector({
        commands: {
          root: {
            command: 'echo <msg>',
            desc: 'echos your message',
            handler: async ({ args }) => {
              return { msg: args['msg'] }
            }
          }
        }
      })

      const result = await exector.execute('echo hello', { message: { text: 'echo hello' } })

      expect(result).toEqual({ msg: 'hello' })
    })

    it('returns help message when given `--help`', async () => {
      const exector = new BotExector({
        commands: {
          root: {
            command: 'echo <msg>',
            desc: 'echos your message',
            handler: async ({ args }) => {
              return { msg: args['msg'] }
            }
          }
        }
      })

      const result = await exector.execute('echo --help', { message: { text: 'echo --help' } })

      expect(result['attachments'][0]['text']).toMatch(/.*--help.*/)
    })

    it('calls handler with botNickname', async () => {
      const exector = new BotExector({
        commands: {
          root: {
            command: '%{botNickname} <msg>',
            desc: 'echos your message',
            handler: async ({ args }) => {
              return { msg: args['msg'] }
            }
          }
        }
      })

      const botNickname = `echo-${Math.ceil(Math.random() * 100)}`
      const msgText = `${botNickname} hello`
      const result = await exector.execute('botNickname, hello', { message: { text: msgText } })

      expect(result).toEqual({ msg: 'hello' })
    })

    it('calls subcommand', async () => {
      const exector = new BotExector({
        commands: {
          root: {
            command: '%{botNickname} <command> [args..]',
            desc: 'command',
            handler: async ({ args }) => { /*nop*/ },
            subcommands: {
              status: {
                command: 'status <text>',
                desc: 'shows status',
                handler: async ({ args }) => {
                  return { msg: args['text'] }
                }
              },

              remote: {
                command: 'remote <url>',
                desc: 'set remote url',
                handler: async ({ args }) => {
                  return { msg: args['url'] }
                }
              }
            }
          }
        }
      })

      const botNickname = `cmd-${Math.ceil(Math.random() * 100)}`

      const cmd1 = `${botNickname} status hello`
      const result1 = await exector.execute(cmd1, { message: { text: cmd1 } })
      expect(result1).toEqual({ msg: 'hello' })

      const cmd2 = `${botNickname} remote url`
      const result2 = await exector.execute(cmd2, { message: { text: cmd2 } })
      expect(result2).toEqual({ msg: 'url' })
    })
  })
})
