// This file uses DOM manipulation and CSS transitions instead of the motion library
// since we're having dependency issues with the motion library
// Enhanced with more advanced animations for a more interactive experience

// Animate elements when they come into view
export const fadeInUp = (element: HTMLElement, delay: number = 0) => {
  if (!element) return null;
  
  // Set up the IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }, delay * 1000);
        observer.unobserve(element);
      }
    });
  }, { threshold: 0.1 });
  
  // Set initial styles
  element.style.opacity = '0';
  element.style.transform = 'translateY(50px)';
  element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  
  // Start observing
  observer.observe(element);
  
  return () => observer.unobserve(element);
};

// Animate elements with stagger effect
export const staggerFadeIn = (elements: HTMLElement[], delay: number = 0, staggerDelay: number = 0.1) => {
  if (!elements.length) return null;
  
  // Set up the IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      elements.forEach((element, index) => {
        setTimeout(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }, (delay + index * staggerDelay) * 1000);
      });
      observer.unobserve(elements[0]);
    }
  }, { threshold: 0.1 });
  
  // Set initial styles
  elements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  
  // Start observing the first element
  observer.observe(elements[0]);
  
  return () => observer.unobserve(elements[0]);
};

// Animate progress bars
export const animateProgress = (element: HTMLElement, targetWidth: number) => {
  if (!element) return null;
  
  // Set up the IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setTimeout(() => {
        element.style.width = `${targetWidth}%`;
      }, 100);
      observer.unobserve(element);
    }
  }, { threshold: 0.1 });
  
  // Set initial styles
  element.style.width = '0%';
  element.style.transition = 'width 1s ease';
  
  // Start observing
  observer.observe(element);
  
  return () => observer.unobserve(element);
};

// Scroll parallax effect
export const parallaxScroll = (element: HTMLElement, speed: number = 0.2) => {
  if (!element) return null;
  
  const handleScroll = () => {
    const scrollTop = window.pageYOffset;
    const elementRect = element.getBoundingClientRect();
    const elementTop = elementRect.top + scrollTop;
    const relativeScroll = scrollTop - elementTop;
    
    element.style.transform = `translateY(${relativeScroll * speed}px)`;
  };
  
  window.addEventListener('scroll', handleScroll);
  
  return () => window.removeEventListener('scroll', handleScroll);
};

// Animated underline effect
export const animateUnderline = (element: HTMLElement) => {
  if (!element) return null;
  
  const underline = element.querySelector('.underline') as HTMLElement;
  if (!underline) return null;
  
  // Set up the IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      underline.style.transform = 'scaleX(1)';
      observer.unobserve(element);
    }
  }, { threshold: 0.1 });
  
  // Set initial styles
  underline.style.transform = 'scaleX(0)';
  underline.style.transformOrigin = 'left';
  underline.style.transition = 'transform 0.6s ease';
  
  // Start observing
  observer.observe(element);
  
  return () => observer.unobserve(element);
};

// Mouse follow effect
export const mouseFollow = (element: HTMLElement, friction: number = 0.1) => {
  if (!element) return null;
  
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  let animationFrame: number;

  const handleMouseMove = (e: MouseEvent) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  };

  const update = () => {
    const dx = mouseX - currentX;
    const dy = mouseY - currentY;
    
    currentX += dx * friction;
    currentY += dy * friction;
    
    element.style.transform = `translate(${currentX}px, ${currentY}px)`;
    
    animationFrame = requestAnimationFrame(update);
  };

  document.addEventListener('mousemove', handleMouseMove);
  animationFrame = requestAnimationFrame(update);
  
  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
    cancelAnimationFrame(animationFrame);
  };
};

// Text typing animation
export const typeText = (element: HTMLElement, text: string, speed: number = 50) => {
  if (!element) return null;
  
  element.textContent = '';
  let i = 0;
  
  const typing = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(typing);
    }
  }, speed);
  
  return () => clearInterval(typing);
};

// Floating animation with CSS
export const floatElement = (element: HTMLElement, amplitude: number = 20, duration: number = 3) => {
  if (!element) return null;
  
  // Generate a random delay
  const randomDelay = Math.random() * 2;
  
  // Set animation using CSS
  element.style.animation = `float ${duration}s ease-in-out ${randomDelay}s infinite`;
  
  // Add keyframes if they don't exist
  if (!document.querySelector('style#float-animation')) {
    const style = document.createElement('style');
    style.id = 'float-animation';
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(${amplitude}px); }
      }
    `;
    document.head.appendChild(style);
  }
  
  return () => {
    element.style.animation = '';
  };
};

// Rotate animation with CSS
export const rotateElement = (element: HTMLElement, duration: number = 20) => {
  if (!element) return null;
  
  // Set animation using CSS
  element.style.animation = `rotate ${duration}s linear infinite`;
  
  // Add keyframes if they don't exist
  if (!document.querySelector('style#rotate-animation')) {
    const style = document.createElement('style');
    style.id = 'rotate-animation';
    style.textContent = `
      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
  
  return () => {
    element.style.animation = '';
  };
};

