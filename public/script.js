const loopAudio = new Audio('loopIntro.mp3');
const punkAudio = new Audio('punk.mp3');
loopAudio.loop = true;
punkAudio.loop = true;
punkAudio.volume = 0.3; // 🔉 volumen más bajo

const playButton = document.getElementById('playButton');
const aiVoice = new Audio();

let iaActivated = false;

playButton.addEventListener('click', async () => {
  if (iaActivated) return;

  iaActivated = true;
  loopAudio.play();
  punkAudio.play();

  // Llama a la IA
  try {
    const response = await fetch('/api/bienvenida');
    const blob = await response.blob();
    const audioURL = URL.createObjectURL(blob);
    aiVoice.src = audioURL;

    // Detiene los otros audios cuando esté lista la voz IA
    aiVoice.oncanplaythrough = () => {
      loopAudio.pause();
      punkAudio.pause();
      loopAudio.currentTime = 0;
      punkAudio.currentTime = 0;
      aiVoice.play();
    };
  } catch (error) {
    console.error('Error al reproducir bienvenida de IA:', error);
  }
});