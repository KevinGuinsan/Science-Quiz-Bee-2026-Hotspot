/**
 * Core Host Engine (host-app.js)
 * Shared WebRTC Controller, Permanent Score Registry & Millisecond Precision Timer
 */

let peer = null;
let roomCode = "";

let playerRegistry = {}; 
let socketMap = {};

let activeDataset = [];
let currentQuestionIndex = 0;
let currentQuestion = null;
let timerInterval = null;
let targetEndTime = 0;
let isTimerRunning = false;
let isQuestionFinished = false;

function initHostRoom() {
  roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
  const peerId = `quizbee-room-${roomCode}`;

  peer = new Peer(peerId);

  peer.on('open', () => {
    const codeDisplay = document.getElementById("room-code-display");
    if (codeDisplay) codeDisplay.textContent = roomCode;
    renderHostQRCode(roomCode);
  });

  peer.on('connection', (conn) => {
    conn.on('open', () => {
      const playerName = conn.metadata?.name || "Anonymous";
      const playerSection = conn.metadata?.section || "N/A";
      const persistentId = conn.metadata?.playerId || `${playerName}_${playerSection}`;
      const clientRoomCode = (conn.metadata?.roomCode || "").toUpperCase();

      if (clientRoomCode && clientRoomCode !== roomCode) {
        conn.close();
        return;
      }

      if (!playerRegistry[persistentId]) {
        playerRegistry[persistentId] = {
          persistentId: persistentId,
          name: playerName,
          section: playerSection,
          scores: { EASY: 0, MODERATE: 0, DIFFICULT: 0 },
          currentAnswer: null
        };
      }

      playerRegistry[persistentId].conn = conn;
      socketMap[conn.peer] = persistentId;

      updatePlayerListUI();
      broadcastLeaderboard();
    });

    conn.on('data', (payload) => {
      const pId = socketMap[conn.peer];
      if (payload.type === "SUBMIT_ANSWER") {
        handlePlayerAnswer(pId, payload.choiceIndex);
      } else if (payload.type === "REQUEST_STATE_SYNC") {
        syncStateToPlayer(conn.peer);
      }
    });

    conn.on('close', () => {
      delete socketMap[conn.peer];
      updatePlayerListUI();
    });
  });
}

function handlePlayerAnswer(persistentId, choiceIndex) {
  if (playerRegistry[persistentId] && isTimerRunning && !isQuestionFinished) {
    playerRegistry[persistentId].currentAnswer = choiceIndex;
  }
}

function gradeCurrentQuestion() {
  if (!currentQuestion) return;

  isQuestionFinished = true;
  const correctChoice = currentQuestion.correctAnswer;
  const cat = (currentQuestion.category || "EASY").toUpperCase();

  Object.values(playerRegistry).forEach(player => {
    if (player.currentAnswer === correctChoice) {
      player.scores[cat] = (player.scores[cat] || 0) + 1;
    }
  });

  broadcastPayload({ type: "REVEAL_ANSWER", correctAnswer: correctChoice });
  
  if (typeof revealHostAnswer === "function") {
    revealHostAnswer(correctChoice);
  }

  broadcastLeaderboard();
}

function broadcastLeaderboard() {
  const formattedScores = Object.values(playerRegistry).map(p => {
    const total = (p.scores.EASY || 0) + (p.scores.MODERATE || 0) + (p.scores.DIFFICULT || 0);
    return { name: p.name, section: p.section, total: total, scores: p.scores };
  }).sort((a, b) => b.total - a.total);

  updateScoreboardUI(formattedScores);

  broadcastPayload({
    type: "LEADERBOARD_UPDATE",
    scores: formattedScores
  });
}

function broadcastPayload(payload) {
  Object.values(playerRegistry).forEach(p => {
    if (p.conn && p.conn.open) {
      p.conn.send(payload);
    }
  });
}

function syncStateToPlayer(peerId) {
  const pId = socketMap[peerId];
  const player = playerRegistry[pId];
  if (!player || !player.conn) return;

  if (currentQuestion) {
    player.conn.send({
      type: "NEW_QUESTION",
      questionIndex: currentQuestionIndex,
      question: currentQuestion.question,
      category: currentQuestion.category || "EASY",
      options: currentQuestion.options
    });

    if (isTimerRunning) {
      const remainingMs = Math.max(0, targetEndTime - Date.now());
      player.conn.send({ type: "TIMER_STARTED", timeMs: remainingMs, endTime: targetEndTime });
    } else if (isQuestionFinished) {
      player.conn.send({ type: "TIME_UP" });
      player.conn.send({ type: "REVEAL_ANSWER", correctAnswer: currentQuestion.correctAnswer });
    } else {
      player.conn.send({ type: "RESET_TO_WAITING" });
    }
  }

  broadcastLeaderboard();
}

