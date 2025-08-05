class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Game state
        this.score = 0;
        this.lives = 3;
        this.phase = 1;
        this.gameRunning = true;
        
        // Game objects
        this.player = new Player(this.width / 2, this.height / 2);
        this.bullets = [];
        this.asteroids = [];
        this.particles = [];
        this.explosions = [];
        
        // Input handling
        this.keys = {};
        this.setupInput();
        
        // Load images
        this.loadImages();
        
        // Start game loop
        this.gameLoop();
        
        // Spawn initial asteroids
        this.spawnAsteroids();
    }
    
    loadImages() {
        this.playerImg = new Image();
        this.playerImg.src = 'player.png';
        
        this.asteroidImg = new Image();
        this.asteroidImg.src = 'meteoro.png';
    }
    
    setupInput() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Space') {
                e.preventDefault();
                this.shoot();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restart();
        });
    }
    
    shoot() {
        if (!this.gameRunning) return;
        
        const bullet = new Bullet(
            this.player.x + Math.cos(this.player.rotation) * 30,
            this.player.y + Math.sin(this.player.rotation) * 30,
            Math.cos(this.player.rotation) * 10,
            Math.sin(this.player.rotation) * 10
        );
        this.bullets.push(bullet);
        
        // Add shooting particles
        for (let i = 0; i < 2; i++) {
            this.particles.push(new Particle(
                bullet.x,
                bullet.y,
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 3,
                '#4a90e2',
                15
            ));
        }
    }
    
    spawnAsteroids() {
        const count = Math.min(2 + this.phase, 8);
        for (let i = 0; i < count; i++) {
            let x, y;
            do {
                x = Math.random() * this.width;
                y = Math.random() * this.height;
            } while (Math.hypot(x - this.player.x, y - this.player.y) < 100);
            
            const asteroid = new Asteroid(x, y, 3);
            this.asteroids.push(asteroid);
        }
    }
    
    update() {
        if (!this.gameRunning) return;
        
        // Update player
        this.player.update(this.keys, this.width, this.height);
        
        // Update bullets
        this.bullets = this.bullets.filter(bullet => {
            bullet.update();
            return bullet.x > 0 && bullet.x < this.width && 
                   bullet.y > 0 && bullet.y < this.height;
        });
        
        // Update asteroids
        this.asteroids = this.asteroids.filter(asteroid => {
            asteroid.update(this.width, this.height);
            return asteroid.lives > 0;
        });
        
        // Update particles
        this.particles = this.particles.filter(particle => {
            particle.update();
            return particle.life > 0;
        });
        
        // Update explosions
        this.explosions = this.explosions.filter(explosion => {
            explosion.update();
            return explosion.particles.length > 0;
        });
        
        // Check collisions
        this.checkCollisions();
        
        // Check if all asteroids are destroyed
        if (this.asteroids.length === 0) {
            this.nextPhase();
        }
    }
    
    checkCollisions() {
        // Bullet vs Asteroid collisions
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            for (let j = this.asteroids.length - 1; j >= 0; j--) {
                const asteroid = this.asteroids[j];
                if (this.checkCollision(bullet, asteroid)) {
                    // Remove bullet
                    this.bullets.splice(i, 1);
                    
                    // Damage asteroid
                    asteroid.lives--;
                    this.score += 10;
                    
                    // Create explosion
                    this.createExplosion(asteroid.x, asteroid.y, asteroid.size);
                    
                    // Split asteroid if it has lives left
                    if (asteroid.lives > 0) {
                        this.splitAsteroid(asteroid);
                    }
                    
                    break;
                }
            }
        }
        
        // Player vs Asteroid collisions
        for (const asteroid of this.asteroids) {
            if (this.checkCollision(this.player, asteroid)) {
                this.playerHit();
                break;
            }
        }
    }
    
    checkCollision(obj1, obj2) {
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < obj1.radius + obj2.radius;
    }
    
    splitAsteroid(asteroid) {
        const newSize = asteroid.size * 0.7;
        const newLives = asteroid.lives;
        
        for (let i = 0; i < 2; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 2;
            const newAsteroid = new Asteroid(
                asteroid.x + Math.cos(angle) * 20,
                asteroid.y + Math.sin(angle) * 20,
                newLives
            );
            newAsteroid.vx = Math.cos(angle) * speed;
            newAsteroid.vy = Math.sin(angle) * speed;
            newAsteroid.size = newSize;
            this.asteroids.push(newAsteroid);
        }
    }
    
    createExplosion(x, y, size) {
        const explosion = new Explosion(x, y, size);
        this.explosions.push(explosion);
    }
    
    playerHit() {
        this.lives--;
        this.createExplosion(this.player.x, this.player.y, 30);
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            // Reset player position
            this.player.x = this.width / 2;
            this.player.y = this.height / 2;
            this.player.vx = 0;
            this.player.vy = 0;
        }
    }
    
    nextPhase() {
        this.phase++;
        this.spawnAsteroids();
        
        // Create phase transition effect
        for (let i = 0; i < 20; i++) {
            this.particles.push(new Particle(
                Math.random() * this.width,
                Math.random() * this.height,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8,
                '#f39c12',
                40
            ));
        }
    }
    
    gameOver() {
        this.gameRunning = false;
        document.getElementById('gameOver').style.display = 'block';
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalPhase').textContent = this.phase;
    }
    
    restart() {
        this.score = 0;
        this.lives = 3;
        this.phase = 1;
        this.gameRunning = true;
        this.bullets = [];
        this.asteroids = [];
        this.particles = [];
        this.explosions = [];
        
        this.player.x = this.width / 2;
        this.player.y = this.height / 2;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.rotation = 0;
        
        document.getElementById('gameOver').style.display = 'none';
        this.spawnAsteroids();
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw stars background
        this.drawStars();
        
        // Draw game objects
        this.player.draw(this.ctx, this.playerImg);
        
        this.bullets.forEach(bullet => bullet.draw(this.ctx));
        this.asteroids.forEach(asteroid => asteroid.draw(this.ctx, this.asteroidImg));
        this.particles.forEach(particle => particle.draw(this.ctx));
        this.explosions.forEach(explosion => explosion.draw(this.ctx));
        
        // Update UI
        document.getElementById('score').textContent = `Pontuação: ${this.score}`;
        document.getElementById('lives').textContent = `Vidas: ${this.lives}`;
        document.getElementById('phase').textContent = `Fase: ${this.phase}`;
    }
    
    drawStars() {
        this.ctx.fillStyle = '#fff';
        for (let i = 0; i < 50; i++) {
            const x = (i * 37) % this.width;
            const y = (i * 73) % this.height;
            const size = Math.sin(Date.now() * 0.001 + i) * 0.5 + 0.5;
            this.ctx.globalAlpha = size;
            this.ctx.fillRect(x, y, 1, 1);
        }
        this.ctx.globalAlpha = 1;
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.rotation = 0;
        this.radius = 20;
        this.speed = 0.5;
        this.maxSpeed = 8;
        this.friction = 0.98;
    }
    
    update(keys, width, height) {
        // Rotation
        if (keys['ArrowLeft'] || keys['KeyA']) this.rotation -= 0.1;
        if (keys['ArrowRight'] || keys['KeyD']) this.rotation += 0.1;
        
        // Movement
        if (keys['ArrowUp'] || keys['KeyW']) {
            this.vx += Math.cos(this.rotation) * this.speed;
            this.vy += Math.sin(this.rotation) * this.speed;
        }
        
        // Apply friction
        this.vx *= this.friction;
        this.vy *= this.friction;
        
        // Limit speed
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > this.maxSpeed) {
            this.vx = (this.vx / speed) * this.maxSpeed;
            this.vy = (this.vy / speed) * this.maxSpeed;
        }
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Wrap around screen
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
    }
    
    draw(ctx, img) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        if (img.complete) {
            ctx.drawImage(img, -20, -20, 40, 40);
        } else {
            // Fallback triangle
            ctx.fillStyle = '#4a90e2';
            ctx.beginPath();
            ctx.moveTo(20, 0);
            ctx.lineTo(-10, -10);
            ctx.lineTo(-10, 10);
            ctx.closePath();
            ctx.fill();
        }
        
        ctx.restore();
    }
}

