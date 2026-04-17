export function scrollContainerToBottom(container: HTMLElement): void {
  container.scrollTo({
    top: container.scrollHeight,
    behavior: "smooth",
  });
}
