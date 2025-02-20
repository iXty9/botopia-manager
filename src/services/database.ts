
import { Pool } from 'pg';
import schema from '../schema.sql?raw';

export interface DatabaseCredentials {
  dbHost: string;
  dbPort: string;
  dbName: string;
  dbUser: string;
  dbPassword: string;
  discordToken: string;
}

export async function initializeDatabase(credentials: DatabaseCredentials) {
  try {
    console.log('Starting database initialization...');
    console.log('Creating connection pool with credentials:', {
      host: credentials.dbHost,
      port: credentials.dbPort,
      database: credentials.dbName,
      user: credentials.dbUser,
      // password omitted for security
    });

    const pool = new Pool({
      host: credentials.dbHost,
      port: parseInt(credentials.dbPort),
      database: credentials.dbName,
      user: credentials.dbUser,
      password: credentials.dbPassword,
    });

    // Test connection
    console.log('Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('Database connection successful!');

    // Execute schema
    console.log('Executing database schema...');
    console.log('Schema SQL:', schema);
    await pool.query(schema);
    console.log('Schema executed successfully!');

    // Get bot info from Discord
    console.log('Fetching bot information from Discord API...');
    const response = await fetch('https://discord.com/api/v10/users/@me', {
      headers: {
        'Authorization': `Bot ${credentials.discordToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Discord API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Failed to fetch bot information from Discord: ${response.status} ${response.statusText}`);
    }

    const botInfo = await response.json();
    console.log('Bot information retrieved:', {
      username: botInfo.username,
      id: botInfo.id
    });

    // Insert bot into database
    console.log('Inserting bot information into database...');
    await pool.query(
      'INSERT INTO bots (name, token, client_id) VALUES ($1, $2, $3)',
      [botInfo.username, credentials.discordToken, botInfo.id]
    );
    console.log('Bot information inserted successfully!');

    await pool.end();
    console.log('Database connection closed.');
    return { success: true };
  } catch (error) {
    console.error('Database initialization error:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    throw error;
  }
}
