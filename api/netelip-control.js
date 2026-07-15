// Vercel Serverless Function: api/netelip-control.js

export default async function handler(req, res) {
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

  // Vercel puede parsear el body o recibirlo como cadena cruda o Buffer
  let body = req.body;
  if (Buffer.isBuffer(body)) {
    body = body.toString('utf-8');
  }
  if (typeof body === 'string') {
    try {
      body = Object.fromEntries(new URLSearchParams(body));
    } catch (e) {
      console.error('Error parsing body string:', e);
    }
  }
  if (!body) {
    body = {};
  }

  const { ID, src, dst, dtmf, userfield, userdata, statuscall } = body;

  console.log('Netelip Webhook Event Received:', { ID, src, dst, dtmf, userfield, userdata, statuscall });

  // Desempaquetamos userdata para obtener el callId y appsScriptUrl
  let callId = '';
  let appsScriptUrl = '';

  if (userdata) {
    if (userdata.includes('|')) {
      const [cid, scriptId] = userdata.split('|');
      callId = cid;
      appsScriptUrl = `https://script.google.com/macros/s/${scriptId}/exec`;
    } else {
      callId = userdata;
    }
  }

  // Obtenemos los detalles de la llamada desde Google Sheets si tenemos la URL
  let msg = 'Hola. Por favor, selecciona una opción en tu teléfono.';
  let messageType = 'tts';
  let maxDuration = 60; // 60 segundos por defecto

  if (appsScriptUrl && callId) {
    try {
      const dbRes = await fetch(`${appsScriptUrl}?action=get&id=${callId}&token=receta_sheets_secure_token_2026`);
      if (dbRes.ok) {
        const callDetails = await dbRes.json();
        if (callDetails.status === 'success') {
          msg = callDetails.message || msg;
          messageType = callDetails.messageType || 'tts';
          maxDuration = parseInt(callDetails.maxDuration, 10) || 60;
        }
      }
    } catch (err) {
      console.error('Error fetching call details from Google Sheets:', err);
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

    // Determinamos si es reproducción de audio o texto a voz (TTS)
    if (messageType === 'audio') {
      let audioUrl = msg;
      // Si es una ruta relativa en el servidor de la web (ej. /assets/audio/mensaje.mp3)
      if (msg.startsWith('/')) {
        const host = req.headers.host || 'www.recetadeabuela.com';
        const protocol = req.headers['x-forwarded-proto'] || 'https';
        audioUrl = `${protocol}://${host}${msg}`;
      }
      // Comando para reproducir un fichero de audio remoto y capturar DTMF
      //options: "remote;{files};{wait_ms};{digits}"
      responseCommand = {
        command: 'play_getdtmf',
        options: `remote;${audioUrl};${maxDuration * 1000};1`,
        userfield: 'save_dtmf'
      };
    } else {
      // Comando para reproducir Texto a Voz (Google TTS) y capturar DTMF
      //options: "google;es;{mensaje};{wait_ms};{digits};{speed}"
      responseCommand = {
        command: 'speak_getdtmf',
        options: `google;es;${msg};${maxDuration * 1000};1;1.2`,
        userfield: 'save_dtmf'
      };
    }

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
    // Si la llamada fue por archivo de audio, colgamos directamente para ahorrar tiempo de llamada
    if (messageType === 'audio') {
      responseCommand = {
        command: 'hangup'
      };
    } else {
      responseCommand = {
        command: 'speak',
        options: 'google;es;Muchas gracias por tu respuesta. Adiós.;1.2',
        userfield: 'hangup'
      };
    }

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
