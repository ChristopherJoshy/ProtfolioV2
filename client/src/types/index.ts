// Project type
export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  projectUrl?: string;
  repoUrl?: string;
  category: 'web' | 'game' | 'ai' | 'other';
  technologies: string[];
  featured: boolean;
  stars: number;
  order: number;
}

// Skill type
export interface Skill {
  id: string;
  name: string;
  category: 'programming' | 'framework' | 'tool' | 'other';
  proficiency: number; // 0-100
  iconName?: string;
  color?: string;
}

// Certificate type
export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
  imageUrl?: string;
  certificateUrl?: string;
  category?: string;
  order: number;
}

// Journey item type
export interface JourneyItem {
  id: string;
  title: string;
  description: string;
  date: string;
  order: number;
}

// Profile type
export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
  avatar?: string;
  resume?: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  website?: string;
  titles?: string[];
  stats?: {
    visitors?: number;
    githubStars?: number;
    githubCommits?: number;
    githubRepos?: number;
    projectsCompleted?: number;
  };
}

// Message type
export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

// Tech stack item type
export interface TechStack {
  name: string;
  icon: string;
  color: string;
  category: string;
  description: string;
}
