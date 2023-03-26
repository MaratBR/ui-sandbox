import moment from "moment";
import { useCallback, useEffect, useMemo, useRef } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { SchedulerInterval } from "../context";

export function useAutoScrollToNow(
  enabled: boolean,
  interval: SchedulerInterval,
  pixelsPerMinuteRatio: number
): (scrollars: Scrollbars) => void {
  const scrollars = useRef<Scrollbars | null>(null);
  const deactivated = useRef(false);
  const day = moment(interval.from).format("YYYY-MM-dd");

  useEffect(() => {}, [enabled, interval]);

  const callback = useCallback(
    (s: Scrollbars | null) => {
      scrollars.current = s;
      if (!s) return;
      if (!enabled) return;
      if (deactivated.current) return;

      if (moment().isBetween(interval.from, interval.to)) {
        s.scrollLeft(
          (moment().diff(interval.from, "s") / 60) * pixelsPerMinuteRatio -
            s.getClientWidth() / 2
        );
      } else {
        s.scrollLeft(s.getScrollWidth() / 2 - s.getClientWidth() / 2);
      }

      deactivated.current = true;
    },
    [enabled, interval, pixelsPerMinuteRatio]
  );
  return callback;
}
