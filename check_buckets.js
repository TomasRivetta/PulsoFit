import { createClient } from './lib/supabase/client.js'

async function checkBuckets() {
  const supabase = createClient()
  const { data, error } = await supabase.storage.listBuckets()
  if (error) {
    console.error('Error listing buckets:', error)
  } else {
    console.log('Buckets:', data.map(b => b.name))
  }
}

checkBuckets()
