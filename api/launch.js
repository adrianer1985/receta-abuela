// Vercel Serverless Function: api/launch.js

export default async function handler(req, res) {
  // Configurar cabeceras CORS para permitir pruebas locales
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Utiliza POST.' });
  }

  // Validar autorización para lanzar llamadas
  const authHeader = req.headers.authorization;
  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASS || 'receta2026';
  const expectedToken = 'Bearer ' + Buffer.from(`${adminUser}:${adminPass}`).toString('base64');

  if (!authHeader || authHeader !== expectedToken) {
    return res.status(401).json({ error: 'No autorizado. Por favor, inicia sesión.' });
  }


  const { phone, name, message, appsScriptUrl, apiUser, apiToken, apiSrc } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'El número de teléfono es obligatorio.' });
  }
  if (!message) {
    return res.status(400).json({ error: 'El mensaje de audio es obligatorio.' });
  }
  if (!appsScriptUrl) {
    return res.status(400).json({ error: 'La URL de la aplicación web de Google Sheets es obligatoria.' });
  }

  // Generamos un ID de llamada único
  const callId = 'call_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

  try {
    // 1. Añadimos el registro inicial de la llamada a la hoja de Google Sheets
    const dbResponse = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add',
        token: 'receta_sheets_secure_token_2026',
        id: callId,
        phone: phone,
        name: name || 'Cliente Anónimo'
      })
    });

    const dbResult = await dbResponse.json();
    if (dbResult.status !== 'success') {
      throw new Error('No se pudo registrar la llamada en Google Sheets: ' + (dbResult.message || 'Error desconocido'));
    }

    // 2. Obtenemos credenciales de Netelip (desde variables de entorno o desde la petición)
    const netelipUser = apiUser || process.env.NETELIP_API_USER;
    const netelipToken = apiToken || process.env.NETELIP_API_TOKEN;
    const netelipSrc = apiSrc || process.env.NETELIP_API_SRC;

    if (!netelipUser || !netelipToken) {
      return res.status(400).json({ 
        error: 'Faltan credenciales de Netelip. Configura NETELIP_API_USER y NETELIP_API_TOKEN en Vercel o pásalas en la petición.' 
      });
    }

    if (!netelipSrc) {
      return res.status(400).json({ 
        error: 'Falta el Identificador de Origen (Caller ID / DID). Configura NETELIP_API_SRC en Vercel o indícalo en el panel.' 
      });
    }

    // El webhook de control necesita la URL de Google Sheets y el ID de la llamada.
    // Metemos este contexto en la variable userdata para que sea 100% dinámico y sin estado en el servidor.
    const userdataObj = {
      call_id: callId,
      appsScriptUrl: appsScriptUrl,
      msg: message
    };

    // 3. Lanzamos la llamada a través de Netelip
    const netelipParams = new URLSearchParams();
    netelipParams.append('api', netelipUser);
    netelipParams.append('token', netelipToken);
    netelipParams.append('src', netelipSrc); // Identificador numérico real autorizado (DID o número verificado)
    netelipParams.append('dst', phone);
    netelipParams.append('duration', '45'); // Tiempo de timbrado máximo
    netelipParams.append('typedst', 'pstn');
    netelipParams.append('userdata', JSON.stringify(userdataObj));

    const netelipResponse = await fetch('https://api.netelip.com/v1/voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: netelipParams.toString()
    });

    const netelipResult = await netelipResponse.json();

    if (netelipResult.response === '200') {
      // 4. Actualizamos el estado a "Llamando" en Google Sheets
      await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          token: 'receta_sheets_secure_token_2026',
          id: callId,
          status: 'Llamando'
        })
      });

      return res.status(200).json({
        success: true,
        callId: callId,
        netelipId: netelipResult.ID,
        message: 'Llamada iniciada con éxito.'
      });
    } else {
      // Actualizamos a "Error" en Google Sheets
      await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          token: 'receta_sheets_secure_token_2026',
          id: callId,
          status: 'Error'
        })
      });

      return res.status(400).json({
        error: 'Netelip rechazó la llamada.',
        netelipCode: netelipResult.response
      });
    }
  } catch (error) {
    console.error('Error launching call:', error);
    return res.status(500).json({ error: error.message || 'Error interno del servidor.' });
  }
}
