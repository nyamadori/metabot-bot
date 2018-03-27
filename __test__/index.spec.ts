import * as MetabotBot from '../dist/index'
import BotExector from '../dist/BotExector'

describe('.defineBot', () => {
  it('returns BotExector object', () => {
    expect(
      MetabotBot.defineBot({
        commands: {}
      })
    ).toBeInstanceOf(BotExector)
  })
})
