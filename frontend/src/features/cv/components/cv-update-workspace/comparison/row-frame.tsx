import type { ReactNode } from "react";
import { StatusPill } from "./status-pill";

type RowFrameProps = {
  title: string;
  changed: boolean;
  left?: ReactNode;
  right?: ReactNode;
  full?: ReactNode;
};

export function RowFrame({ title, changed, left, right, full }: RowFrameProps) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-3">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-wide text-stone-700">{title}</p>
        <StatusPill changed={changed} />
      </div>
      {full ? (
        full
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">{left}</div>
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">{right}</div>
        </div>
      )}
    </div>
  );
}
