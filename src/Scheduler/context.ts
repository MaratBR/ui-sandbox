import { MomentInput } from "moment";
import { createContext, useContext } from "react";

export type SchedulerContextData = {
  interval: SchedulerInterval;
  grouping: GroupsState;
  dimensions: SchedulerDimensions;
};

export type SchedulerInterval = {
  from: MomentInput;
  to: MomentInput;
};

export type GroupsState = {
  groups: GroupDefinition[];
};

type GroupDefinition = {
  key: string;
  data: any;
};

export type SchedulerDimensions = {
  rowHeight: number;
  pixelsPerMinuteRatio: number;
  stepWidth: number;
  stepLengthInMinutes: number;
};

export const SchedulerContext = createContext<SchedulerContextData | null>(
  null
);

export function useSchedulerContext(): SchedulerContextData {
  const data = useContext(SchedulerContext);
  if (data === null)
    throw new Error("cannot use useSchedulerContext hook outside of scheduler");
  return data;
}
