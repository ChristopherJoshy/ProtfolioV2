import { useState, useEffect } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import Skills from "@/components/sections/skills";
import Projects from "@/components/sections/projects";
import Certificates from "@/components/sections/certificates";
import Contact from "@/components/sections/contact";
import { ScrollProgressBar } from "@/components/ui/progress-bar";
import { useToast } from "@/hooks/use-toast";

import { 
  Project, 
  Skill, 
  Certificate, 
  JourneyItem, 
  Profile,
  TechStack
} from "@/types";
import { defaultProfile, defaultJourneyItems, defaultSkills, defaultTechStacks, defaultYoutubeChannels, defaultProjectsData, defaultCertificatesData } from "@/data/default-data";

const Home = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [journeyItems, setJourneyItems] = useState<JourneyItem[]>(defaultJourneyItems);
  const [programmingSkills, setProgrammingSkills] = useState<Skill[]>([]);
  const [frameworkSkills, setFrameworkSkills] = useState<Skill[]>([]);
  const [techStacks, setTechStacks] = useState<TechStack[]>(defaultTechStacks);
  const [projects, setProjects] = useState<Project[]>(defaultProjectsData);
  const [certificates, setCertificates] = useState<Certificate[]>(defaultCertificatesData);
  const [isLoading, setIsLoading] = useState(true);

  const youtubeChannels = defaultYoutubeChannels;

  const githubStats = {
    stars: 15,
    commits: 450,
    pullRequests: 17,
    issues: 5
  };

  const topLanguages = [
    { name: "JavaScript", percentage: 35, color: "#F7DF1E" },
    { name: "Java", percentage: 25, color: "#007396" },
    { name: "HTML", percentage: 20, color: "#E34F26" },
    { name: "Python", percentage: 12, color: "#3776AB" },
    { name: "CSS", percentage: 8, color: "#1572B6" }
  ];
  useEffect(() => {
    const setupData = () => {
      try {
        setProfile(defaultProfile);

        const sortedJourneyItems = defaultJourneyItems.sort((a: JourneyItem, b: JourneyItem) => a.order - b.order);
        setJourneyItems(sortedJourneyItems);

        const programmingSkillsData = defaultSkills.filter(skill => 
          skill.category === 'programming'
        ).sort((a: Skill, b: Skill) => b.proficiency - a.proficiency);
        
        const frameworkSkillsData = defaultSkills.filter(skill => 
          skill.category === 'framework' || skill.category === 'tool'
        ).sort((a: Skill, b: Skill) => b.proficiency - a.proficiency);
        
        setProgrammingSkills(programmingSkillsData);
        setFrameworkSkills(frameworkSkillsData);

        const sortedProjects = defaultProjectsData.sort((a: Project, b: Project) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.order - b.order;
        });
        setProjects(sortedProjects);

        const sortedCertificates = defaultCertificatesData.sort((a: Certificate, b: Certificate) => a.order - b.order);
        setCertificates(sortedCertificates);

      } catch (error) {
        console.error("Error setting up data:", error);
        toast({
          title: "Error",
          description: "Failed to set up content.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    setupData();
  }, [toast]);

  return (
    <>
      <ScrollProgressBar />
      <Navbar />
      <main>
        <Hero 
          profile={{
            id: profile.id,
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            titles: profile.titles || ["Web Developer", "AI Integration Specialist", "Prompt Engineer"],
            bio: profile.bio || "Building creative solutions through code.",
            github: profile.github,
            linkedin: profile.linkedin,
            instagram: profile.instagram,
            avatar: profile.avatar,
            stats: profile.stats
          }} 
        />
        <About 
          profile={{
            firstName: profile.firstName,
            lastName: profile.lastName,
            bio: profile.bio || "",
            education: "B.Tech in Computer Science, St. Joseph's College of Engineering",
            location: profile.location,
            email: profile.email,
            phone: profile.phone,
            resumeUrl: profile.resume,
          }} 
          journeyItems={journeyItems}
        />
        <Skills 
          programmingSkills={programmingSkills}
          frameworkSkills={frameworkSkills}
          techStacks={techStacks}
          youtubeChannels={youtubeChannels}
          githubStats={githubStats}
          topLanguages={topLanguages}
        />
        <Projects projects={projects} />
        <Certificates certificates={certificates} />
        <Contact 
          profile={{
            email: profile.email,
            phone: profile.phone,
            location: profile.location,
            github: profile.github,
            linkedin: profile.linkedin,
            instagram: profile.instagram,
          }}
        />
      </main>
      <Footer />
    </>
  );
};

export default Home;
