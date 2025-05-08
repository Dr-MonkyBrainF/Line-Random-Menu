## Line-Random-Menuとは
LINEと楽天レシピカテゴリーを組み合わせた『ちょっとうれしいサービス』です。

ラインを送るとランダムなメニューが届きます。

## 材料
・Next.js

・Vercel

・LINE Business ID(公式ライン)

　--Webhookの有効化とトークンの取得

・Rakuten Developers(内のRecipe Category List API)

　--Rakuten-App-IDを取得

## レールを敷く
・VercelでLINEのWebhookやRakutenAPIに必要なURLを作成

・APIを使えるようにトークンをVercel環境変数へ設定

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 課題
・レシピの取得と有効なIDの選択に時間がとられる。

=>LINEの返信が少し遅い

・複数のラインを一度に送られるとパンクする

=>APIの呼び出しとレシピ取得でタイムアウトやAPI上限に到達する

・たまに春巻きの皮などのメニューが返信されてくる

=>ランダムなのでご飯に不向きなデザートなどもでる
