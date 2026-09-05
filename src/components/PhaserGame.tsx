import { useEffect, useRef, useCallback } from 'react';
import Phaser from 'phaser';
import enemySpriteUrl from '@/assets/enemy-sprite.png';

interface PhaserGameProps {
  latency: number;
  onGameEnd: (results: {
    hits: number;
    total: number;
    reactionTimes: number[];
    score: number;
    headshots: number;
    bodyshots: number;
    misses: number;
  }) => void;
}

const GAME_DURATION = 60000; // 60 seconds
const FIRE_RATE = 300; // ms between shots
const MAX_ENEMIES = 3;
const SPAWN_INTERVAL = 1500;

class FPSScene extends Phaser.Scene {
  private latency = 0;
  private hits = 0;
  private headshots = 0;
  private bodyshots = 0;
  private misses = 0;
  private totalShots = 0;
  private score = 0;
  private reactionTimes: number[] = [];
  private onGameEnd!: PhaserGameProps['onGameEnd'];
  private enemies: Phaser.GameObjects.Container[] = [];
  private lastFireTime = 0;
  private timeRemaining = 60;
  private gameOver = false;
  private crosshairGraphics!: Phaser.GameObjects.Graphics;

  // HUD texts
  private scoreText!: Phaser.GameObjects.Text;
  private timeText!: Phaser.GameObjects.Text;
  private accuracyText!: Phaser.GameObjects.Text;
  private latencyText!: Phaser.GameObjects.Text;
  private ammoText!: Phaser.GameObjects.Text;
  private killFeedTexts: Phaser.GameObjects.Text[] = [];

  private gameTimer!: Phaser.Time.TimerEvent;
  private spawnTimer!: Phaser.Time.TimerEvent;
  private enemySpawnTimes: Map<string, number> = new Map();

  constructor() {
    super({ key: 'FPSScene' });
  }

  init(data: { latency: number; onGameEnd: PhaserGameProps['onGameEnd'] }) {
    this.latency = data.latency;
    this.onGameEnd = data.onGameEnd;
    this.hits = 0;
    this.headshots = 0;
    this.bodyshots = 0;
    this.misses = 0;
    this.totalShots = 0;
    this.score = 0;
    this.reactionTimes = [];
    this.enemies = [];
    this.lastFireTime = 0;
    this.timeRemaining = 60;
    this.gameOver = false;
    this.enemySpawnTimes = new Map();
    this.killFeedTexts = [];
  }

