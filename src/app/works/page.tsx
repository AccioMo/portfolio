"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface Project {
  id: number;
  title: string;
  small_title: string,
  description: string;
  tech: string[];
  year: string;
  link?: string;
  github?: string;
  image?: string;
  video?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Handwritten Digit Recognizer",
    small_title: "CNN",
    description: "Convolutional Neural Network for recognizing handwritten digits, built in C++ with multiple optimizations.",
    tech: ["C++", "AI", "Neural Net", "AI Vision"],
    year: "2025",
    link: "https://project-alpha.demo",
    github: "https://github.com/AccioMo/handwritten-digit-recognizer"
  , image: "/screenshot-train.png"
  },
  {
    id: 2,
    title: "Full Stack Chatting Application",
    small_title: "Chatting App",
    description: "Full-stack e-commerce platform with advanced filtering, payment integration, and admin dashboard.",
    tech: ["React", "Node.js", "Django", "Daphne"],
    year: "2024",
    link: "https://project-beta.demo",
    github: "https://github.com/AccioMo/chatting-web-application"
  , video: "/videos/project-beta-demo.mp4"
  },
  {
    id: 3,
    title: "Movie Rankings Web App",
    small_title: "Streaming App",
    description: "Mobile-first progressive web app for task management with offline capabilities and real-time collaboration.",
    tech: ["Vue.js", "Express", "Socket.io", "Redis"],
    year: "2023",
    link: "https://project-gamma.demo",
    github: "https://github.com/AccioMo/project-gamma"
  },
  {
    id: 4,
    title: "Spotify Playlist Converter",
    small_title: "yspotify",
    description: "AI-powered analytics dashboard with data visualization and machine learning insights.",
    tech: ["Python", "Django", "TensorFlow", "D3.js"],
    year: "2023",
    link: "https://project-delta.demo",
    github: "https://github.com/AccioMo/project-delta"
  },
  {
    id: 5,
    title: "Python Decision Tree",
    small_title: "yggdrasil",
    description: "Microservices architecture with containerized deployment and automated CI/CD pipeline.",
    tech: ["Docker", "Kubernetes", "Go", "PostgreSQL"],
    year: "2023",
    github: "https://github.com/AccioMo/project-epsilon"
  }
];

export default function Works() {
  const [activeProject, setActiveProject] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const viewportHeight = container.clientHeight;
      let currentProject = 0;

      projectRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const relativeTop = rect.top - containerRect.top;

          if (relativeTop <= viewportHeight / 2 && relativeTop > -viewportHeight / 2) {
            currentProject = index;
          }
        }
      });

      setActiveProject(currentProject);
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    const targetRef = projectRefs.current[index];
    if (!targetRef) return;

    targetRef.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className="h-screen bg-background text-primary overflow-hidden animate-fade-in" data-project-area="true">

      {/* Navigation dots */}
     <div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-40 flex flex-col space-y-6">
        {projects.map((project, index) => (
          <button
            key={project.id}
            onClick={() => scrollToSection(index)}
            className={`group flex items-center transition-all duration-500 ${
              activeProject === index ? 'translate-x-0' : 'translate-x-2'
            }`}
          >
            <div 
              className={`w-2 h-2 rounded-full my-cursor-none transition-all duration-100 group-hover:scale-150 ${
                activeProject === index
                  ? 'bg-primary'
                  : 'bg-secondary hover:bg-primary'
              }`}
            />
            <span 
              className={`ml-4 text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                activeProject === index 
                  ? 'text-primary' 
                  : 'text-secondary group-hover:text-primary'
              }`}
            >
              {project.small_title}
            </span>
          </button>
        ))}
      </div>

      {/* Project counter */}
      <div className="absolute right-8 top-8 z-40 font-mono text-sm text-secondary">
        <span className="text-primary">{String(activeProject + 1).padStart(2, '0')}</span>
        <span className="mx-2">/</span>
        <span>{String(projects.length).padStart(2, '0')}</span>
      </div>

      {/* Main content */}
      <div 
        ref={containerRef}
        className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide"
        style={{ 
          scrollSnapType: 'y mandatory'
        }}
      >
        {projects.map((project, index) => (
          <div
            key={project.id}
            ref={el => { projectRefs.current[index] = el; }}
            className="min-h-screen flex items-center justify-center px-8 relative project-area"
            style={{ scrollSnapAlign: 'start' }}
          >

            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10 animate-fade-in"
            data-project-area="true" style={{ animationDelay: `${index * 0.2}s` }}>
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <span className="text-sm font-mono text-secondary">{project.year}</span>
                  
                  <h1 className="text-3xl lg:text-4xl font-light tracking-tight text-primary">
                    {project.title}
                  </h1>
                  
                  <p className="text-lg text-primary leading-relaxed max-w-lg">
                    {project.description}
                  </p>
                </div>

                {/* Tech stack */}
                <div className="space-y-3">
                  <h3 className="text-sm font-mono text-secondary uppercase tracking-wider">
                    Technology Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs border border-secondary rounded-full text-primary hover:bg-secondary hover:text-background transition-colors duration-300"
                        style={{
                          animationDelay: `${techIndex * 0.1}s`
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="flex space-x-6">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center cursor-none space-x-2 text-primary hover:text-secondary transition-colors duration-300"
                    >
                      <span className="text-sm font-mono">View Project</span>
                      <svg 
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                  
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center cursor-none space-x-2 text-primary hover:text-secondary transition-colors duration-300"
                    >
                      <span className="text-sm font-mono">Source Code</span>
                      <svg 
                        className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              {/* Project visual */}
              <div className="relative">
                <div className="aspect-video bg-secondary/10 rounded-lg border border-secondary overflow-hidden group">
                  <div className="w-full h-full flex items-center justify-center relative">
                    {/* Render video or image when provided, otherwise show placeholder */}
                    {project.video ? (
                      <video
                        src={project.video}
                        className="absolute inset-0 w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        aria-hidden="true"
                      />
                    ) : project.image ? (
                      <Image
                        src={project.image}
                        alt={`${project.title} preview`}
                        width={1920}
                        height={100}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center space-y-4 relative z-10">
                        <p className="text-sm text-secondary font-mono">Project Preview</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll indicator for last project */}
            {index === projects.length - 1 && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center space-y-2">
                <p className="text-sm font-mono text-secondary">End of Projects</p>
                <div className="w-px h-8 bg-secondary mx-auto" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Custom scrollbar styles and animations */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .rotate-x-12 {
          transform: rotateX(12deg);
        }
        
        .rotate-y-12 {
          transform: rotateY(12deg);
        }
        
        .rotate-x-6 {
          transform: rotateX(6deg);
        }
        
        .rotate-y-6 {
          transform: rotateY(6deg);
        }
        
        @keyframes float-gentle {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-4px) rotate(45deg);
          }
          50% {
            transform: translateY(-8px) rotate(90deg);
          }
          75% {
            transform: translateY(-4px) rotate(135deg);
          }
          100% {
            transform: translateY(0px) rotate(180deg);
          }
        }
        
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        .animate-fade-in {
          opacity: 0;
          animation: fade-in 1s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
