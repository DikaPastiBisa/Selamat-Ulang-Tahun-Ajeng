// Tunggu sampai DOM selesai dimuat
document.addEventListener('DOMContentLoaded', function() {
  // Fungsi untuk memainkan confetti dan suara
  function playConfetti() {
    // Mainkan suara confetti (happy birthday)
    const confettiSound = document.getElementById('confetti-sound');
    if (confettiSound) {
      confettiSound.play().catch(e => console.log('Autoplay prevented:', e));
    }
    
    // Buat efek confetti beberapa kali dengan interval
    const confettiCount = 20; // Jumlah letusan confetti
    const delayBetween = 1000; // Delay antara letusan (ms)
    
    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        // Letusan dari tengah
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
        });
        
        // Letusan dari kiri dan kanan
        if (i % 2 === 0) {
          confetti({
            particleCount: 80,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ff0000', '#ffff00', '#ffffff']
          });
        } else {
          confetti({
            particleCount: 80,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#00ff00', '#00ffff', '#ffffff']
          });
        }
      }, i * delayBetween);
    }
  }

  // Loading progress bar
  let progress = 0;
  let bar = document.getElementById('progress');

  // Reset visual progress bar ke 0
  bar.style.width = `0%`;
  bar.textContent = `0%`;

  let interval = setInterval(() => {
    progress += 4;
    if (progress > 100) progress = 100;
    bar.style.width = `${progress}%`;
    bar.textContent = `${progress}%`;

    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('main-screen').classList.remove('hidden');
        // Tambahkan confetti saat loading selesai
        playConfetti();
      }, 800);
    }
  }, 150);
  
  // Inisialisasi game Tetris
  initTetris();
  
  // Setup pemutar musik
  setupMusicPlayer();
});

// Fungsi untuk menampilkan halaman tertentu
function showPage(pageId) {
  // Sembunyikan semua screen
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => {
    screen.classList.add('hidden');
  });
  
  // Tampilkan halaman yang dipilih
  document.getElementById(pageId).classList.remove('hidden');
  
  // Jika halaman tetris yang dibuka, perbarui tampilan grid
  if (pageId === 'tetris' && isGameRunning) {
    drawTetrisGrid();
  }
}

// Fungsi untuk kembali ke main screen
function backToMain() {
  // Sembunyikan semua screen
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => {
    screen.classList.add('hidden');
  });
  
  // Tampilkan main screen
  document.getElementById('main-screen').classList.remove('hidden');
  
  // Pause musik saat kembali ke menu utama
  pauseAllMusic();
  
  // Jika dari game tetris, pause game
  if (!document.getElementById('tetris').classList.contains('hidden')) {
    isPaused = true;
  }
}

// Fungsi untuk menjeda semua musik
function pauseAllMusic() {
  const allAudio = document.querySelectorAll('audio');
  allAudio.forEach(audio => {
    audio.pause();
    updatePlayButtons();
  });
}

// Fungsi untuk navigasi foto
function nextGalleryPhoto() {
  // Implementasi pergantian foto (placeholder)
  alert('Menampilkan foto berikutnya...');
}

