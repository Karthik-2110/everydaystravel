export type Staff = {
  uid: string;
  email: string;
  name: string;
  admin: boolean;
};
export class AccessError extends Error {
  constructor(
    message: string,
    public status = 401,
  ) {
    super(message);
  }
}
export function integrationAdmin(email: string) {
  return (process.env.CRM_INTEGRATION_ADMINS || "")
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.toLowerCase());
}
export function staffFromClaims(claims: {
  uid?: string;
  email?: string;
  name?: string;
  email_verified?: boolean;
  firebase?: { sign_in_provider?: string };
}): Staff {
  if (
    !claims.uid ||
    !claims.email ||
    claims.email_verified !== true ||
    claims.firebase?.sign_in_provider !== "google.com"
  )
    throw new AccessError("Sign in with a verified Google account");
  return {
    uid: claims.uid,
    email: claims.email,
    name: claims.name || claims.email,
    admin: integrationAdmin(claims.email),
  };
}
export function crmOrigin() {
  const raw =
    process.env.CRM_ORIGIN ||
    (process.env.NODE_ENV !== "production" ? "http://localhost:3000" : "");
  if (!raw)
    throw new AccessError("CRM hosting configuration is incomplete", 503);
  const url = new URL(raw);
  if (
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash ||
    (process.env.NODE_ENV === "production" && url.protocol !== "https:")
  )
    throw new AccessError("Invalid CRM origin configuration", 503);
  return url.origin;
}
export function assertOrigin(request: Request, callback = false) {
  const origin = crmOrigin();
  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== origin)
    throw new AccessError("Invalid CRM host", 403);
  if (!callback && !["GET", "HEAD"].includes(request.method)) {
    if (
      request.headers.get("origin") !== origin ||
      !["same-origin", "none", null].includes(
        request.headers.get("sec-fetch-site"),
      )
    )
      throw new AccessError("Cross-site CRM requests are not allowed", 403);
  }
  return new URL(requestUrl.pathname + requestUrl.search, origin);
}
