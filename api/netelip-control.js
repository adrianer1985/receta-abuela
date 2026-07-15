// Vercel Serverless Function: api/netelip-control.js

export default async function handler(req, res) {
  // Configurar cabeceras CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Netelip envía las peticiones por POST usando urlencoded
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Utiliza POST.' });
  }

  // Vercel puede parsear el body o recibirlo como cadena cruda
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = Object.fromEntries(new URLSearchParams(body));
    } catch (e) {
      console.error('Error parsing body string:', e);
    }
  }

  const { ID, src, dst, dtmf, userfield, userdata, statuscall } = body;

  console.log('Netelip Webhook Event Received:', { ID, src, dst, dtmf, userfield, userdata, statuscall });

  // Desempaquetamos userdata para obtener el callId, appsScriptUrl y el mensaje a emitir
  let callId = '';
  let appsScriptUrl = '';
  let msg = 'Hola. Por favor, selecciona una opción en tu teléfono.';

  if (userdata) {
    try {
      const parsedUserdata = JSON.parse(userdata);
      callId = parsedUserdata.call_id;
      appsScriptUrl = parsedUserdata.appsScriptUrl;
      msg = parsedUserdata.msg || msg;
    } catch (e) {
      // Fallback si userdata se envió como texto plano
      callId = userdata;
    }
  }

  // 1. Manejo si la llamada NO ha sido contestada o ha terminado (Estados Terminales)
  if (statuscall && statuscall !== 'ANSWER') {
    console.log(`Call ${callId} ended with status: ${statuscall}`);
    if (appsScriptUrl && callId) {
      try {
        await fetch(appsScriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update',
            token: 'receta_sheets_secure_token_2026',
            id: callId,
            status: statuscall // Guardamos "NOANSWER", "BUSY", "CANCEL", etc.
          })
        });
      } catch (err) {
        console.error('Error logging ended call to Google Sheets:', err);
      }
    }
    // Netelip no necesita comandos si la llamada no está activa
    return res.status(200).json({});
  }

  // 2. Manejo cuando la llamada es CONTESTADA ('ANSWER')
  let responseCommand = {};

  if (!userfield) {
    // FASE A: El cliente acaba de descolgar.
    // Registramos que descolgó en Google Sheets.
    if (appsScriptUrl && callId) {
      try {
        await fetch(appsScriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update',
            token: 'receta_sheets_secure_token_2026',
            id: callId,
            status: 'Contestada'
          })
        });
      } catch (err) {
        console.error('Error updating call to answered in Google Sheets:', err);
      }
    }

    // Le reproducimos el mensaje de audio y esperamos 1 dígito de respuesta (timeout de 10 segundos).
    responseCommand = {
      command: 'speak_getdtmf',
      options: `netelip;Silvia;${msg};10000;1;1.2`,
      userfield: 'save_dtmf' // Pasamos este estado para la siguiente interacción
    };

  } else if (userfield === 'save_dtmf') {
    // FASE B: El cliente ha pulsado una tecla o el tiempo ha expirado.
    const userDigit = dtmf || 'timeout';
    const cleanStatus = userDigit === 'timeout' ? 'Sin respuesta (Timeout)' : 'Completada';

    console.log(`Call ${callId} received DTMF input: ${userDigit}`);

    // Guardamos la tecla pulsada y marcamos como Completada en Google Sheets.
    if (appsScriptUrl && callId) {
      try {
        await fetch(appsScriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update',
            token: 'receta_sheets_secure_token_2026',
            id: callId,
            status: cleanStatus,
            dtmf: userDigit
          })
        });
      } catch (err) {
        console.error('Error updating DTMF response in Google Sheets:', err);
      }
    }

    // Agradecemos la llamada y establecemos el estado para colgar en la siguiente fase
    responseCommand = {
      command: 'speak',
      options: 'netelip;Silvia;Muchas gracias por tu respuesta. Adiós.;1.2',
      userfield: 'hangup'
    };

  } else {
    // FASE C (hangup) o cualquier otra fase: Colgamos la llamada definitivamente
    responseCommand = {
      command: 'hangup'
    };
  }

  // Devolvemos el comando a Netelip en formato JSON
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json(responseCommand);
}
