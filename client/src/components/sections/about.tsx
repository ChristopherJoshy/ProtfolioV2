import React, { useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, GraduationCap, MapPin, Mail, Phone } from "lucide-react";
import { JourneyItem } from "@/components/ui/journey-item";
import { JourneyItem as JourneyItemType } from "@/types";

interface AboutProps {
  profile: {
    firstName: string;
    lastName: string;
    bio: string;
    education?: string;
    location?: string;
    email?: string;
    phone?: string;
    resumeUrl?: string;
  };
  journeyItems: JourneyItemType[];
}

const About: React.FC<AboutProps> = ({ profile, journeyItems }) => {
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

  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12">
          <motion.div
            ref={ref}
            className="md:w-1/2"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            <motion.h2
              className="text-3xl font-bold font-poppins mb-6 relative inline-block"
              variants={itemVariants}
            >
              <span className="relative z-10">About Me</span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-primary/20 -z-10 transform -rotate-1"></span>
            </motion.h2>

            <div className="space-y-6 text-muted-foreground">
              <motion.p variants={itemVariants}>
                My name is {profile.firstName} {profile.lastName}, a passionate and driven aspiring developer with a deep interest in web technologies, game development, and artificial intelligence.
              </motion.p>
              
              <motion.p variants={itemVariants}>
                {profile.bio || "Currently pursuing my B.Tech in Computer Science at St. Joseph's College of Engineering, I'm actively expanding my programming knowledge across multiple domains while building exciting projects."}
              </motion.p>
              
              <motion.p variants={itemVariants}>
                I believe in creating technology that makes a positive impact, and I'm constantly learning new skills to expand my technical toolkit.
              </motion.p>

              <motion.div className="pt-4 space-y-4" variants={itemVariants}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <GraduationCap size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium">Education</h3>
                    <p className="text-muted-foreground text-sm">{profile.education || "B.Tech in Computer Science, St. Joseph's College of Engineering"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p className="text-muted-foreground text-sm">{profile.location || "Puthenparambil (h), Ponga P.O, Nedumudy, Alappuzha, Kerala 688503"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <a
                      href={`mailto:${profile.email || "christopherjoshy4@gmail.com"}`}
                      className="text-muted-foreground text-sm hover:text-primary transition-colors"
                    >
                      {profile.email || "christopherjoshy4@gmail.com"}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <a
                      href={`tel:${profile.phone || "+918075809531"}`}
                      className="text-muted-foreground text-sm hover:text-primary transition-colors"
                    >
                      {profile.phone || "+91 8075809531"}
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div className="mt-8" variants={itemVariants}>
                <Button asChild>
                  <a href={profile.resumeUrl || "#"} target="_blank" rel="noopener noreferrer" download>
                    <Download className="mr-2 h-4 w-4" />
                    Download CV
                  </a>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <div className="md:w-1/2">
            <motion.h2
              className="text-3xl font-bold font-poppins mb-6 relative inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <span className="relative z-10">My Journey</span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-primary/20 -z-10 transform -rotate-1"></span>
            </motion.h2>

            <div className="relative pl-8 border-l-2 border-primary/30 space-y-10">
              {journeyItems.map((item, index) => (
                <JourneyItem key={item.id} item={item} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
