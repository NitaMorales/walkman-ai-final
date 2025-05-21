document.getElementById('playButton').addEventListener('click', async () => {
  const punkAudio = new Audio('punk.mp3');
  punkAudio.volume = 0.15;
  punkAudio.play();

  const loopIntro = new Audio('loopIntro.mp3');
  loopIntro.loop = true;
  loopIntro.volume = 1;
  loopIntro.play();

  // Pedimos la respuesta IA mientras el loop está sonando
  const response = await fetch('/api/bienvenida');
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const iaVoice = new Audio(url);
  iaVoice.volume = 1;

  // Cuando la voz IA esté lista, paramos el loop y la música
  loopIntro.pause();
  loopIntro.currentTime = 0;

  punkAudio.pause();
  punkAudio.currentTime = 0;

  iaVoice.play();
});