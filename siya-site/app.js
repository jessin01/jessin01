/* =========================================================
   Siya's Playhouse — interactions
   Everything is offline: speech uses the device's own voice.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- sound ---------- */
  var soundOn = true;
  var synth = window.speechSynthesis || null;

  function say(text, pitch, rate) {
    if (!soundOn || !synth || !text) return;
    try {
      synth.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.pitch = pitch || 1.3;
      u.rate = rate || 0.85;
      u.volume = 1;
      u.lang = 'en-GB';
      synth.speak(u);
    } catch (e) { /* speech unavailable — the visuals still work */ }
  }

  var toggle = document.getElementById('soundToggle');
  toggle.addEventListener('click', function () {
    soundOn = !soundOn;
    toggle.setAttribute('aria-pressed', String(soundOn));
    document.getElementById('soundIco').textContent = soundOn ? '🔊' : '🔇';
    document.getElementById('soundLabel').textContent = soundOn ? 'Sound on' : 'Sound off';
    if (!soundOn && synth) synth.cancel();
    else say('Sound on');
  });

  /* ---------- confetti ---------- */
  var confettiLayer = document.getElementById('confetti');
  var CONFETTI_COLOURS = ['#ff8fb1', '#ffd166', '#7ee0c0', '#78c9ff', '#b48cf2', '#ffb26b'];

  function confetti(count) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (var i = 0; i < (count || 26); i++) {
      var bit = document.createElement('span');
      bit.className = 'confetti';
      bit.style.left = Math.random() * 100 + 'vw';
      bit.style.background = CONFETTI_COLOURS[i % CONFETTI_COLOURS.length];
      bit.style.animationDuration = (1.9 + Math.random() * 1.4) + 's';
      bit.style.animationDelay = (Math.random() * 0.35) + 's';
      confettiLayer.appendChild(bit);
      (function (node) {
        setTimeout(function () { node.remove(); }, 3800);
      })(bit);
    }
  }

  /* =========================================================
     1. ALPHABET
     ========================================================= */
  var ALPHABET = [
    ['A', 'Apple', '🍎'], ['B', 'Ball', '⚽'], ['C', 'Cat', '🐱'], ['D', 'Duck', '🦆'],
    ['E', 'Elephant', '🐘'], ['F', 'Fish', '🐟'], ['G', 'Giraffe', '🦒'], ['H', 'Hat', '🎩'],
    ['I', 'Ice cream', '🍦'], ['J', 'Jelly', '🍮'], ['K', 'Kite', '🪁'], ['L', 'Lion', '🦁'],
    ['M', 'Moon', '🌙'], ['N', 'Nest', '🪺'], ['O', 'Orange', '🍊'], ['P', 'Panda', '🐼'],
    ['Q', 'Queen', '👑'], ['R', 'Rainbow', '🌈'], ['S', 'Star', '⭐'], ['T', 'Train', '🚂'],
    ['U', 'Umbrella', '☂️'], ['V', 'Violin', '🎻'], ['W', 'Whale', '🐳'], ['X', 'Xylophone', '🎹'],
    ['Y', 'Yo-yo', '🪀'], ['Z', 'Zebra', '🦓']
  ];
  var KEY_COLOURS = ['#ff8fb1', '#ffb26b', '#ffd166', '#7ee0c0', '#78c9ff', '#b48cf2'];

  var abcGrid = document.getElementById('abcGrid');
  var abcCard = document.getElementById('abcCard');
  var abcEmoji = document.getElementById('abcEmoji');
  var abcLetter = document.getElementById('abcLetter');
  var abcWord = document.getElementById('abcWord');
  var activeKey = null;

  ALPHABET.forEach(function (entry, i) {
    var letter = entry[0], word = entry[1], emoji = entry[2];
    var key = document.createElement('button');
    key.type = 'button';
    key.className = 'abc-key';
    key.textContent = letter;
    key.style.background = KEY_COLOURS[i % KEY_COLOURS.length];
    key.style.color = '#fff';
    key.setAttribute('aria-label', letter + ' for ' + word);

    key.addEventListener('click', function () {
      if (activeKey) activeKey.classList.remove('on');
      key.classList.add('on');
      activeKey = key;

      abcEmoji.textContent = emoji;
      abcLetter.textContent = letter + ' ' + letter.toLowerCase();
      abcWord.textContent = word;
      abcCard.style.borderColor = KEY_COLOURS[i % KEY_COLOURS.length];
      replay(abcCard, 'pop');

      say(letter + '. ' + letter + ' is for ' + word + '.');
    });

    abcGrid.appendChild(key);
  });

  /* =========================================================
     2. COLOURS
     ========================================================= */
  var COLOURS = [
    ['Red', '#ef4b5c', false], ['Orange', '#ff9438', false], ['Yellow', '#ffd166', true],
    ['Green', '#4cbf7d', false], ['Blue', '#3d8ff0', false], ['Purple', '#9b6ae8', false],
    ['Pink', '#ff8fb1', false], ['Brown', '#a5713f', false], ['Black', '#2f2b39', false],
    ['White', '#ffffff', true]
  ];

  var colourBlobs = document.getElementById('colourBlobs');
  var colourCanvas = document.getElementById('colourCanvas');
  var colourName = document.getElementById('colourName');

  COLOURS.forEach(function (entry) {
    var name = entry[0], hex = entry[1], needsDarkText = entry[2];
    var blob = document.createElement('button');
    blob.type = 'button';
    blob.className = 'blob';
    blob.style.background = hex;
    if (name === 'White') blob.style.border = '4px solid #e6dfd4';
    blob.setAttribute('aria-label', name);

    blob.addEventListener('click', function () {
      colourCanvas.style.background = hex;
      colourName.textContent = name;
      colourName.classList.remove('idle');
      colourName.classList.toggle('dark', needsDarkText);
      say('This is ' + name + '!');
    });

    colourBlobs.appendChild(blob);
  });

  /* =========================================================
     3. COUNTING
     ========================================================= */
  var FRIENDS = ['🐥', '🐤', '🦆', '🐣', '🐦', '🐧', '🦢', '🕊️', '🐔', '🦉'];
  var NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five',
    'six', 'seven', 'eight', 'nine', 'ten'];
  var MAX_COUNT = 10;

  var countNumber = document.getElementById('countNumber');
  var countPond = document.getElementById('countPond');
  var countAdd = document.getElementById('countAdd');
  var countReset = document.getElementById('countReset');
  var count = 0;

  function renderEmptyPond() {
    countPond.innerHTML = '<span class="count-empty">The pond is empty - tap the button!</span>';
  }

  function resetCount() {
    count = 0;
    countNumber.textContent = '0';
    countAdd.disabled = false;
    countAdd.textContent = 'Add one more 🐥';
    renderEmptyPond();
  }

  countAdd.addEventListener('click', function () {
    if (count >= MAX_COUNT) return;
    if (count === 0) countPond.innerHTML = '';
    count++;

    var duck = document.createElement('span');
    duck.className = 'duck';
    duck.textContent = FRIENDS[(count - 1) % FRIENDS.length];
    countPond.appendChild(duck);

    countNumber.textContent = String(count);
    replay(countNumber, 'pop');

    if (count === MAX_COUNT) {
      countAdd.disabled = true;
      countAdd.textContent = 'Ten! All full 🎉';
      confetti(40);
      say('Ten! Well done!', 1.4, 0.8);
    } else {
      say(NUMBER_WORDS[count]);
    }
  });

  countReset.addEventListener('click', function () {
    resetCount();
    say('Let us count again!');
  });

  resetCount();

  /* =========================================================
     4. SHAPES  (inline SVG so they stay crisp at any size)
     ========================================================= */
  var SHAPES = [
    { name: 'Circle', fill: '#ff8fb1', svg: '<circle cx="44" cy="44" r="40"/>' },
    { name: 'Square', fill: '#78c9ff', svg: '<rect x="6" y="6" width="76" height="76" rx="8"/>' },
    { name: 'Triangle', fill: '#7ee0c0', svg: '<polygon points="44,4 84,80 4,80"/>' },
    { name: 'Star', fill: '#ffd166', svg: '<polygon points="44,3 55,32 86,33 61,52 70,82 44,64 18,82 27,52 2,33 33,32"/>' },
    { name: 'Heart', fill: '#ef7b8f', svg: '<path d="M44 80S6 56 6 30A22 22 0 0 1 44 18 22 22 0 0 1 82 30c0 26-38 50-38 50z"/>' },
    { name: 'Diamond', fill: '#b48cf2', svg: '<polygon points="44,2 86,44 44,86 2,44"/>' },
    { name: 'Oval', fill: '#ffb26b', svg: '<ellipse cx="44" cy="44" rx="42" ry="30"/>' },
    { name: 'Rectangle', fill: '#6fd3a8', svg: '<rect x="2" y="20" width="84" height="48" rx="7"/>' }
  ];

  var shapeGrid = document.getElementById('shapeGrid');

  SHAPES.forEach(function (shape) {
    var card = document.createElement('button');
    card.type = 'button';
    card.className = 'shape-card';
    card.innerHTML =
      '<span class="shape-art">' +
      '<svg viewBox="0 0 88 88" width="88" height="88" fill="' + shape.fill + '" aria-hidden="true">' +
      shape.svg + '</svg></span>' +
      '<span class="shape-name">' + shape.name + '</span>';
    card.setAttribute('aria-label', shape.name);

    card.addEventListener('click', function () {
      replay(card, 'wiggle');
      say('This is a ' + shape.name + '.');
    });

    shapeGrid.appendChild(card);
  });

  /* =========================================================
     5. ANIMALS
     ========================================================= */
  var ANIMALS = [
    ['Cow', '🐮', 'Moooo'], ['Dog', '🐶', 'Woof woof'], ['Cat', '🐱', 'Meow'],
    ['Duck', '🦆', 'Quack quack'], ['Sheep', '🐑', 'Baaa'], ['Lion', '🦁', 'Roooar'],
    ['Frog', '🐸', 'Ribbit'], ['Bee', '🐝', 'Bzzzz'], ['Horse', '🐴', 'Neigh'],
    ['Pig', '🐷', 'Oink oink'], ['Owl', '🦉', 'Hoo hoo'], ['Monkey', '🐵', 'Ooh ooh aah']
  ];

  var animalGrid = document.getElementById('animalGrid');

  ANIMALS.forEach(function (entry) {
    var name = entry[0], face = entry[1], sound = entry[2];
    var card = document.createElement('button');
    card.type = 'button';
    card.className = 'animal-card';
    card.innerHTML =
      '<span class="animal-face" aria-hidden="true">' + face + '</span>' +
      '<span class="animal-name">' + name + '</span>' +
      '<span class="animal-say">' + sound + '</span>';
    card.setAttribute('aria-label', name + ' says ' + sound);

    card.addEventListener('click', function () {
      replay(card, 'jump');
      say('The ' + name + ' says ' + sound + '!', 1.5, 0.8);
    });

    animalGrid.appendChild(card);
  });

  /* =========================================================
     6. RHYMES
     ========================================================= */
  var RHYMES = [
    {
      title: 'Twinkle Twinkle Little Star', ico: '⭐',
      words: 'Twinkle, twinkle, little star,\nHow I wonder what you are!\nUp above the world so high,\nLike a diamond in the sky.\n\nTwinkle, twinkle, little star,\nHow I wonder what you are!'
    },
    {
      title: 'The Wheels on the Bus', ico: '🚌',
      words: 'The wheels on the bus go round and round,\nRound and round, round and round.\nThe wheels on the bus go round and round,\nAll through the town.\n\nThe wipers go swish, swish, swish...\nThe horn goes beep, beep, beep...'
    },
    {
      title: 'Row, Row, Row Your Boat', ico: '🚣',
      words: 'Row, row, row your boat,\nGently down the stream.\nMerrily, merrily, merrily, merrily,\nLife is but a dream!'
    },
    {
      title: 'Baa, Baa, Black Sheep', ico: '🐑',
      words: 'Baa, baa, black sheep,\nHave you any wool?\nYes sir, yes sir,\nThree bags full!\n\nOne for the master,\nOne for the dame,\nAnd one for the little boy\nWho lives down the lane.'
    },
    {
      title: 'Incy Wincy Spider', ico: '🕷️',
      words: 'Incy Wincy Spider climbed up the water spout.\nDown came the rain and washed the spider out.\nOut came the sunshine and dried up all the rain,\nSo Incy Wincy Spider climbed up the spout again.'
    },
    {
      title: 'Rock-a-bye Baby', ico: '🌙',
      words: 'Rock-a-bye baby, on the treetop,\nWhen the wind blows, the cradle will rock.\nWhen the bough breaks, the cradle will fall,\nAnd down will come baby, cradle and all.'
    }
  ];

  var rhymeGrid = document.getElementById('rhymeGrid');

  RHYMES.forEach(function (rhyme, i) {
    var id = 'rhyme-body-' + i;
    var card = document.createElement('button');
    card.type = 'button';
    card.className = 'rhyme';
    card.setAttribute('aria-expanded', 'false');
    card.setAttribute('aria-controls', id);
    card.innerHTML =
      '<span class="rhyme-top">' +
      '<span class="rhyme-ico" aria-hidden="true">' + rhyme.ico + '</span>' +
      '<span class="rhyme-title">' + rhyme.title + '</span>' +
      '<span class="rhyme-chev" aria-hidden="true">▾</span>' +
      '</span>' +
      '<span class="rhyme-body" id="' + id + '"><span><span class="rhyme-words">' +
      rhyme.words + '</span></span></span>';

    card.addEventListener('click', function () {
      var open = card.getAttribute('aria-expanded') === 'true';
      card.setAttribute('aria-expanded', String(!open));
    });

    rhymeGrid.appendChild(card);
  });

  /* ---------- helper: restart a CSS animation class ---------- */
  function replay(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth; // force reflow so the animation runs again
    el.classList.add(cls);
  }

  /* ---------- a small welcome sparkle ---------- */
  window.addEventListener('load', function () {
    setTimeout(function () { confetti(20); }, 400);
  });
})();