// ==================== SETUP MUSIC PLAYER ====================
function setupMusicPlayer() {
  // Data lagu playlist
  const playlist = [
    {
      title: "Lesung Pipi - Raim Laode",
      file: "musik/Lesung Pipi - Raina Laode ( Senja R.mp3",
      duration: "4:30"
    },
    {
      title: "Pilihanku - MALIQ & D'Essentials", 
      file: "musik/MALIQ & D'Essentials - Pilihanku (Official Music Video).mp3",
      duration: "3:32"
    },
    {
      title: "Sahabat Sejati - Sheila On 7",
      file: "musik/Sheila On 7 - Sahabat Sejati (Official Audio).mp3",
      duration: "3:44"
    },
    {
      title: "Teman Hidup - TULUS",
      file: "musik/TULUS - Teman Hidup (Official Music Video).mp3",
      duration: "3:42"
    },
     {
      title: "Mangu - Fourtwnty ",
      file: "musik/Fourtwnty - Mangu ft. Charita Utami ( Official Lyric Video ).mp3",
      duration: "4:31"
    }
  ];

  // Dapatkan elemen-elemen DOM untuk player
  let currentTrack = 0;
  const audioPlayer = document.getElementById('main-audio');
  
  // Debug: Cek apakah elemen ditemukan
  console.log('Audio player element:', audioPlayer);
  
  // Pastikan elemen ada sebelum mengakses
  if (!audioPlayer) {
    console.error('Audio player element not found!');
    return;
  }
  
  // Dapatkan tombol-tombol kontrol
  const playBtn = document.querySelector('.play-btn');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const mediaPlayBtn = document.querySelectorAll('.media-btn')[1];
  const mediaPrevBtn = document.querySelectorAll('.media-btn')[0];
  const mediaNextBtn = document.querySelectorAll('.media-btn')[2];
  const currentTimeElement = document.querySelector('.current-time');
  const durationElement = document.querySelector('.duration');
  const progressBar = document.querySelector('.player-progress .progress');
  const playlistItems = document.querySelectorAll('.playlist-item');

  // Debug: Cek tombol-tombol
  console.log('Play button:', playBtn);
  console.log('Prev button:', prevBtn);
  console.log('Next button:', nextBtn);

  // Fungsi untuk memuat dan memainkan lagu
  function loadTrack(trackIndex) {
    if (trackIndex < 0) trackIndex = playlist.length - 1;
    if (trackIndex >= playlist.length) trackIndex = 0;
    
    currentTrack = trackIndex;
    const track = playlist[currentTrack];
    
    console.log("Mencoba memuat:", track.file);
    
    // Reset error handler
    audioPlayer.onerror = null;
    
    audioPlayer.src = track.file;
    audioPlayer.load();
    
    // Perbarui UI
    if (durationElement) {
      durationElement.textContent = track.duration;
    }
    
    if (currentTimeElement) {
      currentTimeElement.textContent = "0:00";
    }
    
    // Update playlist highlight
    playlistItems.forEach((item, index) => {
      item.classList.toggle('active', index === currentTrack);
    });
    
    // Update judul lagu
    const songTitle = document.querySelector('.song-title');
    if (songTitle) {
      songTitle.textContent = track.title;
    }
    
    // Error handling
    audioPlayer.addEventListener('error', function() {
      console.error("Error audio:", audioPlayer.error);
      alert(`Gagal memuat: ${track.title}\nPastikan file ada di: ${track.file}`);
    });
  }

  // Fungsi untuk memainkan/menjeda lagu
  function playPauseTrack() {
    if (audioPlayer.paused) {
      audioPlayer.play().catch(e => {
        console.error("Error playing audio:", e);
        alert("Gagal memutar audio. Pastikan file musik tersedia.");
      });
      updatePlayButtons();
    } else {
      audioPlayer.pause();
      updatePlayButtons();
    }
  }

  // Fungsi untuk memperbarui tombol play
  function updatePlayButtons() {
    if (audioPlayer.paused) {
      if (playBtn) playBtn.textContent = '▶️';
      if (mediaPlayBtn) mediaPlayBtn.textContent = '▶️';
    } else {
      if (playBtn) playBtn.textContent = '⏸';
      if (mediaPlayBtn) mediaPlayBtn.textContent = '⏸';
    }
  }

  // Fungsi untuk lagu berikutnya
  function nextTrack() {
    loadTrack(currentTrack + 1);
    audioPlayer.play().catch(e => {
      console.error("Error playing next track:", e);
    });
  }

  // Fungsi untuk lagu sebelumnya
  function prevTrack() {
    loadTrack(currentTrack - 1);
    audioPlayer.play().catch(e => {
      console.error("Error playing previous track:", e);
    });
  }

  // Pasang event listeners
  if (playBtn) {
    playBtn.addEventListener('click', playPauseTrack);
  } else {
    console.error('Play button not found!');
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', prevTrack);
  } else {
    console.error('Previous button not found!');
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', nextTrack);
  } else {
    console.error('Next button not found!');
  }
  
  if (mediaPlayBtn) {
    mediaPlayBtn.addEventListener('click', playPauseTrack);
  }
  
  if (mediaPrevBtn) {
    mediaPrevBtn.addEventListener('click', prevTrack);
  }
  
  if (mediaNextBtn) {
    mediaNextBtn.addEventListener('click', nextTrack);
  }

  // Update progress saat audio berjalan
  audioPlayer.addEventListener('timeupdate', () => {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration || 1;
    const progressPercent = (currentTime / duration) * 100;
    
    // Format waktu saat ini
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60).toString().padStart(2, '0');
    
    if (currentTimeElement) {
      currentTimeElement.textContent = `${minutes}:${seconds}`;
    }
    
    // Update progress bar
    if (progressBar) {
      progressBar.style.width = `${progressPercent}%`;
    }
  });

  // Event listener untuk akhir lagu
  audioPlayer.addEventListener('ended', nextTrack);

  // Event listeners untuk item playlist
  playlistItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      loadTrack(index);
      audioPlayer.play().catch(e => {
        console.error("Error playing track:", e);
      });
    });
  });

  // Load lagu pertama saat halaman dimuat
  loadTrack(0);
  
  // Event listener untuk klik pada progress bar
  const playerProgressBar = document.querySelector('.player-progress .progress-bar');
  if (playerProgressBar) {
    playerProgressBar.addEventListener('click', function(e) {
      const width = this.clientWidth;
      const clickX = e.offsetX;
      const duration = audioPlayer.duration;
      
      if (duration) {
        audioPlayer.currentTime = (clickX / width) * duration;
      }
    });
  }
  
  // Tambahkan event listener untuk tombol space sebagai play/pause
  document.addEventListener('keydown', function(e) {
    if (!document.getElementById('music').classList.contains('hidden') && e.code === 'Space') {
      e.preventDefault();
      playPauseTrack();
    }
  });
}

