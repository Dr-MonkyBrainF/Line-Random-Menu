interface Category {
    categoryId: number;
    categoryName: string;
    categoryUrl: string;
    parentCategoryId: string;
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
  
    // 有効なカテゴリIDだけを抽出
    const categories: Category[] = catJson.result.small;
    const validCategories = categories.filter(category => category.categoryId > 0);
  
    // 無効なカテゴリIDが選ばれないように事前に選ぶ
    let randomCat: Category | null = null;
    for (let i = 0; i < validCategories.length; i++) {
      const cat = validCategories[Math.floor(Math.random() * validCategories.length)];
  
      // 無効なカテゴリIDが選ばれている場合はスキップ
      try {
        const rankingRes = await fetch(
          `https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?applicationId=${APP_ID}&categoryId=${cat.categoryId}`
        );
        const rankingJson = await rankingRes.json();
  
        if (rankingJson.result && rankingJson.result.length > 0) {
          randomCat = cat; // 有効なカテゴリが見つかった場合、選択
          break;
        }
      } catch {
        console.log(`カテゴリID ${cat.categoryId} でエラーが発生しました。スキップします。`);
      }
    }
  
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