  preload() {
    this.load.image('enemy', enemySpriteUrl);
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#0f1628');

    // Background grid
    const grid = this.add.graphics();
    grid.lineStyle(1, 0x1a2440, 0.4);
    for (let x = 0; x < width; x += 50) { grid.moveTo(x, 0); grid.lineTo(x, height); }
    for (let y = 0; y < height; y += 50) { grid.moveTo(0, y); grid.lineTo(width, y); }
    grid.strokePath();

    // Ground plane
    const ground = this.add.graphics();
    ground.fillStyle(0x1a2440, 0.6);
    ground.fillRect(0, height * 0.75, width, height * 0.25);
    ground.lineStyle(2, 0x3b82f6, 0.3);
    ground.moveTo(0, height * 0.75);
    ground.lineTo(width, height * 0.75);
    ground.strokePath();

    // Horizon glow
    const horizonGlow = this.add.graphics();
    horizonGlow.fillStyle(0x3b82f6, 0.05);
    horizonGlow.fillRect(0, height * 0.6, width, height * 0.2);

    // Create crosshair
    this.crosshairGraphics = this.add.graphics();
    this.drawCrosshair(width / 2, height / 2);

    // HUD setup
    this.createHUD(width, height);

    // Input - use pointer for crosshair
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.crosshairGraphics.clear();
      this.drawCrosshair(pointer.x, pointer.y);
    });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.gameOver) return;
      const now = Date.now();
      if (now - this.lastFireTime < FIRE_RATE) return;
      this.lastFireTime = now;
      this.shoot(pointer.x, pointer.y);
    });

    // Hide system cursor
    this.input.setDefaultCursor('none');

    // Spawn timer
    this.spawnTimer = this.time.addEvent({
      delay: SPAWN_INTERVAL,
      callback: () => this.spawnEnemy(),
      loop: true,
    });

    // Game timer
    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timeRemaining--;
        this.updateHUD();
        if (this.timeRemaining <= 0) this.endGame();
      },
      loop: true,
    });

    // Initial spawn
    this.spawnEnemy();
    this.spawnEnemy();
  }

  private drawCrosshair(x: number, y: number) {
    const g = this.crosshairGraphics;
    g.setDepth(100);

    // Outer circle
    g.lineStyle(2, 0x3b82f6, 0.8);
    g.strokeCircle(x, y, 20);

    // Inner dot
    g.fillStyle(0xff3333, 1);
    g.fillCircle(x, y, 2);

    // Cross lines
    g.lineStyle(1.5, 0x3b82f6, 0.9);
    const gap = 6, len = 14;
    g.moveTo(x - gap - len, y); g.lineTo(x - gap, y);
    g.moveTo(x + gap, y); g.lineTo(x + gap + len, y);
    g.moveTo(x, y - gap - len); g.lineTo(x, y - gap);
    g.moveTo(x, y + gap); g.lineTo(x, y + gap + len);
    g.strokePath();
  }

  private createHUD(width: number, height: number) {
    const hudStyle = { fontSize: '14px', color: '#94a3b8', fontFamily: 'monospace' };
    const valueStyle = { fontSize: '18px', color: '#60a5fa', fontFamily: 'monospace', fontStyle: 'bold' };

    // Top-left: Score
    this.add.text(16, 12, 'SCORE', hudStyle).setDepth(90);
    this.scoreText = this.add.text(16, 30, '0', { ...valueStyle, fontSize: '28px' }).setDepth(90);

    // Top-center: Timer
    this.add.text(width / 2, 12, 'TIME', { ...hudStyle, align: 'center' }).setOrigin(0.5, 0).setDepth(90);
    this.timeText = this.add.text(width / 2, 30, '60', {
      ...valueStyle, fontSize: '28px', color: '#22c55e',
    }).setOrigin(0.5, 0).setDepth(90);

    // Top-right: Accuracy + Latency
    this.add.text(width - 16, 12, 'ACCURACY', { ...hudStyle, align: 'right' }).setOrigin(1, 0).setDepth(90);
    this.accuracyText = this.add.text(width - 16, 30, '0%', valueStyle).setOrigin(1, 0).setDepth(90);

    this.add.text(width - 16, 58, 'LATENCY', { ...hudStyle, align: 'right' }).setOrigin(1, 0).setDepth(90);
    this.latencyText = this.add.text(width - 16, 76, `${this.latency}ms`, {
      ...valueStyle,
      color: this.latency <= 50 ? '#22c55e' : this.latency <= 100 ? '#eab308' : '#ef4444',
    }).setOrigin(1, 0).setDepth(90);

    // Bottom: Ammo / weapon info
    this.ammoText = this.add.text(16, height - 30, '🔫 PISTOL  |  Fire Rate: 300ms', {
      fontSize: '12px', color: '#64748b', fontFamily: 'monospace',
    }).setDepth(90);

    // HUD borders
    const hudBorder = this.add.graphics().setDepth(89);
    hudBorder.lineStyle(1, 0x3b82f6, 0.2);
    hudBorder.strokeRect(8, 4, width - 16, 100);
    hudBorder.strokeRect(8, height - 40, 260, 32);
  }

  private updateHUD() {
    this.scoreText.setText(this.score.toString());
    this.timeText.setText(this.timeRemaining.toString());

    // Timer color
    if (this.timeRemaining <= 10) {
      this.timeText.setColor('#ef4444');
    } else if (this.timeRemaining <= 20) {
      this.timeText.setColor('#eab308');
    }

    const acc = this.totalShots > 0 ? ((this.hits / this.totalShots) * 100).toFixed(1) : '0';
    this.accuracyText.setText(`${acc}%`);
  }

  private spawnEnemy() {
    if (this.gameOver || this.enemies.length >= MAX_ENEMIES) return;

    const { width, height } = this.scale;
    const padding = 80;
    const x = Phaser.Math.Between(padding, width - padding);
    const groundY = height * 0.75;

    // Enemy container
    const container = this.add.container(x, groundY);
    const id = `enemy_${Date.now()}_${Math.random()}`;
    container.setData('id', id);

    // Enemy sprite
    const sprite = this.add.image(0, 0, 'enemy');
    const scale = Phaser.Math.FloatBetween(0.12, 0.18);
    sprite.setScale(scale);
    sprite.setOrigin(0.5, 1);

    // Hit zones (invisible)
    const spriteH = sprite.displayHeight;
    const spriteW = sprite.displayWidth;

    // Head zone (top 25%)
    const headZone = this.add.rectangle(0, -spriteH + spriteH * 0.12, spriteW * 0.5, spriteH * 0.25, 0xff0000, 0);
    headZone.setData('zone', 'head');
    headZone.setInteractive();

    // Body zone (middle 50%)
    const bodyZone = this.add.rectangle(0, -spriteH + spriteH * 0.5, spriteW * 0.7, spriteH * 0.45, 0x00ff00, 0);
    bodyZone.setData('zone', 'body');
    bodyZone.setInteractive();

    container.add([sprite, headZone, bodyZone]);
    container.setDepth(10);

    // Spawn animation
    container.setAlpha(0);
    container.setScale(0.5);
    this.tweens.add({
      targets: container,
      alpha: 1,
      scale: 1,
      duration: 300,
      ease: 'Back.easeOut',
    });

    // Random movement
    const moveSpeed = Phaser.Math.Between(30, 80);
    const moveRange = Phaser.Math.Between(60, 150);
    const startX = x;
    this.tweens.add({
      targets: container,
      x: { from: startX - moveRange / 2, to: startX + moveRange / 2 },
      duration: Phaser.Math.Between(1500, 3000),
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.enemies.push(container);
    this.enemySpawnTimes.set(id, Date.now());

    // Auto-despawn after some time
    this.time.delayedCall(Phaser.Math.Between(4000, 7000), () => {
      this.removeEnemy(container, false);
    });
  }

  private shoot(px: number, py: number) {
    this.totalShots++;

    // Muzzle flash effect
    const flash = this.add.circle(px, py, 8, 0xffaa00, 0.8).setDepth(95);
    this.tweens.add({ targets: flash, scale: 3, alpha: 0, duration: 150, onComplete: () => flash.destroy() });

    // Screen shake
    this.cameras.main.shake(50, 0.002);

    // Check hit after latency delay
    this.time.delayedCall(this.latency, () => {
      let hitSomething = false;

      for (const enemy of [...this.enemies]) {
        const children = enemy.getAll() as Phaser.GameObjects.GameObject[];
        for (const child of children) {
          if (child instanceof Phaser.GameObjects.Rectangle && child.getData('zone')) {
            const bounds = child.getBounds();
            // Adjust bounds for container position
            const worldBounds = new Phaser.Geom.Rectangle(
              enemy.x + bounds.x - bounds.width / 2,
              enemy.y + bounds.y - bounds.height / 2,
              bounds.width,
              bounds.height
            );

            if (Phaser.Geom.Rectangle.Contains(worldBounds, px, py)) {
              const zone = child.getData('zone') as string;
              const enemyId = enemy.getData('id') as string;
              const spawnTime = this.enemySpawnTimes.get(enemyId) || Date.now();
              this.reactionTimes.push(Date.now() - spawnTime);

              if (zone === 'head') {
                this.headshots++;
                this.score += 10;
                this.showKillFeed('HEADSHOT! +10', '#ef4444');
              } else {
                this.bodyshots++;
                this.score += 5;
                this.showKillFeed('Body Hit +5', '#60a5fa');
              }
              this.hits++;
              this.removeEnemy(enemy, true);
              hitSomething = true;
              break;
            }
          }
        }
        if (hitSomething) break;
      }

      if (!hitSomething) {
        this.misses++;
        // Impact effect on miss
        const impact = this.add.circle(px, py, 3, 0x64748b, 0.6).setDepth(5);
        this.tweens.add({ targets: impact, alpha: 0, duration: 500, onComplete: () => impact.destroy() });
      }

      this.updateHUD();
    });
  }

  private removeEnemy(container: Phaser.GameObjects.Container, wasHit: boolean) {
    const idx = this.enemies.indexOf(container);
    if (idx === -1) return;
    this.enemies.splice(idx, 1);

    const enemyId = container.getData('id');
    this.enemySpawnTimes.delete(enemyId);

    if (wasHit) {
      // Hit animation - flash green and fall
      const hitFlash = this.add.circle(container.x, container.y - 30, 20, 0x22c55e, 0.5).setDepth(15);
      this.tweens.add({ targets: hitFlash, scale: 3, alpha: 0, duration: 300, onComplete: () => hitFlash.destroy() });

      this.tweens.add({
        targets: container,
        alpha: 0,
        angle: Phaser.Math.Between(-30, 30),
        y: container.y + 20,
        scaleX: 0.8,
        duration: 300,
        onComplete: () => container.destroy(),
      });
    } else {
      this.tweens.add({
        targets: container,
        alpha: 0,
        duration: 400,
        onComplete: () => container.destroy(),
      });
    }
  }

  private showKillFeed(text: string, color: string) {
    const { width } = this.scale;
    const yPos = 120 + this.killFeedTexts.length * 22;
    const feedText = this.add.text(width - 16, yPos, text, {
      fontSize: '14px',
      color,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(1, 0).setDepth(90).setAlpha(0);

    this.tweens.add({
      targets: feedText,
      alpha: 1,
      x: width - 20,
      duration: 200,
    });

    this.killFeedTexts.push(feedText);

    this.time.delayedCall(1500, () => {
      this.tweens.add({
        targets: feedText,
        alpha: 0,
        duration: 300,
        onComplete: () => {
          feedText.destroy();
          const i = this.killFeedTexts.indexOf(feedText);
          if (i !== -1) this.killFeedTexts.splice(i, 1);
        },
      });
    });
  }

  private endGame() {
    if (this.gameOver) return;
    this.gameOver = true;
    this.spawnTimer.destroy();
    this.gameTimer.destroy();
    this.input.setDefaultCursor('default');

    // Clean up enemies
    for (const e of this.enemies) e.destroy();
    this.enemies = [];

    // Game over overlay
    const { width, height } = this.scale;
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7).setDepth(100);
    const gameOverText = this.add.text(width / 2, height / 2 - 20, 'GAME OVER', {
      fontSize: '40px', color: '#ef4444', fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(101);

    this.add.text(width / 2, height / 2 + 30, `Score: ${this.score}  |  Hits: ${this.hits}  |  Headshots: ${this.headshots}`, {
      fontSize: '16px', color: '#94a3b8', fontFamily: 'monospace',
    }).setOrigin(0.5).setDepth(101);

    this.time.delayedCall(2000, () => {
      this.onGameEnd({
        hits: this.hits,
        total: this.totalShots,
        reactionTimes: this.reactionTimes,
        score: this.score,
        headshots: this.headshots,
        bodyshots: this.bodyshots,
        misses: this.misses,
      });
    });
  }
}

const PhaserGame = ({ latency, onGameEnd }: PhaserGameProps) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const onGameEndRef = useRef(onGameEnd);
  onGameEndRef.current = onGameEnd;

  const stableOnGameEnd = useCallback(
    (...args: Parameters<PhaserGameProps['onGameEnd']>) => onGameEndRef.current(...args),
    []
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const width = Math.min(containerRef.current.clientWidth, 900);
    const height = Math.min(window.innerHeight - 180, 550);

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      width,
      height,
      backgroundColor: '#0f1628',
      scene: FPSScene,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    });

    game.scene.start('FPSScene', { latency, onGameEnd: stableOnGameEnd });
    gameRef.current = game;

    return () => {
      game.destroy(true);
      gameRef.current = null;
    };
  }, [latency, stableOnGameEnd]);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-[900px] mx-auto rounded-xl overflow-hidden border border-border shadow-2xl"
      style={{ minHeight: 300 }}
    />
  );
};

export default PhaserGame;
