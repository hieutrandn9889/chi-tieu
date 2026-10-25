// Hands a sequence from the home page's quick lookup to the full report page.
// It lives only in this module's memory — never in the URL, history state or
// storage — so a reload or a new tab starts empty, as the privacy note promises.
let pending: string | null = null;

export function handOffSequence(value: string) {
  pending = value;
}

export function takeHandedOffSequence() {
  const value = pending;
  pending = null;
  return value;
}
