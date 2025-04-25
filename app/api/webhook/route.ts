import { NextRequest, NextResponse } from "next/server";

async function getRandomRecipe() {
  const APP_ID = process.env.RAKUTEN_APP_ID!;

  const catRes = await fetch(
    `https://app.rakuten.co.jp/services/api/Recipe/CategoryList/20170426?applicationId=${APP_ID}`
  );
  const catJson = await catRes.json();

  if (!catJson.result || !catJson.result.small || catJson.result.small.length === 0) {
    throw new Error("カテゴリ取得失敗");
  }

  const categories = catJson.result.small;
  const randomCat = categories[Math.floor(Math.random() * categories.length)];

  const rankingRes = await fetch(
    `https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?applicationId=${APP_ID}&categoryId=${randomCat.categoryId}`
  );
  const rankingJson = await rankingRes.json();

  if (!rankingJson.result || rankingJson.result.length === 0) {
    throw new Error("レシピが見つかりませんでした");
  }

  const recipes = rankingJson.result;
  const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];

  return {
    title: randomRecipe.recipeTitle,
    url: randomRecipe.recipeUrl,
  };
}

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
              text: `今日のおすすめレシピ：\n${title}\n${url}`,
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
              text: "レシピの取得に失敗しました💦",
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
