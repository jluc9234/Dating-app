const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email, password } = JSON.parse(event.body);
    
    if (!email || !password) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Email and password are required' })
      };
    }

    await client.connect();
    
    // Find user by email and password
    const result = await client.query(
      'SELECT id, name, email, age, bio, images, interests, is_premium FROM users WHERE LOWER(email) = LOWER($1) AND password = $2',
      [email, password]
    );
    
    await client.end();
    
    if (result.rows.length === 0) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Invalid email or password' })
      };
    }
    
    const user = result.rows[0];
    // Parse JSON fields
    user.images = JSON.parse(user.images);
    user.interests = JSON.parse(user.interests);
    user.isPremium = user.is_premium;
    delete user.is_premium;
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    };
  } catch (error) {
    console.error('Login error:', error);
    await client.end();
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Login failed' })
    };
  }
};