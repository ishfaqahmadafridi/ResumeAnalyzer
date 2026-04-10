const defaultPrompts = [
  "Tell me about a project where you improved a user-facing metric.",
  "What gaps in your current CV are you actively closing for this role?",
  "How would you explain your strongest technical decision to a hiring manager?",
];

export function getNextInterviewPrompt(messagesLength: number): string {
  return defaultPrompts[messagesLength % defaultPrompts.length];
}
