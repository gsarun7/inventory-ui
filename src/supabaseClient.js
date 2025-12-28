import { createClient } from '@supabase/supabase-js'

// Debug: Check if variables are loading
console.log('All env variables:', import.meta.env)
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY)

const supabaseUrl = 'https://xwlggfxublyvruargbmp.supabase.co'
const supabaseAnonKey = 'sb_publishable_iJSL7HboBqkH3dxNbzO_9w_PKWsyzrC'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
