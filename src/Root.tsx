import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { GameHighlight } from "./GameHighlight";

const FPS = 30;
const SCENE_DURATION_SEC = 4;
const INTRO_DURATION_SEC = 3.5;
const OUTRO_DURATION_SEC = 3.5;
const GAME_COUNT = 8;

const totalDuration = Math.round(
  (INTRO_DURATION_SEC + GAME_COUNT * SCENE_DURATION_SEC + OUTRO_DURATION_SEC) *
    FPS,
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="GameHighlight"
        component={GameHighlight}
        durationInFrames={totalDuration}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
