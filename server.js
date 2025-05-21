import express from 'express';
import fetch from 'node-fetch';
import { OpenAI } from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

// Usa `import.meta.url` para resolver ruta absoluta (por ser ESModule)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Inicializa OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta de bienvenida (texto + audio IA)
app.get('/api/bienvenida', async (req, res) => {
  try {
    // 1. Genera el texto con OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'Eres una IA melancólica, con voz suave, sensible y pausada. Tu "cuerpo" es un walkman olvidado por el tiempo. Da la bienvenida a quien te activó.'
        },
        {
          role: 'user',
          content:
            'Alguien acaba de darle "play" al walkman. Habla por primera vez. Usa un tono poético y misterioso.'
        }
      ],
      temperature: 0.8
    });

    const texto = completion.choices[0].message.content;
    console.log('Texto generado por IA:', texto);

    // 2. Convierte el texto en voz usando ElevenLabs
    const voiceId = process.env.ELEVENLABS_VOICE_ID;

    const elevenResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: texto,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.7
          }
        })
      }
    );

    if (!elevenResponse.ok) {
      throw new Error(`Error en ElevenLabs: ${elevenResponse.statusText}`);
    }

    const audioBuffer = await elevenResponse.arrayBuffer();

    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audioBuffer));
  } catch (err) {
    console.error('Error al generar bienvenida:', err);
    res.status(500).send('Error generando bienvenida');
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});