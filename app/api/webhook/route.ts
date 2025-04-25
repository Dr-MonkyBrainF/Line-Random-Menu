import { NextRequest, NextResponse } from "next/server";
import getRandomRecipe from "@/lib/getRandomRecipe";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const events = body.events;

  const TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN!;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  };

  for (const event of events) {
    if (event.type === "message" && event.message.type === "text") {
      try {
        const { title, url } = await getRandomRecipe();

        const replyBody = {
          replyToken: event.replyToken,
          messages: [
            {
              type: "text",
              text: `おすすめレシピ：\n${title}\n${url}`,
            },
          ],
        };

        await fetch("https://api.line.me/v2/bot/message/reply", {
          method: "POST",
          headers,
          body: JSON.stringify(replyBody),
        });
      } catch (error) {
        console.error("レシピ取得エラー:", error);

        const errorReply = {
          replyToken: event.replyToken,
          messages: [
            {
              type: "text",
              text: "レシピの取得に失敗しました",
            },
          ],
        };

        await fetch("https://api.line.me/v2/bot/message/reply", {
          method: "POST",
          headers,
          body: JSON.stringify(errorReply),
        });
      }
    }
  }

  return NextResponse.json({ message: "ok" });
}
