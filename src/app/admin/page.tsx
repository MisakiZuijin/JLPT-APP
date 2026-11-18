import { Suspense } from "react";
import { getSupabaseAdminClient, requireAdminContext } from "@/lib/auth-admin";
import { logout } from "../login/actions";
import { AdminWorkspace, type AdminUserSummary } from "./AdminWorkspace";
import type { BankQuestionRow } from "./actions";

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-sm font-medium text-slate-500 dark:bg-[#0B1120] dark:text-slate-400">
          Memuat Panel Admin JLPT...
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}

async function AdminContent() {
  const adminCtx = await requireAdminContext();
  const adminClient = getSupabaseAdminClient();

  const [{ count: totalItems }, bankRes, usersRes] = await Promise.all([
    adminClient.from("items").select("*", { count: "exact", head: true }),
    adminClient
      .from("question_bank")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50),
    adminClient.auth.admin.listUsers({ perPage: 50 }),
  ]);

  const bankTableMissing = Boolean(bankRes.error);
  const bankQuestions = (bankRes.data as BankQuestionRow[] | null) ?? [];

  const users: AdminUserSummary[] = (usersRes.data?.users ?? []).map((u) => ({
    id: u.id,
    email: u.email ?? "-",
    displayName: String(u.user_metadata?.display_name ?? "") || u.email || "Pelajar",
    role: u.app_metadata?.role === "admin" ? "admin" : "learner",
    createdAt: u.created_at,
  }));

  return (
    <AdminWorkspace
      adminEmail={adminCtx.email}
      adminName={adminCtx.displayName}
      totalItems={totalItems ?? 0}
      initialBankQuestions={bankQuestions}
      bankTableMissing={bankTableMissing}
      users={users}
      logoutAction={logout}
    />
  );
}
