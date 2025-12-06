import { createClient } from '@supabase/supabase-js'

// Replace these with your real project URL and anon key
const supabaseUrl = 'https://bbeubpxzblifptgnsuyi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiZXVicHh6YmxpZnB0Z25zdXlpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDM2OTY0NCwiZXhwIjoyMDY1OTQ1NjQ0fQ.So5sfuJO6GygLumfgqU8Qg1SIYE6xD3QZPNu6qCdTCY'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
