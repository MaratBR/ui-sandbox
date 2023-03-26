import moment from "moment";
import { CSSProperties } from "react";
import { useSchedulerContext } from "../context";
import GridCanvas, { GridCanvasProps } from "../GridCanvas";
import { GridCanvasCells } from "../GridCanvasCells";
import styles from "./css.module.css";

export type SchedulerLayoutProps<T, G> = GridCanvasProps<T> & {
  headerHeight: number;
  sideWidth: number;
  showHeader: boolean;
  showGroupSection: boolean;
};

export default function SchedulerLayout<T, G>({
  showHeader,
  showGroupSection,
  sideWidth,
  headerHeight,
  ...props
}: SchedulerLayoutProps<T, G>) {
  const { dimensions, interval } = useSchedulerContext();

  return (
    <div
      style={
        {
          "--header-height": `${headerHeight}px`,
          "--side-width": `${sideWidth}px`,
          "--total-duration": moment(interval.to).diff(interval.from, "s") / 60,
          "--pixels-per-minute": `${dimensions.pixelsPerMinuteRatio}px`,
          "--row-height": `${dimensions.rowHeight}px`,
          "--step-width": `${dimensions.stepWidth}px`,
        } as CSSProperties
      }
      className={styles.layout}
    >
      <div className={styles.header}>Header</div>
      <div className={styles.sideSection}>
        <div className={styles.title}>Side bar</div>
        <div className={styles.groups}>Groups here</div>
      </div>
      <div className={styles.body}>
        <GridCanvas<T> {...props} />
      </div>
    </div>
  );
}
