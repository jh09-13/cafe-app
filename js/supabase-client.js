// ============================================
// Supabase 클라이언트 + 익명 세션 ID
// ============================================

const SUPABASE_URL = 'https://yrphriucoustsnxpkxze.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlycGhyaXVjb3VzdHNueHBreHplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5MjA5ODgsImV4cCI6MjA5OTQ5Njk4OH0.pZF5iM_evp6M7-68PZfj-1AoSPSvc1unNNt-l74npeU'; // Supabase 대시보드 → Settings → API → anon public key

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function getSessionId() {
  let id = localStorage.getItem('cafe_session_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('cafe_session_id', id);
  }
  return id;
}
