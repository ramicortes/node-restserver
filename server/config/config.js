// ========================
// PUERTO
// ========================
process.env.PORT = process.env.PORT || 3000;

// ========================
// ENTORNO
// ========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ========================
// Vencimiento del Token
// ========================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias 

process.env.CADUCIDAD_TOKEN = '48h';

// ========================
// Seed
// ========================

process.env.SEED = process.env.SEED || 'corona-virus-atr';

// ========================
// BASE DE DATOS
// ========================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;


// ========================
// Google Client ID
// ========================

process.env.CLIENT_ID = process.env.CLIENT_ID || '236531854104-1t9972aqet36lm217800nutusmo6t7bm.apps.googleusercontent.com';