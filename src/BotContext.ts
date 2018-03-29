import { firestore } from 'firebase'

export interface BotContext {
  message: {},
  brainSnapshot?: firestore.DocumentSnapshot
}
