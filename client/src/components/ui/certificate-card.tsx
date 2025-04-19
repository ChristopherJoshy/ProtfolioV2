import { useState, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Certificate } from "@/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Award, ExternalLink, Download } from "lucide-react";

interface CertificateCardProps {
  certificate: Certificate;
  index: number;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({ certificate, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);

  const gradientColors = [
    "from-primary/20 to-secondary/20",
    "from-accent/20 to-primary/20",
    "from-secondary/20 to-primary/20",
    "from-primary/20 to-accent/20",
    "from-[#2a9d8f]/20 to-[#e9c46a]/20",
    "from-[#8338ec]/20 to-[#3a86ff]/20",
  ];

  const gradient = gradientColors[index % gradientColors.length];

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };

  const iconVariants = {
    normal: { scale: 1 },
    hover: { scale: 1.1, y: -5 }
  };

  // Update animation when in view
  if (isInView && ref.current) {
    controls.start("visible");
  }

  return (
    <motion.div
      ref={ref}
      className="glass-card rounded-xl overflow-hidden hover:shadow-lg transition-all"
      variants={cardVariants}
      initial="hidden"
      animate={controls}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative h-48 overflow-hidden bg-gradient-to-r ${gradient}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6">
            <motion.div
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl"
              variants={iconVariants}
              animate={isHovered ? "hover" : "normal"}
              transition={{ duration: 0.3 }}
            >
              <Award size={28} />
            </motion.div>
            <h3 className="text-xl font-semibold">{certificate.title}</h3>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Issued by</p>
            <p className="font-medium">{certificate.issuer}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="font-medium">{certificate.date}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
            {certificate.category || "Certificate"}
          </span>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                View Certificate
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <div className="flex flex-col space-y-4 py-4">
                <h3 className="text-xl font-semibold">{certificate.title}</h3>
                <div className="bg-muted rounded-md overflow-hidden">
                  {certificate.imageUrl ? (
                    <img
                      src={certificate.imageUrl}
                      alt={certificate.title}
                      className="w-full h-auto object-contain"
                    />
                  ) : (
                    <div className="h-64 flex items-center justify-center bg-muted">
                      <Award size={48} className="text-muted-foreground" />
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground">
                  {certificate.description || `Certificate issued by ${certificate.issuer} on ${certificate.date}`}
                </p>
                <div className="flex justify-end space-x-2">
                  {certificate.certificateUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={certificate.certificateUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open Original
                      </a>
                    </Button>
                  )}
                  {certificate.certificateUrl && (
                    <Button size="sm" asChild>
                      <a href={certificate.certificateUrl} download target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </motion.div>
  );
};
