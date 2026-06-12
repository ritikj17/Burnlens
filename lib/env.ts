export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
}

export function getConsultationUrl() {
  return process.env.CONSULTATION_URL || "https://docs.google.com/forms/d/e/1FAIpQLSdnoglk32ChxkZ7MI9heCZRxxnGjw1eGt6sF4Qrwz9f31ZjDA/viewform?usp=publish-editor";
}

export function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
