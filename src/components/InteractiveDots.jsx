import { useEffect, useRef } from 'react';

export function InteractiveDots() {
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const dots = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Устанавливаем размер canvas
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initDots();
    };

    // Создаем точки
    const initDots = () => {
      dots.current = [];
      const numberOfDots = (canvas.width * canvas.height) / 5000;
      
      for (let i = 0; i < numberOfDots; i++) {
        dots.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1,
          originalRadius: Math.random() * 3 + 1,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          color: `hsla(${Math.random() * 360}, 70%, 50%, 0.8)`
        });
      }
    };

    // Анимация точек
    const animate = () => {
      ctx.fillStyle = 'rgba(245, 245, 245, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      dots.current.forEach(dot => {
        // Движение
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Отражение от границ
        if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;

        // Эффект увеличения при приближении мыши
        const dx = mousePos.current.x - dot.x;
        const dy = mousePos.current.y - dot.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
          const scale = (maxDistance - distance) / maxDistance;
          dot.radius = dot.originalRadius + (scale * 12);
        } else {
          dot.radius = dot.originalRadius;
        }

        // Рисуем точку с индивидуальным цветом
        ctx.beginPath();
        ctx.fillStyle = dot.color;
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fill();

        // Добавляем свечение
        ctx.shadowBlur = 15;
        ctx.shadowColor = dot.color;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Обработчик движения мыши
    const handleMouseMove = (event) => {
      mousePos.current = {
        x: event.clientX,
        y: event.clientY
      };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        background: 'linear-gradient(to bottom right, #f5f5f5, #e0e0e0)',
        pointerEvents: 'none'
      }}
    />
  );
} 