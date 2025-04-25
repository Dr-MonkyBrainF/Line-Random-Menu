interface Category {
    categoryId: number;
    categoryName: string;
    categoryUrl: string;
    parentCategoryId: string;
  }
  
  async function getValidCategoryId(categories: Category[]) {
    const validCategories = categories.filter(category => category.categoryId > 0);
  
    // 並列でAPIリクエストを送る
    const requests = validCategories.map(async (category) => {
      try {
        const rankingRes = await fetch(
          `https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?applicationId=${process.env.RAKUTEN_APP_ID}&categoryId=${category.categoryId}`
        );
        const rankingJson = await rankingRes.json();
  
        if (rankingJson.result && rankingJson.result.length > 0) {
          return category; // 有効なカテゴリを返す
        }
      } catch {
        console.log(`カテゴリID ${category.categoryId} でエラーが発生しました。`);
      }
      return null; // 無効なカテゴリ
    });
  
    // すべてのリクエストを並列で処理
    const results = await Promise.all(requests);
  
    // 有効なカテゴリを選ぶ
    const validCategory = results.find((category) => category !== null);
    return validCategory;
  }
  
  export default async function getRandomRecipe() {
    const APP_ID = process.env.RAKUTEN_APP_ID!;
  
    // カテゴリ一覧を取得
    const catRes = await fetch(`https://app.rakuten.co.jp/services/api/Recipe/CategoryList/20170426?applicationId=${APP_ID}`);
    const catJson = await catRes.json();
  
    // カテゴリが取得できているか確認
    console.log("カテゴリレスポンス:", JSON.stringify(catJson, null, 2));
  
    if (!catJson.result || !catJson.result.small || catJson.result.small.length === 0) {
      throw new Error("カテゴリ取得失敗");
    }
  
    const categories: Category[] = catJson.result.small;
    
    // 有効なカテゴリIDを並列で確認
    const randomCat = await getValidCategoryId(categories);
    
    if (!randomCat) {
      throw new Error("有効なカテゴリIDが見つかりませんでした");
    }
  
    // 有効なカテゴリが見つかった場合、レシピを取得
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
  