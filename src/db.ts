import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function saveReport(
  query: string,
  report: string,
  sources: string[]
): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from('research_reports')
    .insert({ query, report, sources, created_at: new Date().toISOString() })
    .select()
    .single()

  if (error) throw error
  return { id: data.id }
}

export async function getReport(id: string): Promise<{ query: string; report: string; sources: string[] } | null> {
  const { data, error } = await supabase
    .from('research_reports')
    .select('query, report, sources')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function listReports(limit = 20): Promise<Array<{ id: string; query: string; created_at: string }>> {
  const { data, error } = await supabase
    .from('research_reports')
    .select('id, query, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}
