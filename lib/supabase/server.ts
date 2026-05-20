import { createClient } from "@supabase/supabase-js";

import type { AuditResult, PublicAuditReport } from "@/types/audit";
import { hasSupabaseConfig } from "@/lib/env";
import { buildPublicAuditReport } from "@/lib/public-report";

interface AuditRow {
  id: string;
  public_id: string;
  created_at: string;
  team_size: number;
  primary_use_case: string;
  tools: unknown;
  result: AuditResult;
  ai_summary: string;
  public_payload: PublicAuditReport;
}

export function getSupabaseAdmin() {
  if (!hasSupabaseConfig()) {
    return null;
  }

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export async function insertAudit(params: {
  publicId: string;
  result: AuditResult;
  aiSummary: string;
}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false as const, error: "Supabase is not configured." };
  }

  const publicPayload = buildPublicAuditReport({
    publicId: params.publicId,
    createdAt: new Date().toISOString(),
    result: params.result,
    aiSummary: params.aiSummary
  });

  const { data, error } = await supabase
    .from("audits")
    .insert({
      public_id: params.publicId,
      team_size: params.result.input.teamSize,
      primary_use_case: params.result.input.primaryUseCase,
      tools: params.result.input.tools,
      result: params.result,
      ai_summary: params.aiSummary,
      public_payload: publicPayload
    })
    .select("id, public_id, created_at, public_payload")
    .single();

  if (error) {
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const, data };
}

export async function fetchPublicAudit(publicId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("audits")
    .select("id, public_id, created_at, team_size, primary_use_case, tools, result, ai_summary, public_payload")
    .eq("public_id", publicId)
    .maybeSingle<AuditRow>();

  if (error || !data) {
    return null;
  }

  return data.public_payload || buildPublicAuditReport({
    publicId: data.public_id,
    createdAt: data.created_at,
    result: data.result,
    aiSummary: data.ai_summary
  });
}

export async function insertLead(params: {
  report: PublicAuditReport;
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  ipHash?: string;
  userAgent?: string;
}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false as const, error: "Supabase is not configured." };
  }

  const { error } = await supabase.from("leads").insert({
    public_id: params.report.publicId,
    email: params.email,
    company_name: params.companyName || null,
    role: params.role || null,
    team_size: params.teamSize || params.report.teamSize,
    monthly_savings: params.report.result.totalMonthlySavings,
    annual_savings: params.report.result.totalAnnualSavings,
    ip_hash: params.ipHash || null,
    user_agent: params.userAgent || null
  });

  if (error) {
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const };
}
