import * as React from "react";
import LottiePlayer from "react-lottie-player";
import { parseUnit } from "./parseUnit";
import animationData from "./animationData.json";
import type { AnimationSegment } from "lottie-web";
import { setup, styled } from "goober";

setup(React.createElement);

// Allows accessing DarkModeToggleProps type via DarkModeToggle.Props
export declare namespace DarkModeToggle {
  export type Props = {
    /** Whether or not the toggle is currently in dark-mode */
    readonly isDarkMode: boolean;

    /** Use this to update the state that controls the `isDarkMode` prop */
    readonly onChange: (isDarkMode: boolean) => void;

    /** Size of the component. Numbers = pixels. Strings = "<number><unit>" e.g. "20px" or "1.5%" (default = "85px"); */
    readonly size?: number | string;

    /** Use this to control the speed at which the toggle animation occurs (default = 2.5) */
    readonly speed?: number;

    /** Optional className prop for the <button/> element (default = "") */
    readonly className?: string;
  };
}

const Button = styled("button")<{ sizeValue: number; sizeUnit: string }>`
  cursor: pointer;
  overflow: hidden;
  appearance: none;
  border: none;
  background-color: transparent;
  padding: 0;
  width: ${({ sizeValue, sizeUnit }) => `${sizeValue}${sizeUnit}`};
  height: ${({ sizeValue, sizeUnit }) => `${sizeValue * 0.5}${sizeUnit}`};
`;

const StyledLottiePlayer = styled(LottiePlayer)<{
  isLottieReady: boolean;
  sizeValue: number;
  sizeUnit: string;
  animationData: object;
}>`
  display: ${({ isLottieReady }) => (isLottieReady ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  margin-top: ${({ sizeValue, sizeUnit }) =>
    `${sizeValue * -0.575}${sizeUnit}`};
  margin-left: ${({ sizeValue, sizeUnit }) =>
    `${sizeValue * -0.32}${sizeUnit}`};
  width: ${({ sizeValue, sizeUnit }) => `${sizeValue * 1.65}${sizeUnit}`};
  height: ${({ sizeValue, sizeUnit }) => `${sizeValue * 1.65}${sizeUnit}`};
`;

const arePropsEqual = (
  prevProps: DarkModeToggle.Props,
  nextProps: DarkModeToggle.Props
) =>
  prevProps.size === nextProps.size &&
  prevProps.isDarkMode === nextProps.isDarkMode &&
  prevProps.speed === nextProps.speed &&
  prevProps.className === nextProps.className;

export const DarkModeToggle = React.memo<DarkModeToggle.Props>(
  ({ isDarkMode, onChange, size = 85, speed = 1.3, className = "" }) => {
    const [sizeValue, sizeUnit] = parseUnit(size);
    const [isLottieReady, setLottieReady] = React.useState(false); // Hide the toggle until Lottie is ready
    const [isReadyToAnimate, setReadyToAnimate] = React.useState(false); // Disable animation of toggle until first click

    const segmentToGoTo: number = isDarkMode ? 51 : 2;
    const segmentsToPlay: AnimationSegment = isDarkMode ? [2, 50] : [51, 96];

    return (
      <Button
        onClick={() => {
          if (!isReadyToAnimate) setReadyToAnimate(true);
          onChange(!isDarkMode);
        }}
        sizeValue={sizeValue}
        sizeUnit={sizeUnit}
        aria-hidden="true"
        className={className}
      >
        <StyledLottiePlayer
          isLottieReady={isLottieReady}
          sizeValue={sizeValue}
          sizeUnit={sizeUnit}
          play={isReadyToAnimate}
          speed={speed}
          loop={false}
          segments={segmentsToPlay}
          goTo={segmentToGoTo}
          animationData={animationData}
          onEnterFrame={() => setLottieReady(true)}
        />
      </Button>
    );
  },
  arePropsEqual
);

DarkModeToggle.displayName = "DarkModeToggle";
