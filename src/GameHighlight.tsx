import {
  AbsoluteFill,
  Img,
  AnimatedImage,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
  Sequence,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/NotoSansJP";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "900"],
  subsets: ["latin", "japanese"],
});

type GameInfo = {
  title: string;
  genre: string;
  description: string;
  image: string;
  isGif: boolean;
};

const GAMES: GameInfo[] = [
  {
    title: "Merge Rogue",
    genre: "Roguelike",
    description: "マージメカニクスを組み合わせたローグライク。1,100+コミットの集大成。",
    image: "games/merge-rogue.png",
    isGif: false,
  },
  {
    title: "Void Red",
    genre: "Action",
    description: "Steam展開を見据えた本格アクションゲーム。C++ネイティブ連携。",
    image: "games/void-red.png",
    isGif: false,
  },
  {
    title: "Touchstone",
    genre: "2D Roguelike",
    description: "開発中の2Dローグライク。ピクセルアートとシェーダーが融合。",
    image: "games/touchstone.gif",
    isGif: true,
  },
  {
    title: "Sumo Survivors",
    genre: "3D Survivors-like",
    description: "物理演算ベースの3Dヴァンサバ系。力士 × サバイバー。",
    image: "games/sumo-survivors.gif",
    isGif: true,
  },
  {
    title: "Arenani",
    genre: "ADV",
    description:
      "unity1weekチーム作品。MVP + VContainer + R3の高度なアーキテクチャ。",
    image: "games/arenani.png",
    isGif: false,
  },
  {
    title: "Okuribon",
    genre: "Turn-based Battle",
    description: "ターン制コマンドバトル「おくりぼん」。unity1week参加作品。",
    image: "games/okuribon.gif",
    isGif: true,
  },
  {
    title: "Calm Fishing",
    genre: "Idle Game",
    description: "ピクセルアートの放置系フィッシングゲーム。unity1week参加作品。",
    image: "games/calm-fishing.png",
    isGif: false,
  },
  {
    title: "Maouchan",
    genre: "Clicker",
    description:
      "魔王ちゃんのクリッカーゲーム。クローン増殖で世界征服を目指す！",
    image: "games/maouchan.gif",
    isGif: true,
  },
];

const SCENE_DURATION_SEC = 4;
const TRANSITION_DURATION_SEC = 0.5;

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const subtitleOpacity = interpolate(
    frame,
    [1.2 * fps, 2 * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const lineWidth = interpolate(
    frame,
    [0.8 * fps, 1.5 * fps],
    [0, 600],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    },
  );

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
      }}
    >
      <div
        style={{
          transform: `translateY(${interpolate(titleProgress, [0, 1], [60, 0])}px)`,
          opacity: titleProgress,
          fontSize: 72,
          fontWeight: 900,
          color: "#ffffff",
          textAlign: "center",
          letterSpacing: 4,
        }}
      >
        void2610
      </div>
      <div
        style={{
          width: lineWidth,
          height: 3,
          background:
            "linear-gradient(90deg, transparent, #6366f1, transparent)",
          marginTop: 20,
          marginBottom: 20,
        }}
      />
      <div
        style={{
          opacity: subtitleOpacity,
          fontSize: 28,
          color: "#a5b4fc",
          textAlign: "center",
          fontWeight: 400,
          letterSpacing: 6,
        }}
      >
        GAME HIGHLIGHTS
      </div>
    </AbsoluteFill>
  );
};

