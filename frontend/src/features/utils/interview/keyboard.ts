type EnterSubmitEvent = {
  key: string;
  shiftKey: boolean;
  preventDefault: () => void;
  nativeEvent?: {
    isComposing?: boolean;
  };
};

export function shouldSubmitOnEnter(event: EnterSubmitEvent): boolean {
  return event.key === "Enter" && !event.shiftKey && !event.nativeEvent?.isComposing;
}

export function applyEnterSubmitShortcut(event: EnterSubmitEvent, onSubmit: () => void): void {
  if (!shouldSubmitOnEnter(event)) {
    return;
  }
  event.preventDefault();
  onSubmit();
}
