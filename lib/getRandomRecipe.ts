// lib/getRandomRecipe.ts

export default async function getRandomRecipe() {
    const APP_ID = process.env.RAKUTEN_APP_ID!;
    
    const catRes = await fetch(`https://app.rakuten.co.jp/services/api/Recipe/CategoryList/20170426?applicationId=${APP_ID}`);
    const catJson = await catRes.json();
  
    if (!catJson.result || !catJson.result.small || catJson.result.small.length === 0) {
      throw new Error("カテゴリ取得失敗");
    }
  
    const categories = catJson.result.small;
    const randomCat = categories[Math.floor(Math.random() * categories.length)];
  
    const rankingRes = await fetch(`https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?applicationId=${APP_ID}&categoryId=${randomCat.categoryId}`);
    const rankingJson = await rankingRes.json();
  
    if (!rankingJson.result || rankingJson.result.length === 0) {
      throw new Error("レシピが見つかりませんでした");
    }
  
    const randomRecipe = rankingJson.result[Math.floor(Math.random() * rankingJson.result.length)];
  
    return {
      title: randomRecipe.recipeTitle,
      url: randomRecipe.recipeUrl,
    };
  }
  