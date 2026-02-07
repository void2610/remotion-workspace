# Remotion Video Project

Remotionを使用した動画制作プロジェクト。

## Project Structure

```
src/
  index.ts          - エントリーポイント (registerRoot)
  Root.tsx           - コンポジション定義 (<Composition>)
  Composition.tsx    - 動画コンポーネント
remotion.config.ts   - Remotion CLI設定
```

## Commands

- `npm run dev` - Remotion Studioを起動 (プレビュー)
- `npm run build` - 動画をバンドル
- `npm run lint` - ESLint + TypeScript型チェック
- `npx remotion render src/index.ts <CompositionId> out/video.mp4` - 動画をレンダリング

## Remotion Rules

### Animation

- アニメーションは必ず `useCurrentFrame()` と `interpolate()` で駆動する
- CSSの `transition` / `animation` や Tailwind のアニメーションクラスは**使用禁止** (レンダリングが正しく行われない)
- 時間指定は秒単位で記述し、`useVideoConfig()` の `fps` を掛けてフレームに変換する

### Composition

- `<Composition>` は `src/Root.tsx` に定義する
- propsの型定義には `interface` ではなく `type` を使う (defaultPropsの型安全性のため)
- 新しい動画を追加する場合はコンポーネントファイルを `src/` に作成し、`Root.tsx` に `<Composition>` を追加する

### Best Practices

- 動画・音声・画像などのアセットは `public/` に配置し `staticFile()` で参照する
- スキルファイル `.claude/skills/remotion-best-practices` にRemotionの詳細なベストプラクティスがある。フォント、音声、字幕、トランジション、3D、チャートなど具体的なトピックの実装時に該当ルールファイルを参照すること
