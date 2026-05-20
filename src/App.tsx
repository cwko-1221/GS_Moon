import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { GameEngine } from './game/GameEngine';
import type { GameState } from './game/types';
import { TOWER_TYPES } from './game/types';
import { CELL_SIZE } from './game/Map';
import { questions } from './questions';
import type { Question } from './questions';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    money: 100,
    health: 20,
    wave: 1,
    phase: 'BUILDING',
    enemies: [],
    towers: [],
    bullets: [],
  });
  
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [questionResult, setQuestionResult] = useState<'correct' | 'wrong' | null>(null);

  const [selectedTowerType, setSelectedTowerType] = useState<'BASIC' | 'LASER' | 'SNIPER' | 'PLASMA' | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const [buildTimeLeft, setBuildTimeLeft] = useState(30);

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

  // Timer for building phase
  useEffect(() => {
    let timerId: ReturnType<typeof setInterval>;
    if (gameState?.phase === 'BUILDING') {
      timerId = setInterval(() => {
        setBuildTimeLeft((prev) => {
          if (prev <= 1) {
            engineRef.current?.startWave();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBuildTimeLeft(30);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [gameState?.phase]);

  // Handle Question Logic
  const handleEarnMoney = () => {
    if (gameState?.phase !== 'BUILDING') return;
    
    // Pick a random question
    const q = questions[Math.floor(Math.random() * questions.length)];
    // Optionally shuffle options here if desired, but we'll keep it simple
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
      setTimeout(() => {
        engineRef.current?.addMoney(100); // Reward for correct answer
        setShowQuestion(false);
      }, 1500);
    } else {
      setQuestionResult('wrong');
      setTimeout(() => {
        setShowQuestion(false);
      }, 2000);
    }
  };

  // Handle Tower Placement
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedTowerType || !engineRef.current || gameState?.phase !== 'BUILDING') return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const gridX = Math.floor(x / CELL_SIZE);
    const gridY = Math.floor(y / CELL_SIZE);

    const success = engineRef.current.placeTower(gridX, gridY, selectedTowerType);
    if (success) {
      // Keep selected or deselect? Let's keep it selected for multiple placements
      // unless they run out of money
      const nextMoney = gameState.money - TOWER_TYPES[selectedTowerType].cost;
      if (nextMoney < TOWER_TYPES[selectedTowerType].cost) {
        setSelectedTowerType(null);
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState?.phase === 'BUILDING') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };


  return (
    <div className="app-container">
      <div className="header">
        <div className="stat health">HP: {gameState.health}</div>
        <div className="stat wave">WAVE: {gameState.wave}</div>
        <div className="stat money">$$: {gameState.money}</div>
      </div>

      <div className="game-area" onMouseMove={handleCanvasMouseMove}>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="game-canvas"
          onClick={handleCanvasClick}
          style={{ cursor: selectedTowerType ? 'crosshair' : 'default' }}
        />

        {/* Tower Placement Preview */}
        {selectedTowerType && gameState.phase === 'BUILDING' && (
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
              {questionResult === 'correct' && <div style={{ color: '#22c55e', marginTop: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>答對了！獲得 100 資金</div>}
              {questionResult === 'wrong' && <div style={{ color: '#ef4444', marginTop: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>答錯了！答案是：{currentQuestion.options[currentQuestion.correctAnswerIndex]}</div>}
            </div>
          </div>
        )}
      </div>

      <div className="controls">
        {gameState.phase === 'BUILDING' ? (
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
            <button className="btn btn-primary" onClick={() => engineRef.current?.startWave()}>
              &gt;&gt; 開始第 {gameState.wave} 波 ({buildTimeLeft}秒) &lt;&lt;
            </button>
          </>
        ) : (
          <div style={{ color: '#00f3ff', padding: '0.8rem', letterSpacing: '2px', fontWeight: 'bold' }}>
            !!! 戰鬥進行中 !!!
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