// Glow effect on hover using CSS transitions
export const glowOnHover = (element: HTMLElement) => {
  if (!element) return null;
  
  // Set initial styles
  element.style.transition = 'box-shadow 0.3s ease';
  
  const handleMouseEnter = () => {
    element.style.boxShadow = '0 0 20px rgba(110, 87, 224, 0.5)';
  };
  
  const handleMouseLeave = () => {
    element.style.boxShadow = '0 0 0 rgba(110, 87, 224, 0)';
  };
  
  element.addEventListener('mouseenter', handleMouseEnter);
  element.addEventListener('mouseleave', handleMouseLeave);
  
  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
};

// Scale effect on hover using CSS transitions
export const scaleOnHover = (element: HTMLElement, scale: number = 1.05) => {
  if (!element) return null;
  
  // Set initial styles
  element.style.transition = 'transform 0.3s ease';
  
  const handleMouseEnter = () => {
    element.style.transform = `scale(${scale})`;
  };
  
  const handleMouseLeave = () => {
    element.style.transform = 'scale(1)';
  };
  
  element.addEventListener('mouseenter', handleMouseEnter);
  element.addEventListener('mouseleave', handleMouseLeave);
  
  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
};

// 3D tilt effect on hover
export const tiltOnHover = (element: HTMLElement, maxTilt: number = 10) => {
  if (!element) return null;
  
  // Set initial styles
  element.style.transition = 'transform 0.1s ease';
  element.style.transformStyle = 'preserve-3d';
  
  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xPercent = x / rect.width;
    const yPercent = y / rect.height;
    
    const xTilt = (xPercent - 0.5) * maxTilt;
    const yTilt = (0.5 - yPercent) * maxTilt;
    
    element.style.transform = `perspective(1000px) rotateX(${yTilt}deg) rotateY(${xTilt}deg)`;
  };
  
  const handleMouseLeave = () => {
    element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };
  
  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);
  
  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
};

// Wave animation for text (each letter animates in sequence)
export const waveText = (element: HTMLElement) => {
  if (!element) return null;
  
  const text = element.textContent || '';
  element.textContent = '';
  
  // Split text into spans
  for (let i = 0; i < text.length; i++) {
    const span = document.createElement('span');
    span.textContent = text[i];
    span.style.display = 'inline-block';
    span.style.opacity = '0';
    span.style.transform = 'translateY(20px)';
    span.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    span.style.transitionDelay = `${i * 0.05}s`;
    element.appendChild(span);
  }
  
  // Set up the IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      Array.from(element.children).forEach((span) => {
        (span as HTMLElement).style.opacity = '1';
        (span as HTMLElement).style.transform = 'translateY(0)';
      });
      observer.unobserve(element);
    }
  }, { threshold: 0.1 });
  
  // Start observing
  observer.observe(element);
  
  return () => observer.unobserve(element);
};

// Reveal on scroll with clip-path
export const clipPathReveal = (element: HTMLElement, direction: 'left' | 'right' | 'top' | 'bottom' = 'left') => {
  if (!element) return null;
  
  // Set initial clip-path based on direction
  let initialClipPath = '';
  let finalClipPath = 'inset(0)';
  
  switch (direction) {
    case 'left':
      initialClipPath = 'inset(0 100% 0 0)';
      break;
    case 'right':
      initialClipPath = 'inset(0 0 0 100%)';
      break;
    case 'top':
      initialClipPath = 'inset(100% 0 0 0)';
      break;
    case 'bottom':
      initialClipPath = 'inset(0 0 100% 0)';
      break;
  }
  
  // Set initial styles
  element.style.clipPath = initialClipPath;
  element.style.transition = 'clip-path 1s cubic-bezier(0.65, 0, 0.35, 1)';
  
  // Set up the IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      element.style.clipPath = finalClipPath;
      observer.unobserve(element);
    }
  }, { threshold: 0.1 });
  
  // Start observing
  observer.observe(element);
  
  return () => observer.unobserve(element);
};

