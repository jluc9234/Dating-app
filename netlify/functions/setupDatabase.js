const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.NETLIFY_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event, context) => {
  try {
    await client.connect();
    
    // Create users table if it doesn't exist
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        age INTEGER DEFAULT 18,
        bio TEXT DEFAULT '',
        images JSONB DEFAULT '[]',
        interests JSONB DEFAULT '[]',
        is_premium BOOLEAN DEFAULT FALSE,
        phone VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    await client.query(createUsersTable);
    
    // Create an index on email for faster lookups
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(LOWER(email));');
    
    await client.end();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Database setup complete' })
    };
  } catch (error) {
    console.error('Setup error:', error);
    await client.end();
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Database setup failed' })
    };
  }
};