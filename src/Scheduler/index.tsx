import moment, { MomentInput } from "moment";
import { useMemo } from "react";
import {
  GroupsState,
  SchedulerContext,
  SchedulerContextData,
  SchedulerDimensions,
} from "./context";
import GridCanvas from "./GridCanvas";
import { GridCanvasCells, GridCell } from "./GridCanvasCells";
import SchedulerLayout from "./SchedulerLayout";

export type SchedulerProps<T, G> = {
  from: MomentInput;
  to: MomentInput;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  getItemKey: (item: T) => string;
  getItemTimestamp: (item: T) => MomentInput;

  rowHeight?: number;
  stepWidth?: number;
  stepLengthInMinutes?: number;
} & SchedulerGroupsProps<T, G>;

type SchedulerPropsWithGrouping<T, G> = {
  grouping: true;
  groups: G[];
  getGroupKey: (group: G) => string;
  getItemGroupKey: (item: T) => string;
};

type SchedulerGroupsProps<T, G> =
  | SchedulerPropsWithGrouping<T, G>
  | {
      grouping?: false;
    };

type ItemsData<T, G> = {
  cells: GridCell<T>[];
  groups: {
    data: G;
    key: string;
  }[];
};

export default function Scheduler<T, G = never>(props: SchedulerProps<T, G>) {
  const {
    from,
    to,
    items,
    renderItem,
    getItemKey,
    getItemTimestamp,
    rowHeight = 100,
    stepLengthInMinutes = 30,
    stepWidth = 120,
  } = props;

  const itemsData: ItemsData<T, G> = useMemo(() => {
    let cells: GridCell<T>[];
    let groups: ItemsData<T, G>["groups"] = [];
    if (props.grouping) {
      groups = props.groups.map((g) => ({
        data: g,
        key: props.getGroupKey(g),
      }));
      cells = items.map((item) => ({
        timestamp: getItemTimestamp(item),
        data: item,
        groupKey: props.getItemGroupKey(item),
      }));
    } else {
      cells = items.map((item) => ({
        timestamp: getItemTimestamp(item),
        data: item,
        groupKey: "0",
      }));
    }

    return {
      cells,
      groups,
    };
  }, [
    items,
    getItemTimestamp,
    props.grouping,
    (props as SchedulerPropsWithGrouping<T, G>).getGroupKey,
    (props as SchedulerPropsWithGrouping<T, G>).getItemGroupKey,
  ]);

  const groupingState: GroupsState = useMemo(() => {
    if (props.grouping) {
      return {
        groups: props.groups.map((g) => ({
          key: props.getGroupKey(g),
          data: g,
        })),
      };
    } else {
      return {
        groups: [],
      };
    }
  }, []);

  const schedulerContext: SchedulerContextData = useMemo(
    () => ({
      interval: { from, to },
      dimensions: {
        rowHeight,
        stepLengthInMinutes,
        stepWidth,
        pixelsPerMinuteRatio: stepWidth / stepLengthInMinutes,
      },
      grouping: groupingState,
    }),
    [from, to, groupingState, rowHeight, stepLengthInMinutes, stepWidth]
  );

  return (
    <SchedulerContext.Provider value={schedulerContext}>
      <SchedulerLayout<T, G>
        cells={itemsData.cells}
        getItemKey={getItemKey}
        renderItem={renderItem}
        showGroupSection
        showHeader
        sideWidth={200}
        headerHeight={50}
      />
    </SchedulerContext.Provider>
  );
}
