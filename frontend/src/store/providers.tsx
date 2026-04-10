"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./index";
import type { WrapperProps } from "@/types/components";

export function StoreProvider({ children }: WrapperProps) {
  const [store] = useState(makeStore);

  return <Provider store={store}>{children}</Provider>;
}
