import { NextResponse } from 'next/server'
// import { ZhipuAI } from '@zhipu-ai/sdk'
import { ZhipuAI } from 'zhipuai';
const client = new ZhipuAI({
  apiKey: process.env.ZHIPUAI_API_KEY
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const response = await client.chat.completions.create({
      model: 'glm-4',
      messages: messages,
      stream: true,
      temperature: 0.7,
    })

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const text = chunk.choices[0]?.delta?.content || ''
          controller.enqueue(new TextEncoder().encode(text))
        }
        controller.close()
      }
    })

    return new Response(stream)
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Error processing chat request' },
      { status: 500 }
    )
  }
} 