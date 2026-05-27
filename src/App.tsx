import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { GameEngine } from './game/GameEngine';
import type { GameState, Tower } from './game/types';
import { TOWER_TYPES } from './game/types';
import { CELL_SIZE } from './game/Map';
import { questions } from './questions';
import type { Question } from './questions';
import { soundEngine } from './game/SoundEngine';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const scaleRef = useRef(1);
  const [gameState, setGameState] = useState<GameState>({
    money: 150,
    health: 20,
    wave: 1,
    phase: 'BUILDING',
    enemies: [],
    towers: [],
    bullets: [],
    buildTimeLeft: 30,
  });
  
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [questionResult, setQuestionResult] = useState<'correct' | 'wrong' | null>(null);

  const [selectedTowerType, setSelectedTowerType] = useState<'BASIC' | 'LASER' | 'SNIPER' | 'PLASMA' | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const [isMuted, setIsMuted] = useState(false);
  const [selectedTowerId, setSelectedTowerId] = useState<string | null>(null);
  const [consecutiveWrongAnswers, setConsecutiveWrongAnswers] = useState(0);

  const selectedTower: Tower | undefined = gameState.towers.find(t => t.id === selectedTowerId);

  // Initialize Game Engine
  useEffect(() => {
    if (canvasRef.current && !engineRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        const engine = new GameEngine(ctx, (newState) => {
          setGameState(newState);
        });
        engineRef.current = engine;
        engine.start();
      }
    }
    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
        engineRef.current = null;
      }
    };
  }, []);

  // Responsive scaling
  useEffect(() => {
    const updateScale = () => {
      if (gameAreaRef.current) {
        const container = gameAreaRef.current.parentElement;
        if (!container) return;
        const maxW = container.clientWidth - 16; // padding
        const maxH = window.innerHeight * 0.65;
        const scaleX = maxW / 800;
        const scaleY = maxH / 600;
        const scale = Math.min(scaleX, scaleY, 1.0);
        scaleRef.current = scale;
        gameAreaRef.current.style.transform = `scale(${scale})`;
        gameAreaRef.current.style.transformOrigin = 'top center';
        // Set wrapper height so controls position correctly
        const wrapper = document.getElementById('game-wrapper');
        if (wrapper) {
          wrapper.style.height = `${600 * scale}px`;
        }
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Handle Question Logic
  const handleEarnMoney = () => {
    if (gameState?.phase === 'GAME_OVER') return;
    
    // Pause building countdown timer when question modal is open
    engineRef.current?.setQuestionModalOpen(true);
    
    // Pick a random question
    const q = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(q);
    setSelectedOption(null);
    setQuestionResult(null);
    setShowQuestion(true);
  };

  const handleAnswerOption = (index: number) => {
    if (questionResult !== null || !currentQuestion) return; // Already answered
    
    setSelectedOption(index);
    if (index === currentQuestion.correctAnswerIndex) {
      setQuestionResult('correct');
      setConsecutiveWrongAnswers(0); // Reset consecutive wrong answers count
      soundEngine.playCorrectAnswer();
      setTimeout(() => {
        engineRef.current?.addMoney(50); // Reward for correct answer
        engineRef.current?.setQuestionModalOpen(false); // Resume countdown timer
        setShowQuestion(false);
      }, 1500);
    } else {
      setQuestionResult('wrong');
      soundEngine.playWrongAnswer();
      const nextWrong = consecutiveWrongAnswers + 1;
      setConsecutiveWrongAnswers(nextWrong);
      
      if (nextWrong >= 4) {
        // Trigger auto nuclear bomb!
        setTimeout(() => {
          engineRef.current?.addMoney(-50); // Penalty for wrong answer
          engineRef.current?.triggerNuclearBomb();
          setConsecutiveWrongAnswers(0); // Reset count
          engineRef.current?.setQuestionModalOpen(false); // Resume countdown
          setShowQuestion(false);
        }, 2000);
      } else {
        setTimeout(() => {
          engineRef.current?.addMoney(-50); // Penalty for wrong answer
          engineRef.current?.setQuestionModalOpen(false); // Resume countdown
          setShowQuestion(false);
        }, 2000);
      }
    }
  };

  // Handle Tower Placement (mouse + touch)
  const getCanvasCoords = (clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    // Account for CSS scaling: rect already reflects scaled size
    const scaleX = 800 / rect.width;
    const scaleY = 600 / rect.height;
    return { x: x * scaleX, y: y * scaleY };
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!engineRef.current || gameState?.phase === 'GAME_OVER') return;
    const coords = getCanvasCoords(e.clientX, e.clientY);
    if (!coords) return;

    const gridX = Math.floor(coords.x / CELL_SIZE);
    const gridY = Math.floor(coords.y / CELL_SIZE);

    // If no tower type selected, check if clicking on existing tower
    if (!selectedTowerType) {
      const clickedTower = gameState.towers.find(t => t.x === gridX && t.y === gridY);
      if (clickedTower) {
        setSelectedTowerId(clickedTower.id === selectedTowerId ? null : clickedTower.id);
      } else {
        setSelectedTowerId(null);
      }
      return;
    }

    // Place tower
    setSelectedTowerId(null);
    const success = engineRef.current.placeTower(gridX, gridY, selectedTowerType);
    if (success) {
      const nextMoney = gameState.money - TOWER_TYPES[selectedTowerType].cost;
      if (nextMoney < TOWER_TYPES[selectedTowerType].cost) {
        setSelectedTowerType(null);
      }
    }
  };

  const handleCanvasTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!engineRef.current || gameState?.phase === 'GAME_OVER') return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    const coords = getCanvasCoords(touch.clientX, touch.clientY);
    if (!coords) return;

    const gridX = Math.floor(coords.x / CELL_SIZE);
    const gridY = Math.floor(coords.y / CELL_SIZE);

    if (!selectedTowerType) {
      const clickedTower = gameState.towers.find(t => t.x === gridX && t.y === gridY);
      if (clickedTower) {
        setSelectedTowerId(clickedTower.id === selectedTowerId ? null : clickedTower.id);
      } else {
        setSelectedTowerId(null);
      }
      return;
    }

    setSelectedTowerId(null);
    const success = engineRef.current.placeTower(gridX, gridY, selectedTowerType);
    if (success) {
      const nextMoney = gameState.money - TOWER_TYPES[selectedTowerType].cost;
      if (nextMoney < TOWER_TYPES[selectedTowerType].cost) {
        setSelectedTowerType(null);
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState?.phase !== 'GAME_OVER') {
      const coords = getCanvasCoords(e.clientX, e.clientY);
      if (!coords) return;
      setMousePos(coords);
    }
  };


  return (
    <div className="app-container">
      <div className="header">
        <div className="stat health">HP: {gameState.health}</div>
        <div className="stat wave">WAVE: {gameState.wave}</div>
        <div className="stat money">$$: {gameState.money}</div>
        <button 
          className="btn mute-btn" 
          onClick={() => { const m = soundEngine.toggleMute(); setIsMuted(m); }}
          title={isMuted ? '開啟音效' : '關閉音效'}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>

      <div id="game-wrapper">
        <div className="game-area" ref={gameAreaRef} onMouseMove={handleCanvasMouseMove}>
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="game-canvas"
            onClick={handleCanvasClick}
            onTouchEnd={handleCanvasTouchEnd}
            style={{ cursor: selectedTowerType ? 'crosshair' : 'default', touchAction: 'none' }}
          />

        {/* Tower Placement Preview */}
        {selectedTowerType && gameState.phase !== 'GAME_OVER' && (
          <div className="placement-overlay">
            <div 
              className="placement-cursor"
              style={{
                left: Math.floor(mousePos.x / CELL_SIZE) * CELL_SIZE + CELL_SIZE / 2,
                top: Math.floor(mousePos.y / CELL_SIZE) * CELL_SIZE + CELL_SIZE / 2,
                width: TOWER_TYPES[selectedTowerType].range * 2,
                height: TOWER_TYPES[selectedTowerType].range * 2,
              }}
            />
          </div>
        )}

        {/* Game Over Screen */}
        {gameState.phase === 'GAME_OVER' && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="question-text" style={{ color: '#ff003c' }}>SYSTEM FAILURE</h2>
              <p>基地已被摧毀</p>
              <p style={{ margin: '1rem 0' }}>生存波數: {gameState.wave}</p>
              <button className="btn btn-primary" onClick={() => window.location.reload()}>REBOOT</button>
            </div>
          </div>
        )}

        {/* Question Modal */}
        {showQuestion && currentQuestion && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="question-text">{currentQuestion.question}</div>
              <div className="options-grid">
                {currentQuestion.options.map((opt, idx) => {
                  let btnClass = 'option-btn';
                  if (selectedOption !== null) {
                    if (idx === currentQuestion.correctAnswerIndex) {
                      btnClass += ' correct';
                    } else if (idx === selectedOption) {
                      btnClass += ' wrong';
                    }
                  }

                  return (
                    <button 
                      key={idx} 
                      className={btnClass}
                      onClick={() => handleAnswerOption(idx)}
                      disabled={selectedOption !== null}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {questionResult === 'correct' && <div style={{ color: '#22c55e', marginTop: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>答對了！獲得 50 資金</div>}
              {questionResult === 'wrong' && (
                <div style={{ color: '#ef4444', marginTop: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  答錯了！-50 資金 答案是：{currentQuestion.options[currentQuestion.correctAnswerIndex]}
                  <div style={{ color: '#f87171', fontSize: '1rem', marginTop: '0.5rem', fontWeight: 'bold' }}>
                    {consecutiveWrongAnswers >= 4 
                      ? '☢️ 已連續答錯 4 題！即將啟動自動核彈防衛機制！' 
                      : `⚠️ 目前已連續答錯 ${consecutiveWrongAnswers} 題 (連錯 4 題將自動引爆核彈)`
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>

      <div className="controls">
        {gameState.phase !== 'GAME_OVER' ? (
          <>
            <button className="btn btn-action" onClick={handleEarnMoney}>
              [ 賺取資金 (答題) ]
            </button>
            <button 
              className={`btn ${selectedTowerType === 'BASIC' ? 'btn-primary' : ''}`}
              onClick={() => setSelectedTowerType(selectedTowerType === 'BASIC' ? null : 'BASIC')}
              disabled={gameState.money < TOWER_TYPES.BASIC.cost}
            >
              機槍塔 ($ {TOWER_TYPES.BASIC.cost})
            </button>
            <button 
              className={`btn ${selectedTowerType === 'LASER' ? 'btn-primary' : ''}`}
              onClick={() => setSelectedTowerType(selectedTowerType === 'LASER' ? null : 'LASER')}
              disabled={gameState.money < TOWER_TYPES.LASER.cost}
            >
              雷射塔 ($ {TOWER_TYPES.LASER.cost})
            </button>
            <button 
              className={`btn ${selectedTowerType === 'SNIPER' ? 'btn-primary' : ''}`}
              onClick={() => setSelectedTowerType(selectedTowerType === 'SNIPER' ? null : 'SNIPER')}
              disabled={gameState.money < TOWER_TYPES.SNIPER.cost}
            >
              狙擊塔 ($ {TOWER_TYPES.SNIPER.cost})
            </button>
            <button 
              className={`btn ${selectedTowerType === 'PLASMA' ? 'btn-primary' : ''}`}
              onClick={() => setSelectedTowerType(selectedTowerType === 'PLASMA' ? null : 'PLASMA')}
              disabled={gameState.money < TOWER_TYPES.PLASMA.cost}
            >
              電漿塔 ($ {TOWER_TYPES.PLASMA.cost})
            </button>
            {gameState.phase === 'BUILDING' && (
              <button className="btn btn-primary" onClick={() => engineRef.current?.startWave()}>
                &gt;&gt; 開始第 {gameState.wave} 波 ({gameState.buildTimeLeft}秒) &lt;&lt;
              </button>
            )}
            {gameState.phase === 'COMBAT' && (
              <div style={{ color: '#ff003c', padding: '0.6rem', letterSpacing: '2px', fontWeight: 'bold', animation: 'fadeIn 0.5s ease' }}>
                ⚔ 戰鬥中 - WAVE {gameState.wave}
              </div>
            )}
            {gameState.wave >= 5 && (
              <button 
                className="btn btn-nuke" 
                onClick={() => {
                  if (window.confirm("確定要發動核彈嗎？這會摧毀畫面上所有的防禦塔和怪物！\nAre you sure you want to launch the nuclear bomb? This will destroy all towers and enemies on screen!")) {
                    engineRef.current?.triggerNuclearBomb();
                  }
                }}
              >
                ☢ 核彈攻擊 (NUCLEAR BOMB) ☢
              </button>
            )}
          </>
        ) : null}
      </div>

      {/* Tower Info Panel (Upgrade / Sell) */}
      {selectedTower && gameState.phase !== 'GAME_OVER' && (
        <div className="tower-panel">
          <div className="tower-panel-header">
            <span style={{ color: selectedTower.color }}>
              {selectedTower.type === 'BASIC' ? '機槍塔' : selectedTower.type === 'LASER' ? '雷射塔' : selectedTower.type === 'SNIPER' ? '狙擊塔' : '電漿塔'}
            </span>
            <span style={{ color: '#fbbf24' }}> Lv.{selectedTower.level}</span>
            <button className="btn" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', marginLeft: 'auto' }} onClick={() => setSelectedTowerId(null)}>✕</button>
          </div>
          <div className="tower-panel-stats">
            <span>生命: {Math.ceil(selectedTower.hp)}/{selectedTower.maxHp}</span>
            <span>傷害: {selectedTower.damage}</span>
            <span>範圍: {selectedTower.range}</span>
            <span>射速: {selectedTower.fireRate.toFixed(1)}/s</span>
          </div>
          <div className="tower-panel-actions">
            {selectedTower.level < TOWER_TYPES[selectedTower.type].maxLevel ? (
              <button
                className="btn btn-primary"
                disabled={gameState.money < TOWER_TYPES[selectedTower.type].upgradeCost}
                onClick={() => {
                  engineRef.current?.upgradeTower(selectedTower.id);
                }}
              >
                ⬆ 升級 (${TOWER_TYPES[selectedTower.type].upgradeCost})
              </button>
            ) : (
              <span style={{ color: '#fbbf24', fontSize: '0.85rem' }}>★ 已滿級</span>
            )}
            <button
              className="btn btn-sell"
              onClick={() => {
                engineRef.current?.sellTower(selectedTower.id);
                setSelectedTowerId(null);
              }}
            >
              ♻ 拆除 (+${Math.floor(selectedTower.totalCost * 0.5)})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
