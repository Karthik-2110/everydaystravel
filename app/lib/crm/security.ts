export function assertLocalRequest(request: Request, oauthCallback = false) {
  const url = new URL(request.url);
  const host = request.headers.get("host") || url.host;
  if (
    process.env.NODE_ENV === "production" ||
    !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) ||
    !/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host)
  ) {
    throw new Error(
      "This CRM workspace is available on localhost in development only.",
    );
  }
  if (!oauthCallback) {
    const origin = request.headers.get("origin");
    const site = request.headers.get("sec-fetch-site");
    if (
      (origin && origin !== url.origin) ||
      (site && !["same-origin", "none"].includes(site))
    )
      throw new Error("Cross-site CRM requests are not allowed");
  }
  return url;
}
