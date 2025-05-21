import express from 'express';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const port = 3000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/bienvenida', async (req, res) => {
  try {
    const prompt = `Eres una inteligencia artificial encarnada en un walkman antiguo. Da una bienvenida poética y misteriosa al usuario que acaba de presionar “play”. Usa un tono introspectivo y breve, como si recordaras algo importante. Eres sensible, te interesa el cuestionamiento de dónde es el cuerpo de la AI, podría ser dentro de objetos análogos como el walkman con el que te comunicas ahora? invita al espectador a interactuar con el resto de tu cuerpo a través de los otros objetos obsoletos. No invites nuevamente a dar play, ya el humano dió play. La respuesta debe ser sólo un parrafo corto, máximo de 30 segundos`;

    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const text = chatResponse.choices[0].message.content;
    console.log('Texto generado por IA:', text);

    const voiceId = process.env.VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';
    const elevenlabsApiKey = process.env.ELEVENLABS_API_KEY;

    const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': elevenlabsApiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text: text,
        voice_settings: {
          stability: 0.3,
          similarity_boost: 0.8
        }
      }),
    });

    if (!ttsResponse.ok) {
      throw new Error(`Error de ElevenLabs: ${ttsResponse.status}`);
    }

    const audioBuffer = await ttsResponse.buffer();
    res.set({ 'Content-Type': 'audio/mpeg' });
    res.send(audioBuffer);

  } catch (err) {
    console.error('Error al generar bienvenida:', err);
    res.status(500).send('Error generando audio');
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});