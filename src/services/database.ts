
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
    
    // Make API call to backend setup endpoint using relative path
    const response = await fetch('/api/setup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to initialize database');
    }

    const result = await response.json();
    console.log('Setup completed successfully:', result);
    return result;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}
