import { useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { JourneyItem as JourneyItemType } from "@/types";

interface JourneyItemProps {
  item: JourneyItemType;
  index: number;
}

export const JourneyItem: React.FC<JourneyItemProps> = ({ item, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.2,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      className="relative"
      variants={variants}
      initial="hidden"
      animate={controls}
    >
      <div className="absolute w-5 h-5 bg-primary rounded-full -left-[1.125rem] top-0">
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(110, 87, 224, 0.3)",
              "0 0 0 10px rgba(110, 87, 224, 0)"
            ]
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeOut"
          }}
        />
      </div>
      
      <div className="bg-card p-6 rounded-lg border border-border hover:border-primary/30 transition-all hover:shadow-lg">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg">{item.title}</h3>
          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
            {item.date}
          </span>
        </div>
        <p className="text-muted-foreground">{item.description}</p>
      </div>
    </motion.div>
  );
};
