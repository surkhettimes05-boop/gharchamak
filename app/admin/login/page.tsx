import { redirect } from "next/navigation";
import { adminAuthConfigured, getAdminSession } from "@/src/cms/auth";
import { loginAdmin } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const session = await getAdminSession();
  if (session) redirect("/admin");
  const { error } = await searchParams;
  const configured = adminAuthConfigured();

  return <main className="admin-login-shell"><section className="admin-login-card">
    <div className="admin-brand-mark">✦</div>
    <p className="admin-kicker">GharChamak</p>
    <h1>Admin CMS</h1>
    <p>Manage public content without editing GitHub.</p>
    {!configured ? <div className="admin-alert danger">Admin login is disabled until ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_SESSION_SECRET are configured.</div> : null}
    {error ? <div className="admin-alert danger">{error}</div> : null}
    <form action={loginAdmin} className="admin-form">
      <label>Email<input name="email" type="email" autoComplete="username" required /></label>
      <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
      <button className="admin-primary" type="submit" disabled={!configured}>Sign in</button>
    </form>
    <a className="admin-back-link" href="/en">← Back to website</a>
  </section></main>;
}
