// app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET!;
const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('x-line-signature') ?? '';

  // 署名の検証
  const hash = crypto
    .createHmac('SHA256', CHANNEL_SECRET)
    .update(body)
    .digest('base64');

  if (hash !== signature) {
    return new NextResponse('Invalid signature', { status: 401 });
  }

  const events = JSON.parse(body).events;

  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const replyToken = event.replyToken;
      const userMessage = event.message.text;

      // メッセージに "レシピ" などが含まれていたらランダムレシピを取得
      if (userMessage.includes('レシピ')) {
        const recipe = await getRandomRecipe();

        // LINEに返信
        await fetch('https://api.line.me/v2/bot/message/reply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
          },
          body: JSON.stringify({
            replyToken,
            messages: [
              {
                type: 'text',
                text: `今日のおすすめ: ${recipe.title}\n${recipe.url}`,
              },
            ],
          }),
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
