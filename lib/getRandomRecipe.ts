interface Category {
    categoryId: number;
    categoryName: string;
    categoryUrl: string;
    parentCategoryId: string;
  }
  
  async function getValidCategoryId(categories: Category[]): Promise<Category> {
    // 有効なIDをランダムに選ぶ
    const validCategories = categories.filter(category => category.categoryId > 0);
    return validCategories[Math.floor(Math.random() * validCategories.length)];
  }
  
  export default async function getRandomRecipe() {
    const APP_ID = process.env.RAKUTEN_APP_ID!;
    
    try {
      const catRes = await fetch(`https://app.rakuten.co.jp/services/api/Recipe/CategoryList/20170426?applicationId=${APP_ID}`);
      const catJson = await catRes.json();
      
      if (!catJson.result || !catJson.result.small || catJson.result.small.length === 0) {
        throw new Error("カテゴリ取得失敗");
      }
    
      const categories: Category[] = catJson.result.small;
      const randomCat = await getValidCategoryId(categories);
    
      const rankingRes = await fetch(`https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?applicationId=${APP_ID}&categoryId=${randomCat.categoryId}`);
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
    } catch (error) {
      console.error("エラー:", error);
      throw error;  // エラーを再スローして呼び出し元で対応可能にする
    }
  }
  