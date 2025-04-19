import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { floatElement } from "@/lib/motion";

interface TechHexagonProps {
  icon: string;
  color: string;
  top?: string;
  left?: string;
  size?: string;
  delay?: number;
}

export const TechHexagon: React.FC<TechHexagonProps> = ({
  icon,
  color,
  top = "15%",
  left = "10%", 
  size = "4rem",
  delay = 0,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (ref.current) {
      // Use IntersectionObserver to check if element is in viewport
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, []);

  useEffect(() => {
    if (isVisible && ref.current) {
      controls.start({
        opacity: 1,
        y: [50, 0],
        transition: {
          delay: delay,
          duration: 0.6,
          ease: "easeOut",
        },
      });

      // Start floating animation
      const amplitude = Math.random() * 10 + 15; // Random amplitude between 15-25px
      const duration = Math.random() * 2 + 4; // Random duration between 4-6s
      
      if (ref.current) {
        floatElement(ref.current, amplitude, duration);
      }
    }
  }, [isVisible, controls, delay]);

  return (
    <motion.div
      ref={ref}
      className="absolute"
      style={{
        top,
        left,
        width: size,
        height: size,
        clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        background: `rgba(${hexToRgb(color)}, 0.1)`,
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <i className={`${icon} text-xl`} style={{ color: `rgba(${hexToRgb(color)}, 0.6)` }}></i>
      </div>
    </motion.div>
  );
};

// Helper function to convert hex color to RGB
function hexToRgb(hex: string): string {
  // Remove the # if present
  hex = hex.replace(/^#/, '');
  
  // Parse the hex values to RGB
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  
  return `${r}, ${g}, ${b}`;
}