class Bullet {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = 3;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
    }
    
    draw(ctx) {
        ctx.fillStyle = '#4a90e2';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.shadowColor = '#4a90e2';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

class Asteroid {
    constructor(x, y, lives) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        this.lives = lives;
        this.size = 30 + lives * 10;
        this.radius = this.size / 2;
        
        // Color variations based on phase
        this.colors = ['#8B4513', '#A0522D', '#CD853F', '#D2691E', '#B8860B'];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    }
    
    update(width, height) {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        
        // Wrap around screen
        if (this.x < -this.size) this.x = width + this.size;
        if (this.x > width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = height + this.size;
        if (this.y > height + this.size) this.y = -this.size;
    }
    
    draw(ctx, img) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        if (img.complete) {
            ctx.drawImage(img, -this.size/2, -this.size/2, this.size, this.size);
        } else {
            // Fallback circle
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Add some texture
            ctx.strokeStyle = '#654321';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius * 0.7, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
    }
}

class Particle {
    constructor(x, y, vx, vy, color, life) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.size = Math.random() * 3 + 1;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.life--;
    }
    
    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

class Explosion {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.particles = [];
        
        const particleCount = Math.min(Math.floor(size / 3), 15);
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = Math.random() * 4 + 2;
            const colors = ['#ff6b6b', '#ffa500', '#ffff00', '#ff4500'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            this.particles.push(new Particle(
                x,
                y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                color,
                20 + Math.random() * 20
            ));
        }
    }
    
    update() {
        this.particles.forEach(particle => particle.update());
        this.particles = this.particles.filter(particle => particle.life > 0);
    }
    
    draw(ctx) {
        this.particles.forEach(particle => particle.draw(ctx));
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
}); 