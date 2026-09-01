export function normalizeUrl(url) {
  url = url.trim()
  try {
    return new URL(url).toString();
  }
  catch {
    try {
      return new URL(`https://${url}`).toString();
    }
    catch {
      return null;
    }
  }
}
