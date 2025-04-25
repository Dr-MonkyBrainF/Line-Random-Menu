import { NextResponse } from "next/server";

async function getRandomRecipe() {
  const APP_ID = process.env.RAKUTEN_APP_ID!;

  const catRes = await fetch(`https://app.rakuten.co.jp/services/api/Recipe/CategoryList/20170426?applicationId=${APP_ID}`);
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

  // ログ出力
  console.log("カテゴリ取得レスポンス:", JSON.stringify(catJson, null, 2));
  console.log("レシピ取得レスポンス:", JSON.stringify(rankingJson, null, 2));

  return {
    title: randomRecipe.recipeTitle,
    url: randomRecipe.recipeUrl,
  };
}

export async function GET() {
  try {
    const recipe = await getRandomRecipe();
    return NextResponse.json(recipe);
  } catch (error) {
    console.error("レシピ取得エラー:", error);
    return NextResponse.json({ error: "レシピの取得に失敗しました" }, { status: 500 });
  }
}