function changeQuestionSet(setKey) {
  if (typeof QUIZ_DATASETS !== "undefined" && QUIZ_DATASETS[setKey]) {
    activeDataset = QUIZ_DATASETS[setKey];
  } else if (typeof QUIZ_DATASET !== "undefined") {
    activeDataset = Array.isArray(QUIZ_DATASET) ? QUIZ_DATASET : (QUIZ_DATASET[setKey] || []);
  }
  currentQuestionIndex = 0;
}

function renderHostQRCode(code) {
  const qrContainer = document.getElementById("qrcode-container");
  if (!qrContainer) return;

  qrContainer.innerHTML = "";

  const origin = window.location.origin;
  const pathSegments = window.location.pathname.split('/').filter(Boolean);

  if (pathSegments.length > 0 && pathSegments[pathSegments.length - 1].endsWith('.html')) {
    pathSegments.pop();
  }
  if (pathSegments.length > 0 && pathSegments[pathSegments.length - 1].startsWith('grade')) {
    pathSegments.pop();
  }

  const basePath = pathSegments.length > 0 ? `/${pathSegments.join('/')}` : '';
  const playerTargetUrl = `${origin}${basePath}/player.html?room=${code}`;

  if (typeof QRCode !== "undefined") {
    new QRCode(qrContainer, {
      text: playerTargetUrl,
      width: 180,
      height: 180,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
  }
}

function sendQuestionToPlayers(questionIndex) {
  if (!activeDataset || !activeDataset[questionIndex]) return;

  isTimerRunning = false;
  isQuestionFinished = false;
  clearInterval(timerInterval);

  currentQuestionIndex = questionIndex;
  currentQuestion = activeDataset[questionIndex];

  Object.values(playerRegistry).forEach(p => {
    p.currentAnswer = null;
  });

  const payload = {
    type: "NEW_QUESTION",
    questionIndex: currentQuestionIndex,
    question: currentQuestion.question,
    category: currentQuestion.category || "EASY",
    options: currentQuestion.options
  };

  broadcastPayload(payload);

  if (typeof updateHostQuestionUI === "function") {
    updateHostQuestionUI();
  }
}

function getCategoryTimeLimit(category) {
  const cat = (category || "EASY").toUpperCase();
  if (cat === "EASY") return 10;
  if (cat === "MODERATE") return 15;
  if (cat === "DIFFICULT") return 20;
  return 15;
}

function startManualTimer() {
  clearInterval(timerInterval);
  isTimerRunning = true;
  isQuestionFinished = false;

  const durationSec = currentQuestion ? getCategoryTimeLimit(currentQuestion.category) : 10;
  const durationMs = durationSec * 1000;
  targetEndTime = Date.now() + durationMs;

  broadcastPayload({ type: "TIMER_STARTED", timeMs: durationMs, endTime: targetEndTime });

  timerInterval = setInterval(() => {
    const remainingMs = Math.max(0, targetEndTime - Date.now());

    const timerDisplay = document.getElementById("timer-display");
    if (timerDisplay) {
      const sec = Math.floor(remainingMs / 1000);
      const ms = Math.floor((remainingMs % 1000) / 10);
      timerDisplay.textContent = `${sec}.${ms < 10 ? '0' : ''}${ms}s`;
    }

    if (remainingMs <= 0) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      broadcastPayload({ type: "TIME_UP" });
      gradeCurrentQuestion();
    }
  }, 30);
}

function updatePlayerListUI() {
  const listEl = document.getElementById("player-list");
  if (!listEl) return;
  listEl.innerHTML = Object.values(playerRegistry)
    .map(p => `<li><strong>${p.name}</strong> (${p.section})</li>`).join("");
}

function updateScoreboardUI(scores) {
  const boardEl = document.getElementById("scoreboard-display");
  if (!boardEl) return;

  boardEl.innerHTML = scores
    .map(p => `<p><strong>${p.name}</strong> (${p.section}) — Easy: ${p.scores.EASY} | Mod: ${p.scores.MODERATE} | Diff: ${p.scores.DIFFICULT} | <strong>Total: ${p.total}</strong></p>`)
    .join("");
}

function exportScoresCSV() {
  let csvContent = "data:text/csv;charset=utf-8,Player Name,Section,Easy,Moderate,Difficult,Total Score\n";

  Object.values(playerRegistry).forEach(p => {
    const total = (p.scores.EASY || 0) + (p.scores.MODERATE || 0) + (p.scores.DIFFICULT || 0);
    csvContent += `"${p.name}","${p.section}",${p.scores.EASY},${p.scores.MODERATE},${p.scores.DIFFICULT},${total}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `QuizBee_Scores_Room_${roomCode}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
