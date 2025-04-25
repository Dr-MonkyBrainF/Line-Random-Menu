import { NextResponse } from "next/server";
import getRandomRecipe from "@/lib/getRandomRecipe"; // ← 追加

export async function GET() {
  try {
    const recipe = await getRandomRecipe();
    return NextResponse.json(recipe);
  } catch (error) {
    console.error("レシピ取得エラー:", error);
    return NextResponse.json({ error: "レシピの取得に失敗しました" }, { status: 500 });
  }
}
