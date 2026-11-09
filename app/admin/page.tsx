import { isAdmin } from "@/lib/server/auth";
import { Dashboard } from "./Dashboard";
import { Login } from "./Login";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  return (await isAdmin()) ? <Dashboard /> : <Login />;
}