// ==================== TETRIS GAME ====================
// Variabel game Tetris
let tetrisGrid = [];
let currentPiece = null;
let nextPiece = null;
let tetrisScore = 0;
let tetrisLevel = 1;
let tetrisLines = 0;
let gameInterval = null;
let gameSpeed = 1000; // Kecepatan awal (ms)
let isPaused = false;
let isGameRunning = false;

// Warna untuk setiap bentuk Tetris
const tetrisColors = [
  null,
  '#FF0D72', // I
  '#0DC2FF', // J
  '#0DFF72', // L
  '#F538FF', // O
  '#FF8E0D', // S
  '#FFE138', // T
  '#3877FF'  // Z
];

// Bentuk-bentuk Tetris
const tetrisShapes = [
  null,
  [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], // I
  [[2, 0, 0], [2, 2, 2], [0, 0, 0]],                         // J
  [[0, 0, 3], [3, 3, 3], [0, 0, 0]],                         // L
  [[0, 4, 4], [0, 4, 4], [0, 0, 0]],                         // O
  [[0, 5, 5], [5, 5, 0], [0, 0, 0]],                         // S
  [[0, 6, 0], [6, 6, 6], [0, 0, 0]],                         // T
  [[7, 7, 0], [0, 7, 7], [0, 0, 0]]                          // Z
];

// Inisialisasi grid Tetris
function initTetrisGrid() {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    grid.push(Array(10).fill(0));
  }
  return grid;
}

// Fungsi untuk membuat grid Tetris
function createTetrisGrid() {
  const grid = document.getElementById('tetris-grid');
  if (!grid) return;
  
  grid.innerHTML = '';
  
  // Buat grid 10x20 untuk Tetris
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = document.createElement('div');
      cell.className = 'tetris-cell';
      cell.dataset.row = i;
      cell.dataset.col = j;
      grid.appendChild(cell);
    }
  }

  // Buat juga next piece grid
  const nextPieceGrid = document.getElementById('next-piece-grid');
  if (nextPieceGrid) {
    nextPieceGrid.innerHTML = '';
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const cell = document.createElement('div');
        cell.className = 'next-piece-cell';
        nextPieceGrid.appendChild(cell);
      }
    }
  }
}

// Buat piece baru secara acak
function createNewPiece() {
  const shapeIndex = Math.floor(Math.random() * 7) + 1;
  const shape = JSON.parse(JSON.stringify(tetrisShapes[shapeIndex])); // Deep copy array
  return {
    shape: shape,
    color: tetrisColors[shapeIndex],
    pos: {x: 3, y: 0}
  };
}

