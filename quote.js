const quotes = [
  "lock in. nobody’s coming to save the vision.",
  "romanticize the grind until the results become undeniable.",
  "quiet work. loud results.",
  "you don’t need motivation. you need to stop negotiating with yourself.",
  "building in silence because explaining the vision is exhausting.",
  "one day the “delusional” era is gonna look like the origin story.",
  "less announcing. more executing.",
  "discipline is just keeping promises to the version of you that you haven’t met yet.",
  "stop waiting to feel ready. start messy.",
  "the goal isn’t to look busy. it’s to become dangerous at what you do.",
  "your future self is watching you waste another hour. lock in.",
  "nobody sees the boring days. everybody sees the results.",
  "protect your focus like it’s your bag.",
  "you said you wanted a different life. act accordingly.",
  "get obsessed with becoming better, not being seen becoming better.",
  "the comeback starts looking boring before it starts looking impressive.",
  "no hype. no excuses. just reps.",
  "outwork your old habits, not everyone around you.",
  "your 9–5 can pay the bills. your 6–10 can build the dream.",
  "locked in so hard that “what if” became “watch me.”",
  "make the plan so clear that action becomes the obvious next step.",
  "small progress still counts when nobody is clapping for it.",
  "focus is choosing what matters and letting the rest stay quiet.",
  "build something your future self will be proud to inherit.",
  "consistency turns ordinary effort into an extraordinary result.",
  "the hard days are still part of the work.",
  "move with patience, but never confuse patience with standing still.",
  "your standards become your surroundings when you practice them daily.",
  "keep showing up until the work starts speaking for you.",
  "clarity arrives after the first honest attempt.",
  "make room for the version of you that is still becoming.",
  "the quiet season is still a season of growth.",
  "one focused hour can change the direction of an entire day.",
  "do the next useful thing, then let momentum take over.",
  "confidence is built from promises kept in private.",
  "let the results be the announcement.",
  "you are allowed to begin before the path is perfectly clear.",
  "keep your eyes on the practice, not the applause.",
  "a better life is made from better ordinary choices.",
  "stay close to the work that makes you feel most alive."
];

const posterImages = [
  {
    image: "url('https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1200&q=85')",
    color: '#d98265'
  },
  {
    image: "url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=85')",
    color: '#6b8f71'
  },
  {
    image: "url('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=1200&q=85')",
    color: '#4d7c8a'
  },
  {
    image: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85')",
    color: '#6f6a9a'
  },
  {
    image: "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85')",
    color: '#a87554'
  },
  {
    image: "url('https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=85')",
    color: '#a87589'
  }
];

const moveButton = document.querySelector('#moveButton');
const quote = document.querySelector('h1');
const quoteCard = document.querySelector('#quote');
const downloadButton = document.querySelector('#downloadButton');
let imageIndex = 0;
let clickAudioContext;
let windSoundStarted = false;

function startWindSound() {
  if (windSoundStarted || !clickAudioContext) {
    return;
  }

  const bufferLength = clickAudioContext.sampleRate * 2;
  const windBuffer = clickAudioContext.createBuffer(1, bufferLength, clickAudioContext.sampleRate);
  const windData = windBuffer.getChannelData(0);

  for (let sampleIndex = 0; sampleIndex < bufferLength; sampleIndex += 1) {
    windData[sampleIndex] = Math.random() * 2 - 1;
  }

  const windSource = clickAudioContext.createBufferSource();
  const windFilter = clickAudioContext.createBiquadFilter();
  const windGain = clickAudioContext.createGain();
  const windLfo = clickAudioContext.createOscillator();
  const windLfoDepth = clickAudioContext.createGain();

  windSource.buffer = windBuffer;
  windSource.loop = true;
  windFilter.type = 'lowpass';
  windFilter.frequency.value = 620;
  windGain.gain.value = 0.012;
  windLfo.frequency.value = 0.08;
  windLfoDepth.gain.value = 0.008;

  windSource.connect(windFilter);
  windFilter.connect(windGain);
  windGain.connect(clickAudioContext.destination);
  windLfo.connect(windLfoDepth);
  windLfoDepth.connect(windGain.gain);
  windSource.start();
  windLfo.start();
  windSoundStarted = true;
}

function playClickSound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) {
    return;
  }

  clickAudioContext ??= new AudioContext();
  if (clickAudioContext.state === 'suspended') {
    clickAudioContext.resume();
  }

  const oscillator = clickAudioContext.createOscillator();
  const clickGain = clickAudioContext.createGain();
  const startTime = clickAudioContext.currentTime;

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(220, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(90, startTime + 0.07);
  clickGain.gain.setValueAtTime(0.18, startTime);
  clickGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.07);
  oscillator.connect(clickGain);
  clickGain.connect(clickAudioContext.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + 0.07);
}

moveButton.addEventListener('click', () => {
  playClickSound();
  startWindSound();
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quote.textContent = quotes[randomIndex];
  imageIndex = (imageIndex + 1) % posterImages.length;
  quoteCard.style.setProperty('--quote-image', posterImages[imageIndex].image);
  quoteCard.style.setProperty('--poster-color', posterImages[imageIndex].color);
  quote.classList.remove('quote-reveal');
  void quote.offsetWidth;
  quote.classList.add('quote-reveal');
});

downloadButton.addEventListener('click', async () => {
  if (typeof html2canvas === 'undefined') {
    return;
  }

  downloadButton.disabled = true;
  downloadButton.textContent = 'Preparing...';

  try {
    const posterCanvas = await html2canvas(quoteCard, {
      useCORS: true,
      backgroundColor: null,
      scale: Math.min(window.devicePixelRatio * 2, 3),
      logging: false
    });
    const downloadLink = document.createElement('a');

    downloadLink.download = 'grind-quote-poster.png';
    downloadLink.href = posterCanvas.toDataURL('image/png');
    downloadLink.click();
  } finally {
    downloadButton.disabled = false;
    downloadButton.textContent = 'Download Poster';
  }
});
