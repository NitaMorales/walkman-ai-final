const audioElement = new Audio();
const loopIntro = new Audio('loopIntro.mp3');
const punk = new Audio('punk.mp3');

// Para que ambos audios puedan reproducirse automáticamente
loopIntro.loop = true;
punk.loop = false;

document.getElementById('playButton').addEventListener('click', () => {
  // Inicia loop introductorio
  loopIntro.play();

  // Fetch a la IA para generar bienvenida
  fetch('/api/bienvenida')
    .then(response => response.json())
    .then(data => {
      // Detener ambos audios cuando llega la voz de la IA
      loopIntro.pause();
      loopIntro.currentTime = 0;
      punk.pause();
      punk.currentTime = 0;

      // Reproduce la bienvenida generada por Eleven Labs
      audioElement.src = data.audioUrl;
      audioElement.play();
    })
    .catch(err => {
      console.error('Error:', err);
    });

  // Mientras espera la respuesta, empieza la música punk
  punk.play();
});