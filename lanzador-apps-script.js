/**
 * LANZADOR DE LLAMADAS AUTOMÁTICO - GOOGLE APPS SCRIPT
 * 
 * INSTRUCCIONES DE CONFIGURACIÓN:
 * 1. Crea una nueva hoja de cálculo en Google Sheets (ej. "Lanzador de Llamadas").
 * 2. En la primera fila (A1 a F1), escribe las siguientes cabeceras exactamente:
 *    A1: ID
 *    B1: Teléfono
 *    C1: Nombre
 *    D1: Estado
 *    E1: Respuesta DTMF
 *    F1: Fecha
 * 3. En el menú superior de la hoja, haz clic en: Extensiones -> Apps Script.
 * 4. Borra el código por defecto y pega todo este código.
 * 5. Haz clic en el botón superior de "Guardar" (icono de disquete).
 * 6. Haz clic en "Implementar" (botón azul arriba a la derecha) -> "Nueva implementación".
 * 7. En "Seleccionar tipo", elige "Aplicación web".
 * 8. Configura los campos:
 *    - Descripción: Lanzador API
 *    - Ejecutar como: Tú (tu correo electrónico)
 *    - Quién tiene acceso: "Cualquiera" (esto es vital para que Vercel pueda comunicarse con la hoja).
 * 9. Haz clic en "Implementar" y autoriza los permisos de Google.
 * 10. Copia la "URL de la aplicación web" que te proporciona (ej. https://script.google.com/macros/s/.../exec).
 *     Esta URL es la que pegarás en el panel de control de tu web.
 */

function doGet(e) {
  var action = e.parameter.action;
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // CORS Fallback header
  var output = "";
  
  if (action === "list") {
    var data = sheet.getDataRange().getValues();
    var calls = [];
    // Omitimos la fila de cabecera
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
  
  return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Acción no válida" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var params;
  try {
    params = JSON.parse(e.postData.contents);
  } catch(err) {
    // Si se envía como urlencoded
    params = e.parameter;
  }
  
  var action = params.action;
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  if (action === "add") {
    var id = params.id || ("call_" + Math.random().toString(36).substr(2, 9));
    var phone = params.phone;
    var name = params.name || "";
    var date = new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" });
    
    sheet.appendRow([id, phone, name, "Pendiente", "", date]);
    
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