// Gambar grid Tetris
function drawTetrisGrid() {
  const gridElement = document.getElementById('tetris-grid');
  if (!gridElement) return;
  
  // Reset semua cell
  const cells = gridElement.querySelectorAll('.tetris-cell');
  cells.forEach(cell => {
    cell.style.backgroundColor = '#0a192f';
  });
  
  // Gambar tetris grid (background)
  for (let y = 0; y < 20; y++) {
    for (let x = 0; x < 10; x++) {
      if (tetrisGrid[y] && tetrisGrid[y][x]) {
        const cell = gridElement.querySelector(`.tetris-cell[data-row="${y}"][data-col="${x}"]`);
        if (cell) {
          cell.style.backgroundColor = tetrisColors[tetrisGrid[y][x]];
        }
      }
    }
  }
  
  // Gambar current piece
  if (currentPiece) {
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const pieceY = currentPiece.pos.y + y;
          const pieceX = currentPiece.pos.x + x;
          
          if (pieceY >= 0 && pieceY < 20 && pieceX >= 0 && pieceX < 10) {
            const cell = gridElement.querySelector(`.tetris-cell[data-row="${pieceY}"][data-col="${pieceX}"]`);
            if (cell) {
              cell.style.backgroundColor = currentPiece.color;
            }
          }
        }
      }
    }
  }
  
  // Gambar next piece
  drawNextPiece();
}

// Gambar next piece
function drawNextPiece() {
  const nextPieceGrid = document.getElementById('next-piece-grid');
  if (!nextPieceGrid) return;
  
  // Reset semua cell
  const cells = nextPieceGrid.querySelectorAll('.next-piece-cell');
  cells.forEach(cell => {
    cell.style.backgroundColor = '#0a192f';
  });
  
  if (nextPiece) {
    const shape = nextPiece.shape;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const index = y * 4 + x;
          if (cells[index]) {
            cells[index].style.backgroundColor = nextPiece.color;
          }
        }
      }
    }
  }
}

// Cek apakah posisi (x,y) ada di current piece
function isInCurrentPiece(x, y) {
  if (!currentPiece) return false;
  
  for (let py = 0; py < currentPiece.shape.length; py++) {
    for (let px = 0; px < currentPiece.shape[py].length; px++) {
      if (currentPiece.shape[py][px] &&
          currentPiece.pos.x + px === x &&
          currentPiece.pos.y + py === y) {
        return true;
      }
    }
  }
  return false;
}

// Gerakkan piece ke kiri
function movePieceLeft() {
  if (!currentPiece || isPaused || !isGameRunning) return;
  
  currentPiece.pos.x--;
  if (checkCollision()) {
    currentPiece.pos.x++; // Batalkan gerakan jika collision
  } else {
    drawTetrisGrid();
  }
}

// Gerakkan piece ke kanan
function movePieceRight() {
  if (!currentPiece || isPaused || !isGameRunning) return;
  
  currentPiece.pos.x++;
  if (checkCollision()) {
    currentPiece.pos.x--; // Batalkan gerakan jika collision
  } else {
    drawTetrisGrid();
  }
}

// Putar piece
function rotatePiece() {
  if (!currentPiece || isPaused || !isGameRunning) return;
  
  const originalShape = JSON.parse(JSON.stringify(currentPiece.shape)); // Deep copy
  
  // Transpose matrix
  const rows = currentPiece.shape.length;
  const cols = currentPiece.shape[0].length;
  const newShape = Array(cols).fill().map(() => Array(rows).fill(0));
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      newShape[x][rows - 1 - y] = currentPiece.shape[y][x];
    }
  }
  
  currentPiece.shape = newShape;
  if (checkCollision()) {
    currentPiece.shape = originalShape; // Batalkan rotasi jika collision
  } else {
    drawTetrisGrid();
  }
}

// Cek collision
function checkCollision() {
  if (!currentPiece) return false;
  
  for (let y = 0; y < currentPiece.shape.length; y++) {
    for (let x = 0; x < currentPiece.shape[y].length; x++) {
      if (currentPiece.shape[y][x] !== 0) {
        const newX = currentPiece.pos.x + x;
        const newY = currentPiece.pos.y + y;
        
        // Cek batas grid
        if (newX < 0 || newX >= 10 || newY >= 20) {
          return true;
        }
        
        // Cek tabrakan dengan piece lain
        if (newY >= 0 && tetrisGrid[newY] && tetrisGrid[newY][newX]) {
          return true;
        }
      }
    }
  }
  return false;
}

