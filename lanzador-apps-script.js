/**
 * LANZADOR DE LLAMADAS AUTOMÁTICO - GOOGLE APPS SCRIPT (CON SEGURIDAD POR TOKEN)
 * 
 * INSTRUCCIONES DE CONFIGURACIÓN:
 * 1. Abre tu hoja de cálculo de Google.
 * 2. En el menú superior, haz clic en: Extensiones -> Apps Script.
 * 3. Reemplaza todo el código anterior por este nuevo código seguro.
 * 4. Haz clic en "Guardar" (icono de disquete).
 * 5. Haz clic en "Implementar" -> "Administrar implementaciones".
 * 6. Edita la implementación activa (icono de lápiz) o crea una "Nueva implementación" (tipo Aplicación Web).
 * 7. Asegúrate de configurar:
 *    - Ejecutar como: "Yo" (tu cuenta de correo)
 *    - Quién tiene acceso: "Cualquiera"
 * 8. Guarda y copia la URL de la aplicación web.
 */

// Token de seguridad secreto para proteger la base de datos
var SECURE_TOKEN = "receta_sheets_secure_token_2026";

function doGet(e) {
  var action = e.parameter.action;
  var token = e.parameter.token;
  
  // Validamos el token de seguridad
  if (token !== SECURE_TOKEN) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "No autorizado. Token incorrecto o ausente." }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  if (action === "list") {
    var calls = [];
    for (var i = 1; i < data.length; i++) {
      if (data[i][0]) {
        calls.push({
          id: data[i][0],
          phone: data[i][1],
          name: data[i][2],
          status: data[i][3],
          dtmf: data[i][4],
          date: data[i][5]
        });
      }
    }
    return ContentService.createTextOutput(JSON.stringify(calls))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  if (action === "get") {
    var id = e.parameter.id;
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "success",
          phone: data[i][1],
          name: data[i][2],
          callStatus: data[i][3],
          dtmf: data[i][4],
          date: data[i][5],
          message: data[i][6] || "",
          messageType: data[i][7] || "tts",
          maxDuration: data[i][8] || 60
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "ID no encontrado" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Acción no válida" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var params;
  try {
    params = JSON.parse(e.postData.contents);
  } catch(err) {
    params = e.parameter;
  }
  
  var action = params.action;
  var token = params.token;
  
  // Validamos el token de seguridad en las peticiones de escritura
  if (token !== SECURE_TOKEN) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "No autorizado. Token incorrecto o ausente." }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  if (action === "add") {
    var id = params.id || ("call_" + Math.random().toString(36).substr(2, 9));
    var phone = params.phone;
    var name = params.name || "";
    var message = params.message || "";
    var messageType = params.messageType || "tts";
    var maxDuration = params.maxDuration || 60;
    var date = new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" });
    
    // Columnas: ID, Teléfono, Nombre, Estado, Respuesta DTMF, Fecha, Mensaje, Tipo, Duracion
    sheet.appendRow([id, "'" + phone, name, "Pendiente", "", date, message, messageType, maxDuration]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", id: id }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  if (action === "update") {
    var id = params.id;
    var status = params.status;
    var dtmf = params.dtmf;
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        if (status) {
          sheet.getRange(i + 1, 4).setValue(status);
        }
        if (dtmf !== undefined && dtmf !== null) {
          sheet.getRange(i + 1, 5).setValue(dtmf);
        }
        return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "ID no encontrado" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Acción POST no válida" }))
    .setMimeType(ContentService.MimeType.JSON);
}
