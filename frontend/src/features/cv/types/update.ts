export type CVSectionKey =
  | "about"
  | "skills"
  | "experience"
  | "education"
  | "projects"
  | "certifications"
  | "languages"
  | "contact"
  | "custom";

export type CVSection = {
  id: string;
  key: CVSectionKey;
  title: string;
  items: string[];
};

export type CVEditorData = {
  name: string;
  sections: CVSection[];
};

export type SectionDiff = {
  id: string;
  previousTitle: string;
  updatedTitle: string;
  previousItems: string[];
  updatedItems: string[];
  changed: boolean;
};

export type CVDiff = {
  nameChanged: boolean;
  sections: SectionDiff[];
};

export type AIImproveStatus = "idle" | "pending" | "done" | "failed";

export type UseCVUpdateResult = {
  loading: boolean;
  saving: boolean;
  aiStatus: AIImproveStatus;
  activeCvName: string;
  data: CVEditorData;
  baseline: CVEditorData;
  diff: CVDiff;
  showCompare: boolean;
  suggestionHints: Record<string, string[]>;
  setShowCompare: (value: boolean) => void;
  updateName: (value: string) => void;
  addSection: () => void;
  removeSection: (id: string) => void;
  updateSectionTitle: (id: string, value: string) => void;
  setSectionItems: (id: string, items: string[]) => void;
  addSectionItems: (id: string, value: string) => void;
  removeSectionItem: (id: string, itemIndex: number) => void;
  improveWithAI: () => Promise<void>;
  saveUpdatedCV: () => Promise<void>;
  downloadPdf: () => void;
};