// Gerakkan piece ke bawah (dipanggil secara otomatis)
function movePieceDown() {
  if (!currentPiece || isPaused || !isGameRunning) return;
  
  currentPiece.pos.y++;
  if (checkCollision()) {
    currentPiece.pos.y--; // Batalkan gerakan
    lockPiece(); // Kunci piece di tempat
    clearLines(); // Cek baris yang penuh
    spawnNewPiece(); // Buat piece baru
  }
  drawTetrisGrid();
}

// Kunci piece di grid
function lockPiece() {
  if (!currentPiece) return;
  
  for (let y = 0; y < currentPiece.shape.length; y++) {
    for (let x = 0; x < currentPiece.shape[y].length; x++) {
      if (currentPiece.shape[y][x]) {
        const gridY = currentPiece.pos.y + y;
        const gridX = currentPiece.pos.x + x;
        
        if (gridY >= 0) {
          // Pastikan grid ada sebelum mengakses
          if (!tetrisGrid[gridY]) tetrisGrid[gridY] = Array(10).fill(0);
          tetrisGrid[gridY][gridX] = currentPiece.shape[y][x];
        } else {
          // Game over jika piece terkunci di atas grid
          gameOver();
          return;
        }
      }
    }
  }
}

// Bersihkan baris yang sudah penuh
function clearLines() {
  let linesCleared = 0;
  
  for (let y = 19; y >= 0; y--) {
    if (tetrisGrid[y] && tetrisGrid[y].every(cell => cell !== 0)) {
      // Geser semua baris di atasnya ke bawah
      for (let ny = y; ny > 0; ny--) {
        tetrisGrid[ny] = [...tetrisGrid[ny - 1]];
      }
      tetrisGrid[0] = Array(10).fill(0);
      y++; // Periksa baris yang sama lagi
      linesCleared++;
    }
  }
  
  if (linesCleared > 0) {
    // Update score
    tetrisLines += linesCleared;
    tetrisScore += linesCleared * linesCleared * 100 * tetrisLevel;
    
    // Naik level setiap 10 lines
    const newLevel = Math.floor(tetrisLines / 10) + 1;
    if (newLevel > tetrisLevel) {
      tetrisLevel = newLevel;
      gameSpeed = Math.max(100, 1000 - (tetrisLevel - 1) * 100);
      resetGameInterval();
    }
    
    updateScoreDisplay();
  }
}

// Reset interval game dengan kecepatan baru
function resetGameInterval() {
  if (gameInterval) {
    clearInterval(gameInterval);
    gameInterval = setInterval(movePieceDown, gameSpeed);
  }
}

// Buat piece baru
function spawnNewPiece() {
  currentPiece = nextPiece || createNewPiece();
  nextPiece = createNewPiece();
  
  // Cek game over
  if (checkCollision()) {
    gameOver();
  }
}

// Update tampilan score
function updateScoreDisplay() {
  const scoreElement = document.getElementById('tetris-score');
  const levelElement = document.getElementById('tetris-level');
  const linesElement = document.getElementById('tetris-lines');
  
  if (scoreElement) scoreElement.textContent = tetrisScore;
  if (levelElement) levelElement.textContent = tetrisLevel;
  if (linesElement) linesElement.textContent = tetrisLines;
}

// Game over
function gameOver() {
  clearInterval(gameInterval);
  isGameRunning = false;
  alert(`Game Over!\nSkor Akhir: ${tetrisScore}\nLevel: ${tetrisLevel}\nLines: ${tetrisLines}`);
  
  // Update tombol
  const startBtn = document.getElementById('start-tetris');
  const pauseBtn = document.getElementById('pause-tetris');
  if (startBtn) startBtn.textContent = 'MULAI LAGI';
  if (pauseBtn) pauseBtn.textContent = 'JEDA';
}

