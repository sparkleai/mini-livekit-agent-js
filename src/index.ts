import 'dotenv/config'
import {
  AutoSubscribe,
  type JobContext,
  type JobProcess,
  WorkerOptions,
  cli,
  defineAgent,
  llm,
  pipeline,
} from '@livekit/agents'
import * as deepgram from '@livekit/agents-plugin-deepgram'
import * as openai from '@livekit/agents-plugin-openai'
import * as silero from '@livekit/agents-plugin-silero'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'

export default defineAgent({
  prewarm: async (proc: JobProcess) => {
    proc.userData.vad = await silero.VAD.load({
      minSilenceDuration: 500,
    })
  },
  entry: async (ctx: JobContext) => {
    const vad = ctx.proc.userData.vad as silero.VAD | undefined
    if (vad === undefined) {
      throw new Error('VAD not initialized in prewarm')
    }
    const initialContext = new llm.ChatContext().append({
      role: llm.ChatRole.SYSTEM,
      text:
`# 指示
あなたは親切な電話オペレータです。
ユーザの問題を解決してください。

## 制約
* ユーザとは電話を介してやり取りしています。
* ユーザの発言はSTTで文字変換されたものです。音声認識の聞き間違いや同音異義語の存在を考慮します。
* あなたの回答もTTSで音声に変換してユーザに伝えられます。そのことを考慮し端的で短い回答をします。
* TTSを利用しているため、次のことを考慮します。
  * 強調したい箇所があれば「**」で囲むなどの方法を用いる。
  * 句読点をコントロールして適切な間をとる。
`,
    })

    await ctx.connect(undefined, AutoSubscribe.AUDIO_ONLY)
    console.log('waiting for participant')
    const participant = await ctx.waitForParticipant()
    console.log(`starting assistant example agent for ${participant.identity}`)

    const agent = new pipeline.VoicePipelineAgent(
      vad,
      new deepgram.STT({ language: 'ja' }),
      new openai.LLM({ apiKey: process.env.OPENAI_API_KEY, model: 'gpt-4.1-mini' }),
      new openai.TTS({ apiKey: process.env.OPENAI_API_KEY }),
      {
        chatCtx: initialContext,
      },
    )
    agent.start(ctx.room, participant)

    await agent.say('お電話ありがとうございます。今日は何をお手伝いしましょうか？', true)
  },
})

cli.runApp(
  new WorkerOptions({
    agent: fileURLToPath(import.meta.url),
    wsURL: process.env.LIVEKIT_URL,
    apiKey: process.env.LIVEKIT_API_KEY,
    apiSecret: process.env.LIVEKIT_API_SECRET,
  }),
)