const GameScene: React.FC<{ game: GameInfo }> = ({ game }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const imageEntrance = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const imageScale = interpolate(imageEntrance, [0, 1], [1.1, 1]);
  const imageOpacity = interpolate(imageEntrance, [0, 1], [0, 1]);

  const textEntrance = spring({
    frame: frame - Math.round(0.3 * fps),
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const textX = interpolate(textEntrance, [0, 1], [80, 0]);
  const textOpacity = interpolate(textEntrance, [0, 1], [0, 1]);

  const genreEntrance = spring({
    frame: frame - Math.round(0.5 * fps),
    fps,
    config: { damping: 200 },
  });

  const descEntrance = spring({
    frame: frame - Math.round(0.7 * fps),
    fps,
    config: { damping: 200 },
  });

  const imageAreaWidth = width * 0.55;
  const imageAreaHeight = height;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)",
        fontFamily,
      }}
    >
      {/* Game image - left side */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: imageAreaWidth,
          height: imageAreaHeight,
          overflow: "hidden",
          opacity: imageOpacity,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: `scale(${imageScale})`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {game.isGif ? (
            <AnimatedImage
              src={staticFile(game.image)}
              width={imageAreaWidth}
              height={imageAreaHeight}
              fit="cover"
            />
          ) : (
            <Img
              src={staticFile(game.image)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}
        </div>
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "40%",
            height: "100%",
            background:
              "linear-gradient(to left, #0f0f23 0%, transparent 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "30%",
            background:
              "linear-gradient(to top, #0f0f23 0%, transparent 100%)",
          }}
        />
      </div>

      {/* Text - right side */}
      <div
        style={{
          position: "absolute",
          right: 60,
          top: 0,
          width: width * 0.4,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: `translateX(${textX}px)`,
            opacity: textOpacity,
            fontSize: 52,
            fontWeight: 900,
            color: "#ffffff",
            marginBottom: 16,
            lineHeight: 1.2,
          }}
        >
          {game.title}
        </div>
        <div
          style={{
            opacity: genreEntrance,
            transform: `translateX(${interpolate(genreEntrance, [0, 1], [40, 0])}px)`,
            fontSize: 20,
            fontWeight: 700,
            color: "#818cf8",
            textTransform: "uppercase",
            letterSpacing: 4,
            marginBottom: 24,
          }}
        >
          {game.genre}
        </div>
        <div
          style={{
            width: interpolate(genreEntrance, [0, 1], [0, 200]),
            height: 2,
            background: "#6366f1",
            marginBottom: 24,
          }}
        />
        <div
          style={{
            opacity: descEntrance,
            transform: `translateY(${interpolate(descEntrance, [0, 1], [20, 0])}px)`,
            fontSize: 22,
            fontWeight: 400,
            color: "#c7d2fe",
            lineHeight: 1.8,
          }}
        >
          {game.description}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const thanksProgress = spring({
    frame,
    fps,
    config: { damping: 12 },
  });

  const statsOpacity = interpolate(
    frame,
    [0.8 * fps, 1.5 * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const linkOpacity = interpolate(
    frame,
    [1.5 * fps, 2.2 * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
      }}
    >
      <div
        style={{
          transform: `scale(${interpolate(thanksProgress, [0, 1], [0.8, 1])})`,
          opacity: thanksProgress,
          fontSize: 48,
          fontWeight: 900,
          color: "#ffffff",
          textAlign: "center",
          marginBottom: 30,
        }}
      >
        Thanks for Watching!
      </div>
      <div
        style={{
          opacity: statsOpacity,
          fontSize: 22,
          color: "#a5b4fc",
          textAlign: "center",
          marginBottom: 40,
          lineHeight: 1.8,
        }}
      >
        Unity / C# / React / TypeScript
        <br />
        20+ Game Projects
      </div>
      <div
        style={{
          opacity: linkOpacity,
          fontSize: 26,
          fontWeight: 700,
          color: "#818cf8",
          textAlign: "center",
          letterSpacing: 2,
        }}
      >
        github.com/void2610
      </div>
    </AbsoluteFill>
  );
};

export const GameHighlight: React.FC = () => {
  const { fps } = useVideoConfig();

  const sceneDuration = Math.round(SCENE_DURATION_SEC * fps);
  const introDuration = Math.round(3.5 * fps);
  const outroDuration = Math.round(3.5 * fps);

  const currentFrom = introDuration;

  return (
    <AbsoluteFill>
      {/* Intro */}
      <Sequence durationInFrames={introDuration} premountFor={fps}>
        <IntroScene />
      </Sequence>

      {/* Game scenes */}
      {GAMES.map((game, i) => {
        const from = currentFrom + i * sceneDuration;
        return (
          <Sequence
            key={game.title}
            from={from}
            durationInFrames={sceneDuration}
            premountFor={Math.round(TRANSITION_DURATION_SEC * fps)}
          >
            <GameScene game={game} />
          </Sequence>
        );
      })}

      {/* Outro */}
      <Sequence
        from={currentFrom + GAMES.length * sceneDuration}
        durationInFrames={outroDuration}
        premountFor={Math.round(TRANSITION_DURATION_SEC * fps)}
      >
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
