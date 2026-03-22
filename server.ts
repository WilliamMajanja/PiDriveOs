import express from 'express';
import { createServer as createViteServer } from 'vite';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

  app.use(express.json());
  
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
  });
  
  // Real-time Telemetry API (Prometheus/k3s style)
  app.get('/api/telemetry', (req, res) => {
    console.log('GET /api/telemetry');
    res.json({
      cpu: Math.random() * 100,
      temp: 40 + Math.random() * 15,
      ram: 4000 + Math.random() * 12000, // MB (calibrated for Pi 5 16GB)
      disk: 45.2,
      network: Math.random() * 50,
      timestamp: new Date().toISOString()
    });
  });

  // OBD II Diagnostics API
  app.get('/api/obd', (req, res) => {
    console.log('GET /api/obd');
    res.json({
      rpm: 2500 + (Math.random() - 0.5) * 500,
      speed: 65 + (Math.random() - 0.5) * 10,
      coolantTemp: 92 + (Math.random() - 0.5) * 2,
      load: 35 + (Math.random() - 0.5) * 5,
      throttlePos: 22 + (Math.random() - 0.5) * 2,
      voltage: 14.2 + (Math.random() - 0.5) * 0.2,
      dtcCount: 2,
      dtcs: [
        { code: 'P0300', description: 'Random or Multiple Cylinder Misfire Detected' },
        { code: 'P0171', description: 'System Too Lean (Bank 1)' }
      ],
      vin: '1G1RC6E4XFU******',
      protocol: 'ISO 15765-4 CAN (11 bit ID, 500 kbit/s)'
    });
  });

  // Signal Lab API (HackRF/ESP32 style)
  app.get('/api/signals', (req, res) => {
    res.json({
      activeFrequency: '5.925 GHz',
      gain: 32,
      sampleRate: '20 MSPS',
      source: 'HACKRF_ONE',
      signals: Array.from({ length: 60 }, (_, i) => ({
        x: i,
        y: 10 + Math.random() * 80 + (i > 25 && i < 35 ? 40 : 0) // Signal peak at center
      }))
    });
  });

  // Threat Intelligence API (V2X/Governance style)
  app.get('/api/threats', (req, res) => {
    res.json([
      {
        id: 'gov-1',
        type: 'IMSI_CATCHER',
        source: 'GOV_NODE_ALPHA',
        frequency: '850.2 MHz',
        power: -42,
        level: 'HIGH',
        timestamp: new Date().toISOString(),
        description: 'Cellular surveillance node detected. IMSI catcher signature match. Active tracking confirmed.',
        isGovernance: true,
        countermeasureActive: false
      },
      {
        id: 'mesh-1',
        type: 'V2V_SPOOF',
        source: 'NODE_X_77',
        frequency: '5.9 GHz',
        power: -55,
        level: 'MEDIUM',
        timestamp: new Date().toISOString(),
        description: 'Anomalous V2V broadcast detected. Possible position spoofing or replay attack.',
        isGovernance: false,
        countermeasureActive: true
      }
    ]);
  });

  // API catch-all to prevent falling through to SPA fallback
  app.all('/api/*', (req, res, next) => {
    if (res.headersSent) return next();
    console.warn(`API route not found: ${req.method} ${req.url}`);
    res.status(404).json({ error: 'API route not found' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  // WebSocket for Live Logs
  const wss = new WebSocketServer({ server });
  
  wss.on('connection', (ws) => {
    console.log('Log client connected');
    
    const logInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        const logs = [
          { level: 'INFO', message: 'V2X Mesh scan complete. 4 nodes verified.' },
          { level: 'DEBUG', message: 'HackRF sample buffer synchronized.' },
          { level: 'WARN', message: 'Anomalous signal detected on 915 MHz.' },
          { level: 'INFO', message: 'Sovereign AI Audit initiated.' }
        ];
        const log = logs[Math.floor(Math.random() * logs.length)];
        ws.send(JSON.stringify({
          timestamp: new Date().toISOString(),
          ...log
        }));
      }
    }, 2000);

    ws.on('close', () => clearInterval(logInterval));
  });
}

startServer();
