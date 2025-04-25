import { NextResponse } from "next/server";

async function getRandomRecipe() {
  const APP_ID = process.env.RAKUTEN_APP_ID!;
  
  const catRes = await fetch(`https://app.rakuten.co.jp/services/api/Recipe/CategoryList/20170426?applicationId=${APP_ID}`);
  const categories = (await catRes.json()).result.small;
  const randomCat = categories[Math.floor(Math.random() * categories.length)];

  const rankingRes = await fetch(
    `https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?applicationId=${APP_ID}&categoryId=${randomCat.categoryId}`
  );
  const recipes = (await rankingRes.json()).result;
  const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];

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
