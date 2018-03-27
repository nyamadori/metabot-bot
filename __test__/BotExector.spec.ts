import BotExector from '../src/BotExector'

describe('BotExector', () => {
  describe('#execute', () => {
    it('returns Promise object', () => {
      const exector = new BotExector({ commands: {} })
      expect(exector.execute({ message: { text: 'cmd' } })).toBeInstanceOf(Promise)
    })

    it('calls handler of matched command and returns message', async () => {
      const exector = new BotExector({
        commands: {
          echo: {
            command: 'echo <msg>',
            desc: 'echos your message',
            handler: async ({ args }) => {
              return { msg: args['msg'] }
            }
          }
        }
      })

      const result = await exector.execute({ message: { text: 'echo hello' } })

      expect(result).toEqual({ msg: 'hello' })
    })

    it('returns help message when given `--help`', async () => {
      const exector = new BotExector({
        commands: {
          echo: {
            command: 'echo <msg>',
            desc: 'echos your message',
            handler: async ({ args }) => {
              return { msg: args['msg'] }
            }
          }
        }
      })

      const result = await exector.execute({ message: { text: 'echo --help' } })

      expect(result['attachments'][0]['text']).toMatch(/.*--help.*/)
    })
  })
})
