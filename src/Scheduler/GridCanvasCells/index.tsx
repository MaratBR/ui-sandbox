import moment, { MomentInput } from "moment";
import React from "react";
import { CSSProperties, Key, useMemo } from "react";
import { useSchedulerContext } from "../context";
import { encodeGroupKey, getGroupIndexVar } from "../utils";
import styles from "./css.module.css";

export type GridCell<T> = {
  groupKey: string;
  data: T;
  timestamp: moment.MomentInput;
};

export type GridCanvasCellsProps<T> = {
  cells: GridCell<T>[];
  getItemKey: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  children?: React.ReactNode;
};

export function GridCanvasCells<T>({
  cells,
  getItemKey,
  renderItem,
}: GridCanvasCellsProps<T>) {
  const { grouping } = useSchedulerContext();
  const groupsOrder = useMemo(
    () => grouping.groups.map((g) => g.key),
    [grouping.groups]
  );
  const groupsVariables = useMemo(() => {
    const variables: Record<string, string> = {};

    for (let i = 0; i < groupsOrder.length; i++) {
      variables[`--group-index-${encodeGroupKey(groupsOrder[i])}`] =
        i.toString();
    }

    return variables;
  }, [groupsOrder]);

  const {
    dimensions,
    interval: { from, to },
  } = useSchedulerContext();

  const cellsRendered = useMemo(
    () =>
      cells.map((cell) => (
        <Cell<T>
          key={getItemKey(cell.data)}
          renderItem={renderItem}
          cell={cell}
        />
      )),
    [cells, renderItem, getItemKey]
  );

  return (
    <div
      style={
        {
          "--seconds-to-pixels": "calc(var(--pixels-per-minute) / 60)",
          "--from-ts": Math.floor(+moment(from).toDate() / 1000).toString(),
          "--row-count": Math.max(groupsOrder.length, 1),
          ...groupsVariables,
        } as CSSProperties
      }
      className={styles.cellContainer}
    >
      {cellsRendered}
    </div>
  );
}

type CellProps<T> = {
  cell: GridCell<T>;
  renderItem: (item: T) => React.ReactNode;
};

function Cell<T>({ cell, renderItem }: CellProps<T>) {
  const inner = useMemo(() => renderItem(cell.data), [cell.data, renderItem]);
  const ts = Math.floor(+moment(cell.timestamp).toDate() / 1000);

  return (
    <div
      className={styles.cell}
      data-group-key={cell.groupKey}
      data-ts={ts}
      style={
        {
          "--ts": ts.toString(),
          "--group-index": `var(${getGroupIndexVar(cell.groupKey)})`,
        } as CSSProperties
      }
    >
      {inner}
    </div>
  );
}
