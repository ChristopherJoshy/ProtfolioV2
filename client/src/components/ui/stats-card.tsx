import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  delay?: number;
}

export const StatsCard = ({ title, value, icon, delay = 0 }: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center gap-4 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="bg-primary/10 dark:bg-primary/20 text-primary p-3 rounded-full">
        {icon}
      </div>
      <div>
        <h3 className="text-sm text-muted-foreground font-medium">{title}</h3>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </motion.div>
  );
};

interface StatsGridProps {
  stats: {
    visitors?: number;
    githubStars?: number;
    githubCommits?: number;
    githubRepos?: number;
    projectsCompleted?: number;
  };
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {stats.visitors !== undefined && (
        <StatsCard
          title="Visitors"
          value={stats.visitors.toLocaleString()}
          icon={<i className="fas fa-eye text-xl" />}
          delay={0}
        />
      )}
      {stats.githubStars !== undefined && (
        <StatsCard
          title="GitHub Stars"
          value={stats.githubStars}
          icon={<i className="fas fa-star text-xl" />}
          delay={0.1}
        />
      )}
      {stats.githubCommits !== undefined && (
        <StatsCard
          title="GitHub Commits"
          value={stats.githubCommits}
          icon={<i className="fas fa-code-commit text-xl" />}
          delay={0.2}
        />
      )}
      {stats.githubRepos !== undefined && (
        <StatsCard
          title="GitHub Repos"
          value={stats.githubRepos}
          icon={<i className="fas fa-code-branch text-xl" />}
          delay={0.3}
        />
      )}
      {stats.projectsCompleted !== undefined && (
        <StatsCard
          title="Projects"
          value={stats.projectsCompleted}
          icon={<i className="fas fa-laptop-code text-xl" />}
          delay={0.4}
        />
      )}
    </div>
  );
};