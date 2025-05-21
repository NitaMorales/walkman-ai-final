const loop = new Audio('loopIntro.mp3');
const punk = new Audio('punk.mp3');

const playButton = document.getElementById('playButton');
let iaAudio = null;

playButton.addEventListener('click', async () => {
  playButton.disabled = true;

  // Inicia el loop de bienvenida
  loop.loop = true;
  loop.volume = 0.2;
  await loop.play();

  try {
    // Llama a la API que genera la voz IA
    const response = await fetch('/api/bienvenida');
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    // Detiene el loop una vez que la IA responde
    loop.pause();

    iaAudio = new Audio(audioUrl);
    iaAudio.play();

    // Cuando la IA termina de hablar, inicia la música
    iaAudio.onended = () => {
      punk.volume = 0.5;
      punk.play();
    };
  } catch (err) {
    console.error('Error al obtener audio IA:', err);
    loop.pause();
    playButton.disabled = false;
  }
});