// Mulai game
function startTetrisGame() {
  // Reset game state
  tetrisGrid = initTetrisGrid();
  tetrisScore = 0;
  tetrisLevel = 1;
  tetrisLines = 0;
  isPaused = false;
  isGameRunning = true;
  gameSpeed = 1000;
  
  // Buat piece pertama
  currentPiece = createNewPiece();
  nextPiece = createNewPiece();
  
  // Update tampilan
  updateScoreDisplay();
  drawTetrisGrid();
  
  // Mulai game loop
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(movePieceDown, gameSpeed);
  
  // Update tombol
  const startBtn = document.getElementById('start-tetris');
  const pauseBtn = document.getElementById('pause-tetris');
  if (startBtn) startBtn.textContent = 'MULAI LAGI';
  if (pauseBtn) pauseBtn.textContent = 'JEDA';
}

// Jeda/lanjutkan game
function togglePause() {
  if (!isGameRunning) return;
  
  isPaused = !isPaused;
  const pauseBtn = document.getElementById('pause-tetris');
  if (pauseBtn) pauseBtn.textContent = isPaused ? 'LANJUT' : 'JEDA';
}

// Inisialisasi game Tetris
function initTetris() {
  console.log("Menginisialisasi Tetris game...");
  
  // Buat grid Tetris
  createTetrisGrid();
  
  // Setup event listeners
  const startBtn = document.getElementById('start-tetris');
  const pauseBtn = document.getElementById('pause-tetris');
  const moveLeftBtn = document.getElementById('move-left');
  const moveRightBtn = document.getElementById('move-right');
  const rotateBtn = document.getElementById('rotate-btn');
  
  if (startBtn) {
    startBtn.addEventListener('click', startTetrisGame);
    console.log("Start button listener added");
  } else {
    console.error("Start button not found!");
  }
  
  if (pauseBtn) {
    pauseBtn.addEventListener('click', togglePause);
    console.log("Pause button listener added");
  } else {
    console.error("Pause button not found!");
  }
  
  if (moveLeftBtn) {
    moveLeftBtn.addEventListener('click', movePieceLeft);
    console.log("Move left button listener added");
  } else {
    console.error("Move left button not found!");
  }
  
  if (moveRightBtn) {
    moveRightBtn.addEventListener('click', movePieceRight);
    console.log("Move right button listener added");
  } else {
    console.error("Move right button not found!");
  }
  
  if (rotateBtn) {
    rotateBtn.addEventListener('click', rotatePiece);
    console.log("Rotate button listener added");
  } else {
    console.error("Rotate button not found!");
  }
  
  // Tambahkan keyboard event listener untuk Tetris
  document.addEventListener('keydown', function(e) {
    if (!document.getElementById('tetris').classList.contains('hidden')) {
      console.log("Key pressed:", e.key);
      switch (e.key) {
        case 'ArrowLeft': 
          movePieceLeft(); 
          break;
        case 'ArrowRight': 
          movePieceRight(); 
          break;
        case 'ArrowDown': 
          movePieceDown(); 
          break;
        case 'ArrowUp': 
          rotatePiece(); 
          break;
        case ' ':
          if (e.target === document.body) {
            e.preventDefault(); // Mencegah scroll halaman
            togglePause();
          }
          break;
      }
    }
  });

  // Debug status
  console.log("Tetris initialization complete");
}


  document.addEventListener("DOMContentLoaded", () => {
    const audio = document.getElementById("confetti-sound");
    const loadingScreen = document.getElementById("loading-screen");
    const mainScreen = document.getElementById("main-screen");
    const progressElem = document.getElementById("progress");

    let progress = 0;
    const loadingInterval = setInterval(() => {
      progress++;
      progressElem.textContent = `${progress}%`;
      progressElem.style.width = `${progress}%`;

      if (progress >= 100) {
        clearInterval(loadingInterval);

    

        loadingScreen.style.cursor = "pointer";

        loadingScreen.addEventListener("click", async () => {
          try {
            await audio.play();  // wajib await agar play() dijalankan saat event klik
            loadingScreen.classList.add("hidden");
            mainScreen.classList.remove("hidden");
          } catch (error) {
            console.error("Gagal memutar audio:", error);
            alert("Klik tombol play di halaman utama untuk memulai musik.");
            loadingScreen.classList.add("hidden");
            mainScreen.classList.remove("hidden");
          }
        }, { once: true });
      }
    }, 20);
  });
