/**
 * Translation utility — translates English Steam news to Chinese
 * via MyMemory (free, no API key, works from China).
 */

const MYMEMORY_API = "https://api.mymemory.translated.net/get";

interface MyMemoryResponse {
  responseData: { translatedText: string; match: number };
}

async function translateMyMemory(text: string): Promise<string | null> {
  try {
    const url = `${MYMEMORY_API}?q=${encodeURIComponent(text)}&langpair=en|zh`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const json: MyMemoryResponse = await res.json();
    return json.responseData?.translatedText || null;
  } catch {
    return null;
  }
}

export async function translateToChinese(text: string): Promise<string> {
  if (!text || text.length < 3) return text;
  const result = await translateMyMemory(text);
  return result ?? text;
}

/** Translate multiple texts in parallel with concurrency limit */
export async function batchTranslate(texts: string[], concurrency = 5): Promise<string[]> {
  const results: string[] = new Array(texts.length);
  const queue = texts.map((text, i) => ({ text, i }));

  async function worker() {
    while (queue.length > 0) {
      const item = queue.shift()!;
      results[item.i] = await translateToChinese(item.text);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return results;
}
