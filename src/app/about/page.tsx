"use client";

import { useEffect, useState, useRef } from "react";

export default function About() {
  const [activeSection, setActiveSection] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {

      // Find active section based on scroll position
      const viewportHeight = container.clientHeight;
      let currentSection = 0;
      const newVisibleSections = new Set<number>();
      
      sectionRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const relativeTop = rect.top - containerRect.top;
          const relativeBottom = rect.bottom - containerRect.top;
          
          // Check if section is in viewport
          if (relativeTop < viewportHeight && relativeBottom > 0) {
            newVisibleSections.add(index);
          }
          
          // Determine active section (center of viewport)
          if (relativeTop <= viewportHeight / 2 && relativeTop > -viewportHeight / 2) {
            currentSection = index;
          }
        }
      });
      
      setActiveSection(currentSection);
      setVisibleSections(newVisibleSections);
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    const targetRef = sectionRefs.current[index];
    if (!targetRef) return;

    targetRef.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const sections = [
    { id: 'hero', title: 'About' },
    { id: 'skills', title: 'Skills' },
    { id: 'experience', title: 'Experience' },
    { id: 'personal', title: 'Personal' }
  ];

  const skills = [
    {
      category: "Frontend",
      items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js"]
    },
    {
      category: "Backend",
      items: ["Node.js", "Python", "Go", "PostgreSQL", "MongoDB"]
    },
    {
      category: "Tools",
      items: ["Docker", "Kubernetes", "Git", "AWS", "Vercel"]
    }
  ];

  const experiences = [
    {
      year: "2023 - Present",
      title: "Software Engineering",
      company: "1337 | 42 Network",
      description: "Leading development of scalable web applications using modern tech stack."
    },
	{
	  year: "2024",
	  title: "Full Stack Developer",
	  company: "ByPixel Digital Agency",
	  description: "Built responsive and interactive user interfaces."
	},
    {
      year: "2025 - Present",
      title: "Freelance Web Developer",
      company: "Freelance",
      description: "Built and maintained client projects from conception to deployment."
    },
  ];

  return (
    <div className="h-screen relative bg-background text-primary animate-fade-in">
      
      {/* Navigation dots */}
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-40 flex flex-col space-y-6" data-project-area="true">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(index)}
            className={`group flex items-center transition-all duration-500 ${
              activeSection === index ? 'translate-x-0' : 'translate-x-2'
            }`}
          >
            <div 
              className={`w-2 h-2 rounded-full my-cursor-none transition-all duration-100 hover:scale-150 ${
                activeSection === index
                  ? 'bg-primary'
                  : 'bg-secondary hover:bg-primary'
              }`}
            />
            <span 
              className={`ml-4 text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                activeSection === index 
                  ? 'text-primary' 
                  : 'text-secondary group-hover:text-primary'
              }`}
            >
              {section.title}
            </span>
          </button>
        ))}
      </div>

      {/* Section counter */}
      <div className="absolute right-8 top-8 z-40 font-mono text-sm text-secondary">
        <span className="text-primary">{String(activeSection + 1).padStart(2, '0')}</span>
        <span className="mx-2">/</span>
        <span>{String(sections.length).padStart(2, '0')}</span>
      </div>

      {/* Main content */}
      <div 
        ref={containerRef}
        className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide"
        style={{ 
          scrollSnapType: 'y mandatory'
        }}
      >
        {/* Hero Section */}
        <section 
          ref={el => { sectionRefs.current[0] = el as HTMLDivElement; }}
          className="min-h-screen flex items-center justify-center px-4 sm:px-8 lg:px-16"
          style={{ scrollSnapAlign: 'start' }}
          data-project-area="true"
        >
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div 
              className={`transition-all duration-1000 ${
                visibleSections.has(0) ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight mb-6 text-primary">
                About
              </h1>
              
              <div className="w-16 h-px bg-secondary mx-auto mb-8" />
              
              <p className="text-lg sm:text-xl text-primary leading-relaxed max-w-3xl mx-auto">
                I'm a passionate full-stack developer with a love for creating 
                innovative digital experiences. I specialize in modern web technologies 
                and enjoy turning complex problems into simple, beautiful solutions.
              </p>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section 
          ref={el => { sectionRefs.current[1] = el as HTMLDivElement; }}
          className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-8 lg:px-16"
          style={{ scrollSnapAlign: 'start' }}
          data-project-area="true"
        >
          <div className="max-w-6xl mx-auto w-full">
            <h2 className="text-3xl sm:text-4xl font-light mb-16 text-center text-primary">
              Technical Skills
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {skills.map((skillGroup, index) => (
                <div 
                  key={skillGroup.category}
                  className={`space-y-6 group transition-all duration-1000 ${
                    visibleSections.has(1) ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    transitionDelay: visibleSections.has(1) ? `${index * 0.2}s` : '0s'
                  }}
                >
                  <h3 className="text-xl font-mono text-primary uppercase tracking-wider border-b border-secondary pb-3">
                    {skillGroup.category}
                  </h3>
                  <div className="space-y-3">
                    {skillGroup.items.map((skill, skillIndex) => (
                      <div 
                        key={skill}
                        className={`flex items-center space-x-3 group-hover:translate-x-2 transition-all duration-500 ${
                          visibleSections.has(1) ? 'opacity-100' : 'opacity-0'
                        }`}
                        // style={{
                        //   transitionDelay: visibleSections.has(1) ? `${index * 0.2 + skillIndex * 0.05}s` : '0s'
                        // }}
                      >
                        <div className="w-2 h-2 bg-secondary rounded-full group-hover:bg-primary transition-colors duration-300" />
                        <span className="text-primary group-hover:text-primary transition-colors duration-300">
                          {skill}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section 
          ref={el => { sectionRefs.current[2] = el as HTMLDivElement; }}
          className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-8 lg:px-16"
          style={{ scrollSnapAlign: 'start' }}
          data-project-area="true"
        >
          <div className="max-w-4xl mx-auto w-full">
            <h2 className="text-3xl sm:text-4xl font-light mb-16 text-center text-primary">
              Experience
            </h2>
            
            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <div 
                  key={exp.year}
                  className="relative border-l border-secondary pl-8 group"
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-1.5 top-0 w-3 h-3 bg-secondary rounded-full group-hover:bg-primary transition-all duration-300" />
                  
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h3 className="text-xl sm:text-2xl font-light text-primary">{exp.title}</h3>
                      <span className="text-sm font-mono text-secondary">{exp.year}</span>
                    </div>
                    
                    <p className="text-secondary font-medium">{exp.company}</p>
                    
                    <p className="text-primary leading-relaxed max-w-2xl">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Personal Section */}
        <section 
          ref={el => { sectionRefs.current[3] = el as HTMLDivElement; }}
          className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-8 lg:px-16"
          style={{ scrollSnapAlign: 'start' }}
          data-project-area="true"
        >
          <div className="max-w-4xl mx-auto text-center w-full">
            <h2 className="text-3xl sm:text-4xl font-light mb-12 text-primary">
              Beyond Code
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-4">
                <h3 className="text-xl font-mono text-primary">Philosophy</h3>
                <p className="text-primary leading-relaxed">
                  I believe in writing clean, maintainable code and creating 
                  user experiences that are both functional and delightful.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-mono text-primary">Interests</h3>
                <p className="text-primary leading-relaxed">
                  When I'm not coding, you'll find me exploring new technologies, 
                  contributing to open source, or enjoying the great outdoors.
                </p>
              </div>
            </div>
          </div>
        </section>
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
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
