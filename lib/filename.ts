export function safeName(input: string) {
  return input.replace(/[^a-z0-9_-]/gi, '_');
}
