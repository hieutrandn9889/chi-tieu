// Results render below the lookup form, which is off screen on a phone, so a
// finished lookup would look like nothing happened. Close the on-screen
// keyboard, scroll the results to the top and move focus there so a screen
// reader starts reading them.
export function revealResults(target: HTMLElement, input: HTMLElement | null) {
  input?.blur();
  // No behavior given: the page's CSS scrolls smoothly, or jumps when the
  // reader prefers reduced motion. scroll-margin-top keeps the sticky header
  // off the results.
  target.scrollIntoView({ block: "start" });
  // The scroll above already places the results; focusing must not jump again.
  target.focus({ preventScroll: true });
}
