import os
from dotenv import set_key

env_file = '/home/ubuntu/shopify-connector-app/backend/.env'
set_key(env_file, 'VITE_SUPABASE_URL', '')
set_key(env_file, 'VITE_SUPABASE_ANON_KEY', '')
print('Reset Supabase environment variables to empty strings')
