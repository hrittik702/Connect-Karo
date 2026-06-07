import React, { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    console.log("AnimatedBackground Loaded");
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId;
    let particlesArray = [];
    const numberOfParticles = 100; // Requirement 1: Increased density
    let mouse = { x: null, y: null, radius: 160 };

    // Persistent storage for the 3 large floating gradient orbs (Layer 2)
    let orbs = [
      { x: 0, y: 0, vx: 0.15, vy: 0.12, radius: 0 },
      { x: 0, y: 0, vx: -0.10, vy: 0.18, radius: 0 },
      { x: 0, y: 0, vx: 0.12, vy: -0.10, radius: 0 },
    ];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Initialize orb positions & sizes proportionally to screen dimensions
      const minDimension = Math.min(canvas.width, canvas.height);
      orbs[0].radius = minDimension * 0.40;
      orbs[1].radius = minDimension * 0.45;
      orbs[2].radius = minDimension * 0.35;

      orbs[0].x = canvas.width * 0.25;
      orbs[0].y = canvas.height * 0.30;
      orbs[1].x = canvas.width * 0.70;
      orbs[1].y = canvas.height * 0.45;
      orbs[2].x = canvas.width * 0.45;
      orbs[2].y = canvas.height * 0.75;

      init();
    };

    const handleMouseMove = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    // Helper to fetch accent colors dynamically
    const getThemeAccentColor = (alpha = 1) => {
      const computedStyle = getComputedStyle(document.documentElement);
      const accentVar = computedStyle.getPropertyValue("--ec-accent").trim();

      if (!accentVar) {
        return `rgba(63,185,80,${alpha})`;
      }

      const rgb = accentVar
        .replace(/\s+/g, ",")
        .replace(/,+/g, ",");

      return `rgba(${rgb},${alpha})`;
    };

    class Particle {
      constructor(x, y, directionX, directionY, size) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random() * 25 + 1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = getThemeAccentColor(0.18); // Requirement 3: Increased particle visibility
        ctx.fill();
      }

      update() {
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let forceX = forceDirectionX * force * this.density * 0.8;
            let forceY = forceDirectionY * force * this.density * 0.8;
            this.x -= forceX;
            this.y -= forceY;
          } else {
            if (this.x !== this.baseX) {
              let dx = this.x - this.baseX;
              this.x -= dx / 12;
            }
            if (this.y !== this.baseY) {
              let dy = this.y - this.baseY;
              this.y -= dy / 12;
            }
          }
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 12;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 12;
          }
        }

        // Slow drift
        this.baseX += this.directionX * 0.4;
        this.baseY += this.directionY * 0.4;

        // Bounce off canvas edges
        if (this.baseX < 0 || this.baseX > canvas.width) {
          this.directionX = -this.directionX;
        }
        if (this.baseY < 0 || this.baseY > canvas.height) {
          this.directionY = -this.directionY;
        }

        this.draw();
      }
    }

    function init() {
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 2.2 + 0.6; // Slightly larger range
        let x = Math.random() * (canvas.width - size * 4) + size * 2;
        let y = Math.random() * (canvas.height - size * 4) + size * 2;
        let directionX = Math.random() * 0.3 - 0.15;
        let directionY = Math.random() * 0.3 - 0.15;
        particlesArray.push(new Particle(x, y, directionX, directionY, size));
      }
    }

    function connect() {
      const maxDistance = Math.min(130, canvas.width / 8.5); // Optimized dynamic range cap
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = dx * dx + dy * dy;
          if (distance < maxDistance * maxDistance) {
            let opacityValue = 1 - Math.sqrt(distance) / maxDistance;
            // Requirement 2: Increased line visibility by ~40% (0.15 -> 0.25)
            ctx.strokeStyle = getThemeAccentColor(opacityValue * 0.12);
            ctx.lineWidth = 0.4; // Thicker line
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      //ctx.filter = "blur(0.4px)";

      // Layer 1: Ambient Glow (CSS root background handles this, but we draw a subtle header highlight)
      let headGlow = ctx.createRadialGradient(canvas.width / 2, 0, 0, canvas.width / 2, 0, canvas.height * 0.85);
      headGlow.addColorStop(0, "rgba(63,185,80,0.06)");
      headGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = headGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Layer 2: Reusable Floating Gradient Orbs
      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Bounce float boundary logic
        if (orb.x < -orb.radius * 0.2 || orb.x > canvas.width + orb.radius * 0.2) {
          orb.vx = -orb.vx;
        }
        if (orb.y < -orb.radius * 0.2 || orb.y > canvas.height + orb.radius * 0.2) {
          orb.vy = -orb.vy;
        }

        // Draw ambient gradient orb
        let orbGradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        orbGradient.addColorStop(0, "rgba(63,185,80,0.015)"); // Low opacity
        orbGradient.addColorStop(0.5, "rgba(63,185,80,0.005)"); // Subtle outer fade
        orbGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = orbGradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Layer 3: Particle Network
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connect();
      animationId = requestAnimationFrame(animate);
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);

    handleResize();
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
