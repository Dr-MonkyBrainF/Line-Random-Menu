interface Category {
    categoryId: number;
    categoryName: string;
    categoryUrl: string;
    parentCategoryId: string;
  }
  
  export default async function getRandomRecipe() {
    const APP_ID = process.env.RAKUTEN_APP_ID!;
    
    // カテゴリIDを指定して1つだけ取得
    const categoryId = 619; // ここでは例として「マドレーヌ」カテゴリを指定しています
    const catRes = await fetch(`https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?applicationId=${APP_ID}&categoryId=${categoryId}`);
    
    const rankingJson = await catRes.json();
  
    // レシピが取得できているか確認
    console.log("レシピレスポンス:", JSON.stringify(rankingJson, null, 2));
  
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