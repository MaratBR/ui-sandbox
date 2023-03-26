import moment, { Moment, MomentInput } from "moment";
import { CSSProperties, useMemo, useRef } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useSchedulerContext } from "../context";
import { GridCanvasCells, GridCanvasCellsProps } from "../GridCanvasCells";
import styles from "./css.module.css";
import { useAutoScrollToNow } from "./utils";

export type GridCanvasProps<T> = GridCanvasCellsProps<T>;

export default function GridCanvas<T>({ ...props }: GridCanvasProps<T>) {
  const { interval, dimensions, grouping } = useSchedulerContext();

  const handleHandlers = useAutoScrollToNow(
    true,
    interval,
    dimensions.pixelsPerMinuteRatio
  );

  return (
    <section
      style={
        {
          "--row-count": Math.max(grouping.groups.length, 1),
        } as CSSProperties
      }
      className={styles.gridOuter}
    >
      <Scrollbars ref={handleHandlers}>
        <div className={styles.gridInner}>
          <InnerGrid />
          <GridCanvasCells<T> {...props} />
        </div>
      </Scrollbars>
    </section>
  );
}

function InnerGrid() {
  const { dimensions, grouping, interval } = useSchedulerContext();
  const { rowHeight, stepWidth, stepLengthInMinutes, pixelsPerMinuteRatio } =
    dimensions;
  const rowsCount = Math.max(grouping.groups.length, 1);
  const totalDuration = moment(interval.to).diff(interval.from, "s") / 60;
  const tableWidth =
    Math.ceil(totalDuration / dimensions.stepLengthInMinutes) + 1;

  const rows = useMemo(() => {
    const rows = Array.from({ length: rowsCount }).map((_, idx) => {
      const cells: React.ReactNode[] = [];

      for (let i = 0; i < tableWidth; i++) {
        cells.push(<td key={i}></td>);
      }

      return <tr key={idx}>{cells}</tr>;
    });

    return rows;
  }, [rowsCount, tableWidth]);

  return (
    <table
      style={
        {
          "--relative-offset": calculateOffsetInCellSizes(
            interval.from,
            stepLengthInMinutes
          ),
          "--cell-width": `${stepWidth}px`,
          "--cell-height": `${rowHeight}px`,
        } as CSSProperties
      }
      className={styles.gridTable}
    >
      {rows}
    </table>
  );
}

function calculateOffsetInCellSizes(
  from: MomentInput,
  stepLengthInMinutes: number // 30 by default
) {
  const fromMoment = moment(from);
  const minutes = fromMoment.hour() * 60 + fromMoment.minute();
  const mod = minutes % stepLengthInMinutes;
  return -mod / stepLengthInMinutes - 1;
}
