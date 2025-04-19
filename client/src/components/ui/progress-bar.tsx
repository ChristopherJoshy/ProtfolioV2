import { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

interface ProgressBarProps {
  value: number;
  color?: string;
  label?: string;
  animationDelay?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = "primary",
  label,
  animationDelay = 0,
}) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start({
        width: `${value}%`,
        transition: {
          duration: 1.5,
          delay: animationDelay,
          ease: [0.33, 1, 0.68, 1], // Cubic bezier for spring-like effect
        },
      });
    }
  }, [controls, isInView, value, animationDelay]);

  return (
    <div ref={ref} className="space-y-2">
      {label && (
        <div className="flex justify-between">
          <span className="font-medium">{label}</span>
          <span className="text-muted-foreground">{value}%</span>
        </div>
      )}
      <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-${color}`}
          initial={{ width: "0%" }}
          animate={controls}
        />
      </div>
    </div>
  );
};

interface ScrollProgressBarProps {
  color?: string;
}

export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({
  color = "primary",
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const currentScrollPos = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (currentScrollPos / scrollHeight) * 100;
      setScrollProgress(scrollPercentage);
    };

    window.addEventListener("scroll", updateScrollProgress);
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[100]">
      <motion.div
        className={`h-full bg-${color}`}
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};
