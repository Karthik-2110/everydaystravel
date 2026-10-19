import { cookies } from "next/headers";
import { staffAuth, hostedStorage } from "./firebase-admin";
import {
  AccessError,
  assertOrigin,
  staffFromClaims,
  type Staff,
} from "./auth-policy";
import { assertLocalRequest } from "./security";
export const SESSION_COOKIE = "crm-session";
export const SESSION_SECONDS = 8 * 60 * 60;
export async function currentStaff(): Promise<Staff | null> {
  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!cookie) return null;
  try {
    return staffFromClaims(await staffAuth().verifySessionCookie(cookie, true));
  } catch {
    return null;
  }
}
export async function authorize(
  request: Request,
  admin = false,
  callback = false,
) {
  if (!hostedStorage()) {
    const url = assertLocalRequest(request, callback);
    return {
      url,
      staff: {
        uid: "local",
        email: "local",
        name: "Local development",
        admin: true,
      } as Staff,
    };
  }
  const url = assertOrigin(request, callback);
  const staff = await currentStaff();
  if (!staff) throw new AccessError("Your session expired. Sign in again.");
  if (admin && !staff.admin)
    throw new AccessError(
      "Only an integration administrator can change the shared Google connection",
      403,
    );
  return { url, staff };
}
