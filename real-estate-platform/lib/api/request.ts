const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const MAX_JSON_BODY_BYTES = 16_384;

export function isUuid(value: string): boolean {
  return UUID_REGEX.test(value);
}

export async function readJsonBody(
  request: Request,
  maxBytes = MAX_JSON_BODY_BYTES
): Promise<{ ok: true; body: unknown } | { ok: false; status: number; error: string }> {
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > maxBytes) {
    return { ok: false, status: 413, error: "Request body too large" };
  }

  const raw = await request.text();
  if (raw.length > maxBytes) {
    return { ok: false, status: 413, error: "Request body too large" };
  }

  if (!raw.trim()) {
    return { ok: false, status: 400, error: "Invalid JSON" };
  }

  try {
    return { ok: true, body: JSON.parse(raw) as unknown };
  } catch {
    return { ok: false, status: 400, error: "Invalid JSON" };
  }
}
