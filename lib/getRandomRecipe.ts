interface Category {
    categoryId: number;
    categoryName: string;
    categoryUrl: string;
    parentCategoryId: string;
  }
  
  export default async function getRandomRecipe() {
    const APP_ID = process.env.RAKUTEN_APP_ID!;
    
    const catRes = await fetch(`https://app.rakuten.co.jp/services/api/Recipe/CategoryList/20170426?applicationId=${APP_ID}`);
    const catJson = await catRes.json();
    
    // カテゴリが取得できているか確認
    console.log("カテゴリレスポンス:", JSON.stringify(catJson, null, 2));
    
    if (!catJson.result || !catJson.result.small || catJson.result.small.length === 0) {
      throw new Error("カテゴリ取得失敗");
    }
    
    // categoriesの型を明示的に指定
    const categories: Category[] = catJson.result.small;
    
    // 有効なカテゴリのみを抽出
    const validCategories = categories.filter(category => category.categoryId > 0);
    
    if (validCategories.length === 0) {
      throw new Error("有効なカテゴリIDがありません");
    }
  
    const randomCat = validCategories[Math.floor(Math.random() * validCategories.length)];
    
    const rankingRes = await fetch(
      `https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?applicationId=${APP_ID}&categoryId=${randomCat.categoryId}`
    );
    const rankingJson = await rankingRes.json();
    
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
  