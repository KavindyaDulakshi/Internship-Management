const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lxgyaagtmzvmrmqemcuc.supabase.co';
const supabaseAnonKey = 'sb_publishable_gvIzAoVx0ikIV6wHy8Xygg_ot4Dp6tq';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAnonSignup() {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: `test_anon_signup_${Date.now()}@example.com`,
      password: 'TestPassword123!',
    });
    
    if (error) {
      console.error('Signup with Anon Key failed:', error.message, error.status);
    } else {
      console.log('Signup with Anon Key succeeded! User created:', data.user?.id);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testAnonSignup();
