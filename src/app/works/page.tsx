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
    <div className="h-screen bg-transparent text-white overflow-hidden animate-fade-in" data-project-area="true">

      {/* Navigation dots */}
     <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 flex flex-col space-y-6">
        {projects.map((project, index) => (
          <button
            key={project.id}
            onClick={() => scrollToSection(index)}
            className={`group flex items-center transition-all duration-500 ${
              activeProject === index ? 'translate-x-0' : 'translate-x-2'
            }`}
          >
            <div 
              className={`w-[11px] h-[11px] rounded-full border-2 after:hidden after:content-[''] hover:after:block flex justify-center items-center after:w-1 after:h-1 after:bg-white after:rounded-full my-cursor-none transition-all duration-100 hover:scale-150 hover:after:scale-150 ${
                activeProject === index
                  ? 'bg-white border-white shadow-lg shadow-white/50'
                  : 'bg-transparent border-gray-500 hover:border-white'
              }`}
            />
            <span 
              className={`ml-4 text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                activeProject === index 
                  ? 'opacity-100 translate-x-0 text-white' 
                  : 'opacity-0 translate-x-4 text-gray-500 group-hover:opacity-100 group-hover:translate-x-0'
              }`}
            >
              {project.small_title}
            </span>
          </button>
        ))}
      </div>

      {/* Project counter */}
      <div className="fixed left-8 top-8 z-40 font-mono text-sm text-gray-400">
        <span className="text-white">{String(activeProject + 1).padStart(2, '0')}</span>
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
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-mono text-gray-400">{project.year}</span>
                    <div className="h-px bg-gray-700 flex-1" />
                  </div>
                  
                  <h1 className="text-3xl lg:text-4xl font-light tracking-tight">
                    {project.title}
                  </h1>
                  
                  <p className="text-lg text-gray-300 leading-relaxed max-w-lg">
                    {project.description}
                  </p>
                </div>

                {/* Tech stack */}
                <div className="space-y-3">
                  <h3 className="text-sm font-mono text-gray-400 uppercase tracking-wider">
                    Technology Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs border border-gray-700 rounded-full text-gray-300 hover:border-white hover:text-white transition-colors duration-300"
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
                      className="group flex items-center cursor-none space-x-2 text-white hover:text-purple-400 transition-colors duration-300"
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
                      className="group flex items-center cursor-none space-x-2 text-white hover:text-pink-400 transition-colors duration-300"
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
                <div className="aspect-video bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700/50 overflow-hidden group shadow-2xl">
                  <div className="w-full h-full bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-md flex items-center justify-center relative">
                    {/* Render video or image when provided, otherwise show 3D placeholder */}
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
                        <div className="w-16 h-16 mx-auto rounded-lg bg-gray-700/40 backdrop-blur-sm border border-gray-600/30 shadow-lg transform perspective-1000 rotate-x-12 rotate-y-12 group-hover:rotate-x-6 group-hover:rotate-y-6 transition-all duration-500 flex items-center justify-center">
                          <div className="w-8 h-8 bg-gray-600/50 rounded backdrop-blur-sm border border-gray-500/30"></div>
                        </div>
                        <p className="text-sm text-gray-400 font-mono backdrop-blur-sm">Project Preview</p>
                      </div>
                    )}

                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-500/10 to-transparent"></div>
                      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                    </div>
                  </div>
                </div>

                {/* Decorative elements - toned down */}
                <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gray-600/20 backdrop-blur-sm border border-gray-500/20 animate-pulse shadow-lg" />
                <div className="absolute -bottom-6 -left-6 w-6 h-6 rounded-full bg-gray-500/20 backdrop-blur-sm border border-gray-400/20 animate-pulse shadow-lg"
                     style={{ animationDelay: '1s' }} />
              </div>
            </div>

            {/* Scroll indicator for last project */}
            {index === projects.length - 1 && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center space-y-2">
                <p className="text-sm font-mono text-gray-400">End of Projects</p>
                <div className="w-px h-8 bg-gray-700 mx-auto" />
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
