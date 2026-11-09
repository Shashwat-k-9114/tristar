import "server-only";
import { sendMail } from "./mail";
import { getSettings } from "./settings";
import { adminEmail, customerEmail, type NotifyData } from "./email/templates";

/**
 * Sends the guest confirmation (if they gave an address) and the staff notification.
 * Never throws: a failed email must not affect the saved booking. Failures are logged.
 */
export async function notifySubmission(d: NotifyData): Promise<void> {
  let settings;
  try {
    settings = await getSettings();
  } catch (e) {
    console.error("[notify] could not read settings:", e instanceof Error ? e.message : e);
    return;
  }

  const jobs: Promise<unknown>[] = [];

  if (d.email && settings.customerConfirmations) {
    const m = customerEmail(d);
    jobs.push(sendMail({ to: d.email, ...m }).catch((e) => console.error(`[notify] guest email failed (${d.ref}):`, e instanceof Error ? e.message : e)));
  }

  if (settings.notify[d.kind] && settings.adminEmails.length) {
    const m = adminEmail(d);
    jobs.push(
      sendMail({ to: settings.adminEmails, ...m, replyTo: d.email || undefined }).catch((e) =>
        console.error(`[notify] staff email failed (${d.ref}):`, e instanceof Error ? e.message : e),
      ),
    );
  }

  await Promise.all(jobs);
}
