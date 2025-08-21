import { createClient } from '@supabase/supabase-js'

// Replace these with your real project URL and anon key
const supabaseUrl = 'https://bbeubpxzblifptgnsuyi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiZXVicHh6YmxpZnB0Z25zdXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNjk2NDQsImV4cCI6MjA2NTk0NTY0NH0.qBmhTt1ZZWu9F04gP6x3vTQAT2r7-DCmIvO-GAneo2o'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
