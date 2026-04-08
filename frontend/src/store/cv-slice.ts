"use client";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CVRecord, CVRoleAnalysis } from "@/types";

type CVState = {
  items: CVRecord[];
  selectedCvId: string | null;
  selectedRole: string | null;
  latestRoleAnalysis: CVRoleAnalysis | null;
};

const initialState: CVState = {
  items: [],
  selectedCvId: null,
  selectedRole: null,
  latestRoleAnalysis: null,
};

const cvSlice = createSlice({
  name: "cv",
  initialState,
  reducers: {
    setCVs(state, action: PayloadAction<CVRecord[]>) {
      state.items = action.payload;
      if (!state.selectedCvId && action.payload[0]) {
        state.selectedCvId = action.payload[0].id;
      }
    },
    upsertCV(state, action: PayloadAction<CVRecord>) {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        state.items[index] = action.payload;
      } else {
        state.items.unshift(action.payload);
      }
      state.selectedCvId = action.payload.id;
    },
    selectCv(state, action: PayloadAction<string>) {
      state.selectedCvId = action.payload;
    },
    selectRole(state, action: PayloadAction<string | null>) {
      state.selectedRole = action.payload;
    },
    setRoleAnalysis(state, action: PayloadAction<CVRoleAnalysis | null>) {
      state.latestRoleAnalysis = action.payload;
    },
  },
});

export const { setCVs, upsertCV, selectCv, selectRole, setRoleAnalysis } = cvSlice.actions;
export const cvReducer = cvSlice.reducer;
