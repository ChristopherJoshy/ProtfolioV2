import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { TechHexagon } from "@/components/ui/tech-hexagon";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import BasicScene from "@/components/three/basic-scene";
import { typeText } from "@/lib/motion";
import { Profile } from "@/types";
import { StatsGrid } from "@/components/ui/stats-card";

interface HeroProps {
  profile: Profile;
}

const Hero: React.FC<HeroProps> = ({ profile }) => {
  const [activeTitleIndex, setActiveTitleIndex] = useState(0);
  const titleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const titles = profile.titles || [];
    if (titles.length === 0) return;

    // Type the current title
    if (titleRef.current) {
      typeText(titleRef.current, titles[activeTitleIndex], 100);
    }

    // Set interval to change title
    const interval = setInterval(() => {
      setActiveTitleIndex((prev) => (prev + 1) % titles.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeTitleIndex, profile.titles]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };

  // Tech stack icons with their positions and colors
  const techIcons = [
    { icon: "fab fa-react", color: "#61DAFB", top: "15%", left: "10%", delay: 0 },
    { icon: "fab fa-js", color: "#F7DF1E", top: "60%", left: "15%", delay: 1 },
    { icon: "fab fa-python", color: "#3776AB", top: "30%", left: "80%", delay: 0.5 },
    { icon: "fab fa-java", color: "#007396", top: "75%", left: "75%", delay: 1.5 },
    { icon: "fab fa-html5", color: "#E34F26", top: "40%", left: "40%", delay: 2 },
    { icon: "fab fa-css3", color: "#1572B6", top: "20%", left: "60%", delay: 1.2 },
  ];

  return (
    <section id="hero" className="min-h-screen pt-20 flex items-center relative overflow-hidden">
      {/* Background gradient and noise overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10"></div>
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.005\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%\' height=\'100%\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] mix-blend-overlay"></div>

      {/* Floating tech hexagons */}
      <div className="absolute inset-0 overflow-hidden">
        {techIcons.map((tech, index) => (
          <TechHexagon
            key={index}
            icon={tech.icon}
            color={tech.color}
            top={tech.top}
            left={tech.left}
            delay={tech.delay}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 z-20">
        {profile.stats && (
          <div className="mb-8">
            <StatsGrid stats={profile.stats} />
          </div>
        )}
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
          <motion.div
            className="md:w-1/2 flex flex-col items-start space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="rounded-lg bg-primary/10 px-4 py-2 border border-primary/20 inline-flex items-center gap-2"
              variants={itemVariants}
            >
              <span className="block w-3 h-3 rounded-full bg-primary animate-pulse"></span>
              <span className="text-sm font-medium">Available for freelance work</span>
            </motion.div>

            <motion.h1 className="text-4xl md:text-6xl font-bold font-poppins" variants={itemVariants}>
              <span className="block">Hello, I'm</span>
              <span className="text-primary cursor after:content-['|'] after:animate-[cursor-blink_1s_infinite]">
                {profile.firstName} {profile.lastName}
              </span>
            </motion.h1>

            <motion.div className="text-xl md:text-2xl text-muted-foreground" variants={itemVariants}>
              <span className="inline-block">
                <span ref={titleRef}>
                  {profile.titles && profile.titles.length > 0 ? profile.titles[0] : "Developer"}
                </span>
              </span>
            </motion.div>

            <motion.p className="text-muted-foreground text-lg max-w-lg" variants={itemVariants}>
              {profile.bio || "Building creative solutions through code. Currently pursuing B.Tech in Computer Science."}
            </motion.p>

            <motion.div className="flex flex-wrap gap-4" variants={itemVariants}>
              <Button asChild size="lg" className="transition-all transform hover:translate-y-[-2px] hover:shadow-lg">
                <a href="#projects">Explore Projects</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="transition-all transform hover:translate-y-[-2px]">
                <a href="#contact">Get in Touch</a>
              </Button>
            </motion.div>

            <motion.div className="flex gap-4 pt-4" variants={itemVariants}>
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all transform hover:scale-110 hover:shadow-md"
                >
                  <i className="fab fa-github text-xl"></i>
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-[#0077b5] hover:text-white transition-all transform hover:scale-110 hover:shadow-md"
                >
                  <i className="fab fa-linkedin-in text-xl"></i>
                </a>
              )}
              {profile.instagram && (
                <a
                  href={profile.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-gradient-to-br from-[#F9CE34] via-[#EE2A7B] to-[#6228D7] hover:text-white transition-all transform hover:scale-110 hover:shadow-md"
                >
                  <i className="fab fa-instagram text-xl"></i>
                </a>
              )}
            </motion.div>
          </motion.div>

          <motion.div 
            className="md:w-1/2 flex justify-center md:justify-end"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent rounded-full blur-3xl transform scale-75 -z-10"></div>
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/30 shadow-2xl relative z-10">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted">
                    <BasicScene />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        <a
          href="#about"
          className="text-muted-foreground hover:text-primary transition-colors"
          aria-label="Scroll down"
        >
          <ChevronDown size={28} />
        </a>
      </motion.div>
    </section>
  );
};

export default Hero;
