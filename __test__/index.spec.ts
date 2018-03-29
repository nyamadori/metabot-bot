import * as MetabotBot from '../dist/index'
import { BotExector } from '../dist/index'

describe('.defineBot', () => {
  it('returns BotExector object', () => {
    expect(
      MetabotBot.defineBot({
        commands: {}
      })
    ).toBeInstanceOf(BotExector)
  })
})
