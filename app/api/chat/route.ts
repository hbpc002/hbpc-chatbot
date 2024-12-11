import { ZhipuAI } from 'zhipuai';

// 初始化智谱AI客户端
const client = new ZhipuAI({
  apiKey: process.env.ZHIPUAI_API_KEY || '', 
});

export async function POST(req: Request) {
  try {
    // 检查 API Key
    if (!process.env.ZHIPUAI_API_KEY) {
      console.error('API Key未设置');
      return new Response(
        JSON.stringify({ error: 'API Key未设置' }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { messages } = await req.json();
    
    // 创建一个 TransformStream
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // 异步处理响应
    (async () => {
      try {
        const response = await client.chat.completions.create({
          model: "glm-4",
          messages: messages,
          stream: true,
        });

        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          await writer.write(encoder.encode(content));
        }
      } catch (error) {
        console.error('Stream error:', error);
      } finally {
        await writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('请求处理错误:', error);
    return new Response(
      JSON.stringify({ 
        error: '服务器错误', 
        details: error instanceof Error ? error.message : String(error)
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 