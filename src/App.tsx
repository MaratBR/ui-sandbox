import moment from "moment";
import { useState } from "react";
import Scheduler from "./Scheduler";
import { GridCanvasCells } from "./Scheduler/GridCanvasCells";

type Item = {
  ts: moment.MomentInput;
  text: string;
  group: string;
};

const items: Item[] = [
  {
    ts: Date.now(),
    text: "now",
    group: "group 1",
  },
  {
    ts: moment().add(1, "h"),
    text: "in an hour",
    group: "group 2",
  },
];

for (let i = 0; i < 24; i++) {
  const t = moment().hour(i).minute(0).second(0).millisecond(0);
  const t2 = t.clone().add(30, "m");

  items.push(
    {
      ts: t,
      text: t.format("HH:mm"),
      group: "range",
    },
    {
      ts: t2,
      text: t2.format("HH:mm"),
      group: "range",
    }
  );
}

function App() {
  return (
    <div>
      <Scheduler<Item, string>
        grouping
        getGroupKey={(g) => g}
        getItemGroupKey={(item) => item.group}
        groups={["group 1", "group 2", "range"]}
        items={items}
        getItemKey={(item) => item.text}
        getItemTimestamp={(x) => x.ts}
        renderItem={(item) => (
          <span
            style={{ display: "inline-block", borderLeft: "2px solid red" }}
          >
            {item.text}
          </span>
        )}
        from={moment().hour(12).minute(5).second(0).millisecond(0)}
        to={moment().hour(20).minute(45).second(0).millisecond(0)}
      />
    </div>
  );
}

export default App;
