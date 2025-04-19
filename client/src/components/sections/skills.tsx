import React, { useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Skill } from "@/types";
import { Youtube, Github, ExternalLink } from "lucide-react";

interface SkillsProps {
  programmingSkills: Skill[];
  frameworkSkills: Skill[];
  techStacks: {
    name: string;
    icon: string;
    color: string;
    description: string;
  }[];
  youtubeChannels: {
    name: string;
    url: string;
  }[];
  githubStats?: {
    stars: number;
    commits: number;
    pullRequests: number;
    issues: number;
  };
  topLanguages?: {
    name: string;
    percentage: number;
    color: string;
  }[];
}

const Skills: React.FC<SkillsProps> = ({
  programmingSkills,
  frameworkSkills,
  techStacks,
  youtubeChannels,
  githubStats,
  topLanguages,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="skills" className="py-20 bg-card">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold font-poppins mb-4">Technical Skills</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A showcase of my technical abilities and programming languages that I've been working with.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            <motion.h3
              className="text-2xl font-semibold font-poppins mb-6 flex items-center gap-2"
              variants={itemVariants}
            >
              <i className="fas fa-code text-primary"></i>
              <span>Programming Languages</span>
            </motion.h3>

            <div className="space-y-5">
              {programmingSkills.map((skill, index) => (
                <motion.div key={skill.id} variants={itemVariants}>
                  <ProgressBar
                    label={skill.name}
                    value={skill.proficiency}
                    animationDelay={index * 0.1}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            <motion.h3
              className="text-2xl font-semibold font-poppins mb-6 flex items-center gap-2"
              variants={itemVariants}
            >
              <i className="fas fa-laptop-code text-primary"></i>
              <span>Frameworks & Tools</span>
            </motion.h3>

            <div className="space-y-5">
              {frameworkSkills.map((skill, index) => (
                <motion.div key={skill.id} variants={itemVariants}>
                  <ProgressBar
                    label={skill.name}
                    value={skill.proficiency}
                    color={skill.color || "primary"}
                    animationDelay={index * 0.1}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-2xl font-semibold font-poppins mb-6 flex items-center gap-2">
            <i className="fas fa-layer-group text-primary"></i>
            <span>Technology Stacks</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {techStacks.map((stack, index) => (
              <motion.div
                key={index}
                className="bg-background p-6 rounded-lg border border-border hover:border-primary/30 transition-all hover:shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                    style={{
                      backgroundColor: `${stack.color}20`,
                      color: stack.color,
                    }}
                  >
                    <i className={stack.icon}></i>
                  </div>
                  <h4 className="font-medium">{stack.name}</h4>
                  <p className="text-sm text-muted-foreground">{stack.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-2xl font-semibold font-poppins mb-6 flex items-center gap-2">
            <i className="fas fa-chart-pie text-primary"></i>
            <span>Coding Activity</span>
          </h3>

          <div className="bg-background p-6 rounded-lg border border-border">
            <h4 className="text-xl font-medium mb-6 text-center text-primary">
              Most Used Languages
            </h4>

            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {topLanguages?.map((lang, index) => (
                <div key={index} className="relative w-32 h-32">
                  <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                    <div className="absolute inset-0">
                      <svg width="100%" height="100%" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#2D3748" strokeWidth="8" />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke={lang.color}
                          strokeWidth="8"
                          strokeDasharray="251.2"
                          initial={{ strokeDashoffset: 251.2 }}
                          animate={{ strokeDashoffset: 251.2 * (1 - lang.percentage / 100) }}
                          transition={{ duration: 1.5, delay: index * 0.2 }}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                    </div>
                    <div className="text-center">
                      <h5 className="font-semibold">{lang.name}</h5>
                      <p className="text-sm text-muted-foreground">{lang.percentage}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* GitHub Stats Section */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-semibold font-poppins mb-6 flex items-center gap-2">
            <Github className="text-primary" />
            <span>GitHub Profile</span>
          </h3>
          
          <div className="bg-background p-6 rounded-lg border border-border">
            <div className="flex flex-col md:flex-row items-center mb-6 gap-4">
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-xl font-medium mb-2">Christopher Joshy</h4>
                <p className="text-muted-foreground mb-4">
                  Full-stack developer focused on JavaScript, React, and AI integration
                </p>
                <a 
                  href="https://github.com/ChristopherJoshy" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Github size={16} />
                  <span>View Profile</span>
                </a>
              </div>
              
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div className="bg-card p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1 justify-center">
                      <i className="fas fa-star text-yellow-400"></i>
                      <h5 className="font-medium">Total Stars</h5>
                    </div>
                    <p className="text-2xl font-semibold">{githubStats?.stars || "15"}</p>
                  </div>
                  <div className="bg-card p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1 justify-center">
                      <i className="fas fa-code-branch text-green-400"></i>
                      <h5 className="font-medium">Public Repos</h5>
                    </div>
                    <p className="text-2xl font-semibold">{githubStats?.commits || "40"}</p>
                  </div>
                  <div className="bg-card p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1 justify-center">
                      <i className="fas fa-users text-blue-400"></i>
                      <h5 className="font-medium">Followers</h5>
                    </div>
                    <p className="text-2xl font-semibold">{githubStats?.pullRequests || "17"}</p>
                  </div>
                  <div className="bg-card p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1 justify-center">
                      <i className="fas fa-user-plus text-purple-400"></i>
                      <h5 className="font-medium">Following</h5>
                    </div>
                    <p className="text-2xl font-semibold">{githubStats?.issues || "5"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Learning Resources Section */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-2xl font-semibold font-poppins mb-6 flex items-center gap-2">
            <i className="fas fa-graduation-cap text-primary"></i>
            <span>Learning Resources</span>
          </h3>
          
          <div className="bg-background p-6 rounded-lg border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {youtubeChannels.map((channel, index) => (
                <motion.a
                  key={index}
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-card rounded-lg hover:bg-card/80 transition-colors group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
                    <Youtube className="text-red-500" size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{channel.name}</h4>
                    <p className="text-sm text-muted-foreground">Educational Channel</p>
                  </div>
                  <ExternalLink size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
