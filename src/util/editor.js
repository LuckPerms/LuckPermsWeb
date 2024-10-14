export function contextsToArray(context) {
  if (Array.isArray(context)) {
    return context || [];
  }

  if (context) {
    return [context];
  }

  return [];
}
