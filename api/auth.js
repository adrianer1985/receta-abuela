// Vercel Serverless Function: api/auth.js

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Utiliza POST.' });
  }

  const { action, username, password, token } = req.body;

  // Credenciales por defecto (personalizables en Vercel mediante variables de entorno)
  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASS || 'receta2026';

  // Generamos un token básico codificado en Base64 para la sesión
  const validToken = Buffer.from(`${adminUser}:${adminPass}`).toString('base64');

  if (action === 'login') {
    if (username === adminUser && password === adminPass) {
      return res.status(200).json({ success: true, token: validToken });
    } else {
      return res.status(401).json({ success: false, error: 'Usuario o contraseña incorrectos.' });
    }
  }

  if (action === 'verify') {
    if (token === validToken) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false, error: 'Sesión expirada o no válida.' });
    }
  }

  return res.status(400).json({ error: 'Acción no válida.' });
}
