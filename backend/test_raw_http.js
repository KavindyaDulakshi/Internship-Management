require('dotenv').config();
const url = 'https://lxgyaagtmzvmrmqemcuc.supabase.co/auth/v1/signup';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function testBrowserHeaders() {
  const headers = {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'apikey': serviceKey,
    'authorization': `Bearer ${serviceKey}`,
    'content-type': 'application/json',
    'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'x-client-info': 'supabase-js/2.43.4',
    'Origin': 'http://localhost:5175',
    'Referer': 'http://localhost:5175/'
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email: `test_headers_${Date.now()}@example.com`,
        password: 'TestPassword123!'
      })
    });
    
    const text = await res.text();
    console.log(`Status with simulated browser headers = ${res.status}`);
    console.log(`Response: ${text}`);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testBrowserHeaders();
