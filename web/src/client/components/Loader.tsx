import * as React from "react"
import classnames from "classnames"

import "loaders.css"

// @ts-ignore
import styles from "./../styles/loader.module"

export enum LoaderSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

export enum LoaderColor {
  Purple = "purple",
}

export enum LoaderType {
  BallBeat = "ball-beat",
  BallClipRotate = "ball-clip-rotate",
  BallClipRotateMultiple = "ball-clip-rotate-multiple",
  BallClipRotatePulse = "ball-clip-rotate-pulse",
  BallGridBeat = "ball-grid-beat",
  BallGridPulse = "ball-grid-pulse",
  BallPulse = "ball-pulse",
  BallPulseRise = "ball-pulse-rise",
  BallPulseSync = "ball-pulse-sync",
  BallRotate = "ball-rotate",
  BallScale = "ball-scale",
  BallScaleMultiple = "ball-scale-multiple",
  BallScaleRipple = "ball-scale-ripple",
  BallScaleRippleMultiple = "ball-scale-ripple-multiple",
  BallSpinFadeLoader = "ball-spin-fade-loader",
  BallTrianglePath = "ball-triangle-path",
  BallZigZag = "ball-zig-zag",
  BallZigZagDeflect = "ball-zig-zag-deflect",
  CubeTransition = "cube-transition",
  LineScale = "line-scale",
  LineScaleParty = "line-scale-party",
  LineScalePulseOut = "line-scale-pulse-out",
  LineScalePulseOutRapid = "line-scale-pulse-out-rapid",
  LineSpinFadeLoader = "line-spin-fade-loader",
  Pacman = "pacman",
  SemiCircleSpin = "semi-circle-spin",
  SquareSpin = "square-spin",
  TriangleSkewSpin = "triangle-skew-spin",
}

const DEPTH = {
  [LoaderType.BallPulse]: 3,
  [LoaderType.BallGridPulse]: 9,
  [LoaderType.BallClipRotate]: 1,
  [LoaderType.BallClipRotatePulse]: 2,
  [LoaderType.SquareSpin]: 1,
  [LoaderType.BallClipRotateMultiple]: 2,
  [LoaderType.BallPulseRise]: 5,
  [LoaderType.BallRotate]: 1,
  [LoaderType.CubeTransition]: 2,
  [LoaderType.BallZigZag]: 2,
  [LoaderType.BallZigZagDeflect]: 2,
  [LoaderType.BallTrianglePath]: 3,
  [LoaderType.BallScale]: 1,
  [LoaderType.LineScale]: 5,
  [LoaderType.LineScaleParty]: 4,
  [LoaderType.BallScaleMultiple]: 3,
  [LoaderType.BallPulseSync]: 3,
  [LoaderType.BallBeat]: 3,
  [LoaderType.LineScalePulseOut]: 5,
  [LoaderType.LineScalePulseOutRapid]: 5,
  [LoaderType.BallScaleRipple]: 1,
  [LoaderType.BallScaleRippleMultiple]: 3,
  [LoaderType.BallSpinFadeLoader]: 8,
  [LoaderType.LineSpinFadeLoader]: 8,
  [LoaderType.TriangleSkewSpin]: 1,
  [LoaderType.Pacman]: 5,
  [LoaderType.BallGridBeat]: 9,
  [LoaderType.SemiCircleSpin]: 1,
}

const range = (n: number) => {
  const arr = []
  let i: number = -1

  while (++i < n) {
    // @ts-ignore
    arr.push(i)
  }

  return arr
}

interface RandomLoaderProps {
  size: LoaderSize
  isActive: boolean
  className?: string
  color: LoaderColor
}

interface Props extends RandomLoaderProps {
  type: LoaderType
}

export const LoadingScreen: React.FC = (props) => (
  <div className={styles.screen} {...props}>
    <Loader
      size={LoaderSize.Large}
      color={LoaderColor.Purple}
      type={LoaderType.BallPulse}
      isActive={true}
    />
  </div>
)

export const RandomLoader: React.FC<RandomLoaderProps> = (props) => {
  const type = React.useMemo<LoaderType>(() => {
    const types = Object.values(LoaderType)
    return types[Math.floor(Math.random() * types.length)]
  }, [])

  return <Loader {...props} type={type} />
}

const Loader: React.FC<Props> = ({ isActive, className, size, type, color }) => {
  const renderDiv = (n) => <div className={styles[color]} key={n} />

  return (
    <div
      className={classnames(
        {
          loader: true,
          [`loader-${size}`]: size !== LoaderSize.Medium,
          "loader-active": isActive,
          "loader-hidden": !isActive,
        },
        className
      )}>
      <div className={classnames("loader-inner", type)}>{range(DEPTH[type]).map(renderDiv)}</div>
    </div>
  )
}

export default Loader
