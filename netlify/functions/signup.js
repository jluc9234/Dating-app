const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.NETLIFY_DATABASE_URL,
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
    const { name, email, password } = JSON.parse(event.body);
    
    if (!name || !email || !password) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Name, email, and password are required' })
      };
    }

    await client.connect();
    
    // Check if user already exists
    const existingUser = await client.query(
      'SELECT * FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      await client.end();
      return {
        statusCode: 409,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'An account with this email already exists.' })
      };
    }
    
    // Create new user
    const result = await client.query(
      `INSERT INTO users (name, email, password, age, bio, images, interests, is_premium, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) 
       RETURNING id, name, email, age, bio, images, interests, is_premium`,
      [
        name,
        email,
        password, // In production, this should be hashed
        18, // default age
        '', // empty bio initially
        JSON.stringify([`https://picsum.photos/seed/${Date.now()}/800/1200`]),
        JSON.stringify([]), // empty interests initially
        false // not premium by default
      ]
    );
    
    await client.end();
    
    const user = result.rows[0];
    // Parse JSON fields
    user.images = JSON.parse(user.images);
    user.interests = JSON.parse(user.interests);
    user.isPremium = user.is_premium;
    delete user.is_premium;
    
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    };
  } catch (error) {
    console.error('Signup error:', error);
    await client.end();
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Failed to create user account' })
    };
  }
};