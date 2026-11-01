/* ============================================================
   🎮 GAMES ÔN TẬP TRI THỨC CHO BÉ: TIẾNG ANH & TIẾNG TRUNG
   1. 🎈 Chọn Bong Bóng (Bubble Pop)
   2. 🏹 Bắn Cung Thiện Xạ (Archery Target)
   3. 🎣 Thả Câu Đại Dương (Ocean Hook Fisher)
   Tích hợp phát âm chuẩn, âm thanh Web Audio, cộng sao thật
   ============================================================ */

(function(window){
  'use strict';

  // State quản lý Game
  let currentGameId = 'bubble'; // 'bubble' | 'archery' | 'fishing'
  let currentLangFilter = 'all'; // 'all' | 'en' | 'cn'
  let gameScore = 0;
  let gameCombo = 0;
  let currentQuestionIndex = 0;
  const TOTAL_QUESTIONS_PER_ROUND = 5;
  let currentRoundQuestions = [];
  let currentQuestion = null;
  let isAnswering = false;
  let isSoundEnabled = true;

  // Animation frame hooks
  let gameAnimFrame = null;
  let hookAngle = 0;
  let hookSpeed = 0.035;
  let isHookDropping = false;
  let isHookReeling = false;
  let hookLength = 45;
  const HOOK_MAX_LENGTH = 280;
  let hookedFishIndex = -1;

  // ============================================================
  // 🎵 1. HỆ THỐNG ÂM THANH WEB AUDIO ĐỘC LẬP (OFFLINE 100%)
  // ============================================================
  function getAudioContext(){
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      return AudioCtx ? new AudioCtx() : null;
    } catch(e) {
      return null;
    }
  }

  function playTone(freq, type, duration, startTime = 0, gainLevel = 0.15){
    if(!isSoundEnabled) return;
    const ctx = getAudioContext();
    if(!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
      gain.gain.setValueAtTime(gainLevel, ctx.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    } catch(err){}
  }

  const GameSounds = {
    pop(){
      // Tiếng bong bóng nổ: chirp nhanh
      if(!isSoundEnabled) return;
      const ctx = getAudioContext();
      if(!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(950, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.09);
      } catch(e){}
    },
    shoot(){
      // Tiếng dây cung bật & mũi tên vút
      playTone(180, 'triangle', 0.12, 0, 0.18);
      playTone(480, 'sine', 0.18, 0.04, 0.12);
    },
    hit(){
      // Tiếng mũi tên trúng bia hồng tâm & chuông keng
      playTone(320, 'triangle', 0.15, 0, 0.2);
      playTone(880, 'sine', 0.35, 0.08, 0.18);
      playTone(1174.66, 'sine', 0.45, 0.15, 0.15);
    },
    splash(){
      // Tiếng kéo cá & bọt nước
      playTone(600, 'sine', 0.1, 0, 0.15);
      playTone(850, 'triangle', 0.15, 0.06, 0.15);
      playTone(1200, 'sine', 0.25, 0.12, 0.15);
    },
    correct(){
      // Hợp âm chiến thắng Do - Mi - Sol - Do
      [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
        playTone(f, 'triangle', 0.3, i * 0.07, 0.16);
      });
    },
    wrong(){
      // Tiếng boing nhẹ khi chọn sai
      if(!isSoundEnabled) return;
      const ctx = getAudioContext();
      if(!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(280, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.22);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      } catch(e){}
    },
    victory(){
      // Đoạn nhạc chiến thắng hào hùng
      const melody = [523.25, 659.25, 783.99, 1046.50, 880, 1046.50];
      melody.forEach((f, i) => {
        playTone(f, 'triangle', 0.35, i * 0.1, 0.2);
      });
    }
  };

  // Phát âm bản ngữ qua Web Speech API
  function speakWord(text, lang){
    if(!isSoundEnabled) return;
    try {
      if(!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      if(lang === 'cn') {
        u.lang = 'zh-CN';
        u.rate = 0.85;
      } else {
        u.lang = 'en-US';
        u.rate = 0.88;
      }
      window.speechSynthesis.speak(u);
    } catch(err){}
  }

  // ============================================================
  // 📚 2. KHO TỪ VỰNG & BỘ CÂU HỎI TIẾNG ANH & TIẾNG TRUNG
  // ============================================================
  const EXTRA_EN_VOCAB = [
    { word: 'Cat', meaning: 'Con mèo', emoji: '🐱', ipa: '/kæt/' },
    { word: 'Dog', meaning: 'Con chó', emoji: '🐶', ipa: '/dɒɡ/' },
    { word: 'Sun', meaning: 'Mặt trời', emoji: '☀️', ipa: '/sʌn/' },
    { word: 'Moon', meaning: 'Mặt trăng', emoji: '🌙', ipa: '/muːn/' },
    { word: 'Star', meaning: 'Ngôi sao', emoji: '⭐', ipa: '/stɑːr/' },
    { word: 'Water', meaning: 'Nước uống', emoji: '💧', ipa: '/ˈwɔː.tər/' },
    { word: 'Milk', meaning: 'Sữa tươi', emoji: '🥛', ipa: '/mɪlk/' },
    { word: 'Book', meaning: 'Cuốn sách', emoji: '📚', ipa: '/bʊk/' },
    { word: 'Flower', meaning: 'Bông hoa', emoji: '🌸', ipa: '/ˈflaʊ.ər/' },
    { word: 'Fish', meaning: 'Con cá', emoji: '🐟', ipa: '/fɪʃ/' },
    { word: 'Bird', meaning: 'Con chim', emoji: '🐦', ipa: '/bɜːd/' },
    { word: 'House', meaning: 'Ngôi nhà', emoji: '🏠', ipa: '/haʊs/' }
  ];

  const EXTRA_CN_VOCAB = [
    { hanzi: '太阳', pinyin: 'Tàiyáng', meaning: 'Mặt trời', emoji: '☀️' },
    { hanzi: '月亮', pinyin: 'Yuèliang', meaning: 'Mặt trăng', emoji: '🌙' },
    { hanzi: '星星', pinyin: 'Xīngxing', meaning: 'Ngôi sao', emoji: '⭐' },
    { hanzi: '水', pinyin: 'Shuǐ', meaning: 'Nước', emoji: '💧' },
    { hanzi: '书', pinyin: 'Shū', meaning: 'Sách', emoji: '📚' },
    { hanzi: '花', pinyin: 'Huā', meaning: 'Bông hoa', emoji: '🌸' },
    { hanzi: '鱼', pinyin: 'Yú', meaning: 'Con cá', emoji: '🐟' },
    { hanzi: '鸟', pinyin: 'Niǎo', meaning: 'Con chim', emoji: '🐦' },
    { hanzi: '小狗', pinyin: 'Xiǎogǒu', meaning: 'Chó con', emoji: '🐶' },
    { hanzi: '家', pinyin: 'Jiā', meaning: 'Nhà / Gia đình', emoji: '🏠' }
  ];

  function getAvailableEnglishCards(){
    const list = [];
    if(typeof DEFAULT_FLASHCARDS !== 'undefined' && Array.isArray(DEFAULT_FLASHCARDS)){
      DEFAULT_FLASHCARDS.forEach(c => list.push({
        word: c.word, meaning: c.meaning, emoji: c.emoji || '📖', ipa: c.ipa || ''
      }));
    }
    if(window.data && Array.isArray(window.data.customFlashcards)){
      window.data.customFlashcards.forEach(c => list.push({
        word: c.word, meaning: c.meaning, emoji: c.emoji || '📖', ipa: c.ipa || ''
      }));
    }
    EXTRA_EN_VOCAB.forEach(c => list.push(c));
    return list;
  }

  function getAvailableChineseCards(){
    const list = [];
    if(typeof CHINESE_KIDS_CARDS !== 'undefined' && Array.isArray(CHINESE_KIDS_CARDS)){
      CHINESE_KIDS_CARDS.forEach(c => list.push({
        hanzi: c.hanzi, pinyin: c.pinyin, meaning: c.vi, emoji: c.emoji || '🐼'
      }));
    }
    EXTRA_CN_VOCAB.forEach(c => list.push(c));
    return list;
  }

  // Tạo một câu hỏi ôn tập
  function generateOneQuestion(preferredLang = 'all'){
    let lang = preferredLang;
    if(lang === 'all'){
      lang = Math.random() < 0.5 ? 'en' : 'cn';
    }

    if(lang === 'en'){
      const enCards = getAvailableEnglishCards();
      const target = enCards[Math.floor(Math.random() * enCards.length)];
      // Lấy 3 lựa chọn sai
      const others = enCards.filter(c => c.word.toLowerCase() !== target.word.toLowerCase());
      const shuffledOthers = others.sort(() => 0.5 - Math.random()).slice(0, 3);
      
      const options = [
        { text: target.word, sub: target.meaning, emoji: target.emoji, audioText: target.word, isCorrect: true, lang: 'en' },
        ...shuffledOthers.map(o => ({
          text: o.word, sub: o.meaning, emoji: o.emoji, audioText: o.word, isCorrect: false, lang: 'en'
        }))
      ].sort(() => 0.5 - Math.random());

      return {
        lang: 'en',
        prompt: `Bé hãy tìm từ: "${target.meaning}" ${target.emoji}`,
        promptAudio: target.word,
        audioText: target.word,
        targetWord: target.word,
        targetEmoji: target.emoji,
        targetMeaning: target.meaning,
        options: options
      };
    } else {
      const cnCards = getAvailableChineseCards();
      const target = cnCards[Math.floor(Math.random() * cnCards.length)];
      const others = cnCards.filter(c => c.hanzi !== target.hanzi);
      const shuffledOthers = others.sort(() => 0.5 - Math.random()).slice(0, 3);

      const options = [
        { text: target.hanzi, sub: `${target.pinyin} (${target.meaning})`, emoji: target.emoji, audioText: target.hanzi, isCorrect: true, lang: 'cn' },
        ...shuffledOthers.map(o => ({
          text: o.hanzi, sub: `${o.pinyin} (${o.meaning})`, emoji: o.emoji, audioText: o.hanzi, isCorrect: false, lang: 'cn'
        }))
      ].sort(() => 0.5 - Math.random());

      return {
        lang: 'cn',
        prompt: `Bé hãy tìm chữ: "${target.meaning}" ${target.emoji}`,
        promptAudio: target.hanzi,
        audioText: target.hanzi,
        targetWord: target.hanzi,
        targetEmoji: target.emoji,
        targetMeaning: target.meaning,
        options: options
      };
    }
  }

  function generateRoundQuestions(){
    const list = [];
    for(let i = 0; i < TOTAL_QUESTIONS_PER_ROUND; i++){
      list.push(generateOneQuestion(currentLangFilter));
    }
    return list;
  }

  // ============================================================
  // 🎮 3. ĐIỀU HÀNH GAME & GIAO DIỆN CHÍNH
  // ============================================================

  function initGameRound(){
    currentRoundQuestions = generateRoundQuestions();
    currentQuestionIndex = 0;
    gameScore = 0;
    gameCombo = 0;
    isAnswering = false;
    isHookDropping = false;
    isHookReeling = false;
    hookLength = 45;
    hookedFishIndex = -1;
    loadQuestion(0);
  }

  function loadQuestion(idx){
    if(idx >= TOTAL_QUESTIONS_PER_ROUND){
      showVictoryScreen();
      return;
    }
    currentQuestionIndex = idx;
    currentQuestion = currentRoundQuestions[idx];
    isAnswering = false;

    // Tự động phát âm từ cần tìm để kích thích phản xạ nghe của bé
    setTimeout(() => {
      if(currentQuestion){
        speakWord(currentQuestion.promptAudio, currentQuestion.lang);
      }
    }, 300);

    renderGameArenaUI();
  }

  function handleAnswer(option, optIndex, elementRef){
    if(isAnswering) return;
    
    if(option.isCorrect){
      isAnswering = true;
      gameCombo++;
      gameScore += 10 + (gameCombo > 1 ? gameCombo * 2 : 0);
      GameSounds.correct();

      // Phát âm chuẩn từ đúng
      speakWord(option.audioText, option.lang);

      if(currentGameId === 'bubble' && elementRef){
        createBubblePopParticles(elementRef);
        elementRef.style.transform = 'scale(1.2)';
        elementRef.style.opacity = '0';
      }

      if(typeof window.triggerConfetti === 'function'){
        window.triggerConfetti();
      }

      setTimeout(() => {
        loadQuestion(currentQuestionIndex + 1);
      }, 1000);
    } else {
      gameCombo = 0;
      GameSounds.wrong();
      if(elementRef){
        elementRef.classList.add('wrong-shake');
        setTimeout(() => elementRef.classList.remove('wrong-shake'), 450);
      }
      if(typeof window.showToast === 'function'){
        window.showToast('😊 Chưa đúng rồi, bé hãy thử lại nhé!');
      }
    }
  }

  // Hiệu ứng nổ hạt sao lung linh khi chọn trúng bong bóng
  function createBubblePopParticles(bubbleEl){
    const rect = bubbleEl.getBoundingClientRect();
    const stage = document.getElementById('gameStageBox');
    if(!stage) return;
    const stageRect = stage.getBoundingClientRect();
    const centerX = (rect.left + rect.width / 2) - stageRect.left;
    const centerY = (rect.top + rect.height / 2) - stageRect.top;

    const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    for(let i = 0; i < 14; i++){
      const p = document.createElement('div');
      p.className = 'bubble-particle';
      const angle = (Math.PI * 2 / 14) * i;
      const dist = 50 + Math.random() * 45;
      const tx = Math.cos(angle) * dist + 'px';
      const ty = Math.sin(angle) * dist + 'px';
      p.style.setProperty('--tx', tx);
      p.style.setProperty('--ty', ty);
      p.style.left = centerX + 'px';
      p.style.top = centerY + 'px';
      p.style.background = colors[i % colors.length];
      stage.appendChild(p);
      setTimeout(() => p.remove(), 600);
    }
    GameSounds.pop();
  }

  // Thưởng sao thật vào hệ thống khi chiến thắng màn chơi
  function awardGameStars(points = 15){
    if(typeof window.child !== 'function') return;
    const c = window.child();
    if(!c) return;

    c.score = (c.score || 0) + points;
    c.highestScore = Math.max(c.highestScore || 0, c.score);
    if(!Array.isArray(c.pointHistory)) c.pointHistory = [];
    
    const gameTitles = {
      bubble: 'Bong Bóng Tri Thức 🎈',
      archery: 'Bắn Cung Thiện Xạ 🏹',
      fishing: 'Thả Câu Đại Dương 🎣'
    };
    const gName = gameTitles[currentGameId] || 'Trò chơi ôn tập';
    const langLabel = currentLangFilter === 'en' ? 'Tiếng Anh' : (currentLangFilter === 'cn' ? 'Tiếng Trung' : 'Song ngữ');

    c.pointHistory.push({
      id: 'g_' + Date.now(),
      type: 'study',
      subject: currentLangFilter === 'cn' ? 'Tiếng Trung' : 'Tiếng Anh',
      amount: points,
      reason: `[Game Ôn Tập] Thắng ${gName} (${langLabel})`,
      at: new Date().toISOString()
    });

    if(typeof window.boostPiggyOnGoodDeed === 'function'){
      window.boostPiggyOnGoodDeed(c, `Chơi game ${gName}`, points, 0.1);
    }

    if(typeof window.updateEarnedAchievements === 'function'){
      window.updateEarnedAchievements(c);
    }

    if(typeof window.save === 'function'){
      window.save();
    }
    if(typeof window.render === 'function'){
      window.render();
    }
    if(typeof window.showToast === 'function'){
      window.showToast(`🎉 XUẤT SẮC! Thưởng +${points} ⭐ cho bé ${c.name} vì thắng game!`);
    }
  }

  // Màn hình tổng kết khi thắng 5 câu
  function showVictoryScreen(){
    GameSounds.victory();
    awardGameStars(15);
    if(typeof window.triggerConfetti === 'function'){
      window.triggerConfetti();
      setTimeout(window.triggerConfetti, 400);
    }

    const stage = document.getElementById('gameStageBox');
    if(!stage) return;

    const gameNames = {
      bubble: 'Chọn Bong Bóng',
      archery: 'Bắn Cung Thiện Xạ',
      fishing: 'Thả Câu Đại Dương'
    };

    stage.innerHTML = `
      <div class="game-victory-screen">
        <div class="game-victory-icon">🏆✨</div>
        <div class="game-victory-title">XUẤT SẮC HOÀN THÀNH!</div>
        <div class="game-victory-desc">
          Bé đã trả lời đúng trọn vẹn <b>5/5 câu hỏi</b> trong trò chơi <b>${gameNames[currentGameId]}</b>!
        </div>
        <div class="game-reward-pill">
          <span>🌟</span>
          <span>Bé nhận ngay: <b>+15 Điểm Sao</b></span>
        </div>
        <div class="game-victory-actions">
          <button type="button" class="game-btn-pill active" onclick="window.EduGames.restartRound()" style="padding:10px 20px;font-size:14px">
            <span>🔄</span> Chơi tiếp màn mới
          </button>
          <button type="button" class="game-btn-pill" onclick="window.EduGames.switchGame('archery')" style="padding:10px 16px;font-size:14px">
            <span>🏹</span> Thử Bắn cung
          </button>
          <button type="button" class="game-btn-pill" onclick="window.EduGames.switchGame('fishing')" style="padding:10px 16px;font-size:14px">
            <span>🎣</span> Thử Thả câu
          </button>
        </div>
      </div>
    `;
  }

  // ============================================================
  // 🎈 4. LOGIC TỪNG GAME: BUBBLE POP, ARCHERY, OCEAN FISHING
  // ============================================================

  // Render Game 1: Bong bóng
  function renderBubbleGame(stage){
    if(!currentQuestion) return;
    const colors = ['bubble-color-1', 'bubble-color-2', 'bubble-color-3', 'bubble-color-4', 'bubble-color-5', 'bubble-color-6'];
    
    // Tọa độ định vị để các bóng không đè nhau
    const positions = [
      { top: '15%', left: '12%' },
      { top: '18%', left: '58%' },
      { top: '55%', left: '18%' },
      { top: '52%', left: '62%' }
    ];

    const bubblesHtml = currentQuestion.options.map((opt, i) => {
      const pos = positions[i] || { top: '35%', left: '35%' };
      const colorCls = colors[i % colors.length];
      return `
        <div class="bubble-item ${colorCls}" style="top:${pos.top};left:${pos.left};width:125px;height:125px;animation-delay:${i * 0.4}s" data-opt-idx="${i}">
          <span class="b-emoji">${opt.emoji}</span>
          <span class="b-word">${opt.text}</span>
          <span class="b-sub">${opt.sub}</span>
        </div>
      `;
    }).join('');

    stage.innerHTML = `
      <div class="bubble-stage" id="bubbleStageInner">
        ${bubblesHtml}
      </div>
    `;

    // Gắn sự kiện click / touch vào từng quả bóng
    stage.querySelectorAll('.bubble-item').forEach(el => {
      const idx = Number(el.getAttribute('data-opt-idx'));
      const opt = currentQuestion.options[idx];
      el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        handleAnswer(opt, idx, el);
      });
    });
  }

  // Render Game 2: Bắn cung
  function renderArcheryGame(stage){
    if(!currentQuestion) return;

    const targetsHtml = currentQuestion.options.map((opt, i) => `
      <div class="archery-target-item" data-opt-idx="${i}">
        <div class="archery-target-board">
          <div class="archery-target-emoji">${opt.emoji}</div>
        </div>
        <div class="archery-target-label" title="${opt.text}">${opt.text}</div>
      </div>
    `).join('');

    stage.innerHTML = `
      <div class="archery-stage" id="archeryStageInner">
        <div class="archery-target-row">${targetsHtml}</div>
        
        <div class="archery-bow-container" id="archeryBowWrap">
          <div class="archery-bow-graphic" id="archeryBowGraphic">🏹</div>
          <div class="archery-prompt-pill">🎯 Chạm vào bia mục tiêu để nhắm bắn!</div>
        </div>
      </div>
    `;

    // Gắn sự kiện bắn cung
    stage.querySelectorAll('.archery-target-item').forEach(el => {
      const idx = Number(el.getAttribute('data-opt-idx'));
      const opt = currentQuestion.options[idx];
      el.addEventListener('click', () => {
        fireArrowAtTarget(el, opt, idx);
      });
    });
  }

  // Hiệu ứng mũi tên bay vút lên bia mục tiêu
  function fireArrowAtTarget(targetEl, opt, idx){
    if(isAnswering) return;
    const stage = document.getElementById('archeryStageInner');
    const bowWrap = document.getElementById('archeryBowWrap');
    if(!stage || !bowWrap) return;

    GameSounds.shoot();

    const stageRect = stage.getBoundingClientRect();
    const bowRect = bowWrap.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    const startX = (bowRect.left + bowRect.width / 2) - stageRect.left;
    const startY = (bowRect.top) - stageRect.top;
    const endX = (targetRect.left + targetRect.width / 2) - stageRect.left;
    const endY = (targetRect.top + targetRect.height / 2) - stageRect.top;

    const arrow = document.createElement('div');
    arrow.className = 'flying-arrow';
    arrow.style.left = (startX - 2) + 'px';
    arrow.style.top = startY + 'px';
    
    // Tính góc xoay của mũi tên về phía bia
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const angleRad = Math.atan2(deltaY, deltaX);
    const angleDeg = (angleRad * 180 / Math.PI) + 90;
    arrow.style.transform = `rotate(${angleDeg}deg)`;

    stage.appendChild(arrow);

    // Kéo bay trong 260ms
    setTimeout(() => {
      arrow.style.transition = 'all 0.26s cubic-bezier(0.2, 0.8, 0.4, 1)';
      arrow.style.left = (endX - 2) + 'px';
      arrow.style.top = (endY - 15) + 'px';
    }, 20);

    setTimeout(() => {
      arrow.remove();
      if(opt.isCorrect){
        GameSounds.hit();
        targetEl.style.transform = 'scale(1.25) rotate(15deg)';
        targetEl.style.transition = 'transform 0.2s';
      }
      handleAnswer(opt, idx, targetEl);
    }, 290);
  }

  // Render Game 3: Thả câu đại dương
  function renderFishingGame(stage){
    if(!currentQuestion) return;

    const creatures = currentQuestion.options.map((opt, i) => {
      const topOffset = 70 + (i * 38);
      const isLeft = (i % 2 === 0);
      return `
        <div class="fish-target-card" style="top:${topOffset}px;${isLeft?'left:8%':'right:8%'}" data-opt-idx="${i}">
          <span class="f-emoji">${opt.emoji}</span>
          <div>
            <div class="f-word">${opt.text}</div>
            <div class="f-sub">${opt.sub}</div>
          </div>
        </div>
      `;
    }).join('');

    stage.innerHTML = `
      <div class="fishing-stage" id="fishingStageInner">
        <div class="fishing-boat">🚤</div>
        <div class="fishing-line" id="fishingLine" style="height:50px">
          <div class="fishing-hook">🪝</div>
        </div>
        <div class="fishing-sea-creatures">
          ${creatures}
        </div>
        <div class="fishing-action-bar">
          <button type="button" class="fishing-hook-btn" id="fishingHookActionBtn" onclick="window.EduGames.triggerFishingHook()">
            <span>🪝</span> <span>THẢ CÂU NGAY</span>
          </button>
        </div>
      </div>
    `;

    // Cho phép click trực tiếp vào chú cá hoặc bấm nút Thả câu
    stage.querySelectorAll('.fish-target-card').forEach(el => {
      const idx = Number(el.getAttribute('data-opt-idx'));
      const opt = currentQuestion.options[idx];
      el.addEventListener('click', () => {
        hookSpecificFish(el, opt, idx);
      });
    });
  }

  function hookSpecificFish(fishEl, opt, idx){
    if(isAnswering) return;
    const line = document.getElementById('fishingLine');
    if(!line) return;

    GameSounds.splash();
    line.style.transition = 'height 0.35s ease-out';
    line.style.height = '180px';

    setTimeout(() => {
      fishEl.style.transform = 'scale(1.15) translateY(-30px)';
      fishEl.style.transition = 'transform 0.3s';
      handleAnswer(opt, idx, fishEl);
      setTimeout(() => {
        if(line) line.style.height = '50px';
      }, 350);
    }, 360);
  }

  // ============================================================
  // 🎨 5. RENDER CONTAINER GIAO DIỆN CHÍNH (HTML TEMPLATE)
  // ============================================================
  function renderGameArenaUI(){
    const box = document.getElementById('gameArenaContainer');
    if(!box) return;

    if(!currentQuestion) {
      box.innerHTML = '<div style="padding:20px;text-align:center">Đang tải câu hỏi ôn tập...</div>';
      return;
    }

    const gameTabs = [
      { id: 'bubble', name: '🎈 Chọn Bong Bóng' },
      { id: 'archery', name: '🏹 Bắn Cung Thiện Xạ' },
      { id: 'fishing', name: '🎣 Thả Câu Đại Dương' }
    ];

    const tabsHtml = gameTabs.map(t => `
      <button type="button" class="game-tab-btn ${currentGameId===t.id?'active':''}" onclick="window.EduGames.switchGame('${t.id}')">
        ${t.name}
      </button>
    `).join('');

    box.innerHTML = `
      <div class="game-arena-wrapper">
        <!-- Header Game -->
        <div class="game-arena-header">
          <div class="game-title-group">
            <span class="game-title-icon">🎮</span>
            <div class="game-title-text">
              <h3>Đấu Trường Game Ôn Tập Tri Thức</h3>
              <span>Ôn tập từ vựng &amp; câu Tiếng Anh, Tiếng Trung vui nhộn</span>
            </div>
          </div>
          <div class="game-header-controls">
            <div class="game-score-badge">
              <span>⭐ Điểm:</span> <b>${gameScore}</b>
            </div>
            ${gameCombo > 1 ? `<div class="game-score-badge" style="background:#ea580c;color:#fff">🔥 x${gameCombo}</div>` : ''}
            <button type="button" class="game-btn-pill" onclick="window.EduGames.toggleSound()" title="Bật/Tắt âm thanh">
              <span>${isSoundEnabled ? '🔊' : '🔇'}</span>
            </button>
          </div>
        </div>

        <!-- Menu chọn trò chơi -->
        <div class="game-select-tabs">
          ${tabsHtml}
        </div>

        <!-- Thanh chọn ngôn ngữ: Anh / Trung / Cả hai -->
        <div class="game-lang-bar">
          <div class="game-lang-group">
            <button type="button" class="game-lang-pill ${currentLangFilter==='all'?'active':''}" onclick="window.EduGames.setLang('all')">🌟 Tất cả</button>
            <button type="button" class="game-lang-pill ${currentLangFilter==='en'?'active':''}" onclick="window.EduGames.setLang('en')">🇬🇧 Tiếng Anh</button>
            <button type="button" class="game-lang-pill ${currentLangFilter==='cn'?'active':''}" onclick="window.EduGames.setLang('cn')">🐼 Tiếng Trung</button>
          </div>
          <div style="font-size:12px;font-weight:800;color:#065f46">
            Câu <b>${currentQuestionIndex + 1}/${TOTAL_QUESTIONS_PER_ROUND}</b>
          </div>
        </div>

        <!-- Khung hiển thị câu hỏi cho bé -->
        <div class="game-question-box">
          <div class="game-question-info">
            <span class="game-question-badge ${currentQuestion.lang}">
              ${currentQuestion.lang === 'en' ? '🇬🇧 TIẾNG ANH' : '🐼 TIẾNG TRUNG'}
            </span>
            <div class="game-question-text">${currentQuestion.prompt}</div>
            <div class="game-question-hint">💡 Hãy chọn đáp án chính xác để nhận điểm thưởng sao nhé!</div>
          </div>
          <div class="game-question-actions">
            <button type="button" class="game-sound-btn" onclick="window.EduGames.speakPrompt()" title="Nghe phát âm">
              <span>🔊</span> <span>Nghe đọc</span>
            </button>
          </div>
        </div>

        <!-- Sân khấu trò chơi tương tác -->
        <div class="game-stage-container" id="gameStageBox"></div>
      </div>
    `;

    const stageBox = document.getElementById('gameStageBox');
    if(currentGameId === 'bubble'){
      renderBubbleGame(stageBox);
    } else if(currentGameId === 'archery'){
      renderArcheryGame(stageBox);
    } else if(currentGameId === 'fishing'){
      renderFishingGame(stageBox);
    }
  }

  // ============================================================
  // 🚀 6. MODAL TOÀN MÀN HÌNH & API PUBLIC
  // ============================================================

  function openGameModal(defaultGame = 'bubble', defaultLang = 'all'){
    currentGameId = defaultGame;
    currentLangFilter = defaultLang;
    initGameRound();

    // Nếu modal tồn tại thì mở, nếu không thì render trực tiếp vào container
    let modal = document.getElementById('gameArenaModal');
    if(!modal){
      // Tự động tạo modal nếu chưa có trong DOM
      modal = document.createElement('div');
      modal.id = 'gameArenaModal';
      modal.className = 'modal-backdrop';
      modal.style.display = 'flex';
      modal.innerHTML = `
        <div class="modal-card" style="max-width:760px;padding:0;overflow:hidden;border:none">
          <div style="display:flex;justify-content:flex-end;padding:8px 12px;background:#059669">
            <button class="close" style="color:#ffffff;font-size:22px;background:none;border:none;cursor:pointer" onclick="window.EduGames.closeModal()">✕</button>
          </div>
          <div id="gameArenaContainer" style="padding:0"></div>
        </div>
      `;
      document.body.appendChild(modal);
    } else {
      modal.style.display = 'flex';
    }
    renderGameArenaUI();
  }

  function closeModal(){
    const modal = document.getElementById('gameArenaModal');
    if(modal) modal.style.display = 'none';
  }

  // Public API
  window.EduGames = {
    openModal: openGameModal,
    closeModal: closeModal,
    switchGame(gameId){
      currentGameId = gameId;
      initGameRound();
    },
    setLang(lang){
      currentLangFilter = lang;
      initGameRound();
    },
    restartRound(){
      initGameRound();
    },
    speakPrompt(){
      if(currentQuestion){
        speakWord(currentQuestion.promptAudio, currentQuestion.lang);
      }
    },
    toggleSound(){
      isSoundEnabled = !isSoundEnabled;
      if(typeof window.showToast === 'function'){
        window.showToast(isSoundEnabled ? '🔊 Đã bật âm thanh game' : '🔇 Đã tắt âm thanh');
      }
      renderGameArenaUI();
    },
    triggerFishingHook(){
      if(isAnswering || !currentQuestion) return;
      // Chọn ngẫu nhiên con cá hoặc con đúng nếu không chạm
      const correctIdx = currentQuestion.options.findIndex(o => o.isCorrect);
      const stage = document.getElementById('fishingStageInner');
      if(!stage) return;
      const targetFish = stage.querySelector(`[data-opt-idx="${correctIdx}"]`);
      if(targetFish){
        hookSpecificFish(targetFish, currentQuestion.options[correctIdx], correctIdx);
      }
    },
    mountToContainer(containerId){
      const el = document.getElementById(containerId);
      if(el){
        el.id = 'gameArenaContainer';
        initGameRound();
      }
    }
  };

})(window);
