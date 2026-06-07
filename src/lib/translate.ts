/** In-memory cache so each unique summary is translated at most once per session. */
const cache = new Map<string, string>()

interface MyMemoryResponse {
  responseStatus: number
  responseData: { translatedText: string }
}

/**
 * Translates English text to Thai via the free, no-key MyMemory API.
 * Falls back to the original English text on any failure.
 */
export async function translateToThai(text: string): Promise<string> {
  const source = text.trim()
  if (!source) return ''

  const cached = cache.get(source)
  if (cached) return cached

  try {
    const url =
      'https://api.mymemory.translated.net/get?' +
      new URLSearchParams({ q: source, langpair: 'en|th' }).toString()

    const res = await fetch(url)
    if (!res.ok) return source

    const json = (await res.json()) as MyMemoryResponse
    const translated = json?.responseData?.translatedText?.trim()
    if (json.responseStatus === 200 && translated) {
      cache.set(source, translated)
      return translated
    }
    return source
  } catch {
    return source
  }
}
