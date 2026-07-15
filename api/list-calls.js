// Vercel Serverless Function: api/list-calls.js

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Validar autorización del administrador
  const authHeader = req.headers.authorization;
  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASS || 'receta2026';
  const expectedToken = 'Bearer ' + Buffer.from(`${adminUser}:${adminPass}`).toString('base64');

  if (!authHeader || authHeader !== expectedToken) {
    return res.status(401).json({ error: 'No autorizado. Por favor, inicia sesión.' });
  }

  const { appsScriptUrl } = req.query;

  if (!appsScriptUrl) {
    return res.status(400).json({ error: 'La URL de Google Apps Script es requerida.' });
  }

  try {
    const token = 'receta_sheets_secure_token_2026';
    const response = await fetch(`${appsScriptUrl}?action=list&token=${token}`);
    
    if (!response.ok) {
      throw new Error(`Google Sheets respondió con código ${response.status}`);
    }
    
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching call list from Google Sheets:', error);
    return res.status(500).json({ error: 'Error al conectar con la base de datos de Google Sheets.' });
  }
}
