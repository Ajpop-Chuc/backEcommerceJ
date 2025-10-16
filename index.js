require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sequelize, testConnection } = require('./database/config');
const routes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS Manual - Configuración más explícita
app.use((req, res, next) => {
    const allowedOrigin = 'http://localhost:5173';
    const origin = req.headers.origin;
    
    // Solo permite el origen específico, NUNCA '*'
    if (origin === allowedOrigin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    // Manejar preflight
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }
    next();
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Sesiones
const sessionStore = new SequelizeStore({
    db: sequelize,
});

app.use(session({
    secret: process.env.SESSION_SECRET || 'secret-key-change-in-production',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'lax'
    }
}));

sessionStore.sync();

// Middleware de logging
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    next();
});

// Rutas
app.use('/', routes);

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    res.status(500).json({ error: err.message });
});

// Iniciar servidor
const startServer = async () => {
    try {
        await testConnection();
        await sequelize.sync({ alter: true });

        app.listen(PORT, () => {
            console.log('='.repeat(60));
            console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
            console.log(`🌱 Entorno: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 CORS habilitado para: http://localhost:5173`);
            console.log('='.repeat(60));
        });
    } catch (error) {
        console.error('❌ Error iniciando el servidor:', error.message);
        process.exit(1);
    }
};

startServer();