// Magnetic effect (element follows cursor with stronger attraction when closer)
export const magneticEffect = (element: HTMLElement, strength: number = 30) => {
  if (!element) return null;
  
  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // Calculate distance from center
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    // Calculate strength based on distance (closer = stronger)
    const maxDistance = Math.max(window.innerWidth, window.innerHeight) / 2;
    const magnetism = Math.max(1 - distance / maxDistance, 0) * strength;
    
    // Apply transformation
    element.style.transform = `translate(${distanceX * magnetism / 100}px, ${distanceY * magnetism / 100}px)`;
  };
  
  const handleMouseLeave = () => {
    element.style.transform = 'translate(0, 0)';
  };
  
  element.style.transition = 'transform 0.3s ease';
  
  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);
  
  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
};

// Blur-in effect for images and sections
export const blurInEffect = (element: HTMLElement, delay: number = 0) => {
  if (!element) return null;
  
  // Set initial styles
  element.style.filter = 'blur(20px)';
  element.style.opacity = '0';
  element.style.transform = 'scale(1.05)';
  element.style.transition = 'opacity 1s ease, filter 1s ease, transform 1s ease';
  
  // Set up the IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setTimeout(() => {
        element.style.filter = 'blur(0)';
        element.style.opacity = '1';
        element.style.transform = 'scale(1)';
      }, delay * 1000);
      observer.unobserve(element);
    }
  }, { threshold: 0.1 });
  
  // Start observing
  observer.observe(element);
  
  return () => observer.unobserve(element);
};

// Bouncing animation
export const bounceElement = (element: HTMLElement, height: number = 10, duration: number = 1.5) => {
  if (!element) return null;
  
  // Set animation using CSS
  element.style.animation = `bounce ${duration}s ease infinite`;
  
  // Add keyframes if they don't exist
  if (!document.querySelector('style#bounce-animation')) {
    const style = document.createElement('style');
    style.id = 'bounce-animation';
    style.textContent = `
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-${height}px); }
      }
    `;
    document.head.appendChild(style);
  }
  
  return () => {
    element.style.animation = '';
  };
};

// Radial gradient following mouse cursor
export const followCursor = (element: HTMLElement) => {
  if (!element) return null;
  
  // Create a pseudo-element or use existing if available
  const gradientElement = document.createElement('div');
  gradientElement.className = 'cursor-gradient';
  gradientElement.style.position = 'absolute';
  gradientElement.style.width = '300px';
  gradientElement.style.height = '300px';
  gradientElement.style.borderRadius = '50%';
  gradientElement.style.background = 'radial-gradient(circle, rgba(110,87,224,0.2) 0%, rgba(255,255,255,0) 70%)';
  gradientElement.style.pointerEvents = 'none';
  gradientElement.style.transform = 'translate(-50%, -50%)';
  gradientElement.style.zIndex = '1';
  gradientElement.style.opacity = '0';
  gradientElement.style.transition = 'opacity 0.3s ease';
  
  document.body.appendChild(gradientElement);
  
  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    
    // Check if cursor is over the element
    if (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    ) {
      gradientElement.style.opacity = '1';
      gradientElement.style.left = `${e.clientX}px`;
      gradientElement.style.top = `${e.clientY}px`;
    } else {
      gradientElement.style.opacity = '0';
    }
  };
  
  document.addEventListener('mousemove', handleMouseMove);
  
  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.body.removeChild(gradientElement);
  };
};

// Typewriter effect with cursor
export const typewriterEffect = (element: HTMLElement, text: string, speed: number = 50, cursorBlink: boolean = true) => {
  if (!element) return null;
  
  // Create cursor element
  const cursorElement = document.createElement('span');
  cursorElement.className = 'typewriter-cursor';
  cursorElement.textContent = '|';
  cursorElement.style.display = 'inline-block';
  
  if (cursorBlink) {
    cursorElement.style.animation = 'cursorBlink 1s step-end infinite';
    
    // Add keyframes if they don't exist
    if (!document.querySelector('style#cursor-blink-animation')) {
      const style = document.createElement('style');
      style.id = 'cursor-blink-animation';
      style.textContent = `
        @keyframes cursorBlink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  // Clear the element and add cursor
  element.textContent = '';
  element.appendChild(cursorElement);
  
  let i = 0;
  let typing: number;
  
  const type = () => {
    if (i < text.length) {
      const char = text.charAt(i);
      const textNode = document.createTextNode(char);
      element.insertBefore(textNode, cursorElement);
      i++;
      typing = window.setTimeout(type, speed);
    }
  };
  
  typing = window.setTimeout(type, speed);
  
  return () => {
    window.clearTimeout(typing);
    if (element.contains(cursorElement)) {
      element.removeChild(cursorElement);
    }
  };
};
