require('dotenv').config();
const tmi = require('tmi.js');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Configuración del bot de Twitch
const client = new tmi.Client({
    options: { debug: true },
    channels: [ process.env.TWITCH_CHANNEL ]
});

client.connect().catch(console.error);

client.on('message', (channel, tags, message, self) => {
    if (self) return;

    const msg = message.trim().toLowerCase();

    if (msg === "!mstart") {
        console.log("▶️ Iniciar cronómetro de Minecraft");
        io.emit("action", { type: "MC_START_TIMER" });
    } else if (msg === "!mpause") {
        console.log("⏸️ Pausar cronómetro de Minecraft");
        io.emit("action", { type: "MC_PAUSE_TIMER" });
    } else if (msg === "!kill") {
        console.log("💀 +1 Muerte");
        io.emit("action", { type: "MC_ADD_KILL" });
    } else if (msg === "!rkill") {
        console.log("↩️ -1 Muerte");
        io.emit("action", { type: "MC_REMOVE_KILL" });
    }
});

// ⚠️ Railway asigna un puerto automático con process.env.PORT
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`Bot conectado al canal: ${process.env.TWITCH_CHANNEL}`);
});