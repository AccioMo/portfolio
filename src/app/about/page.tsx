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
      year: "2024",
      title: "Senior Full Stack Developer",
      company: "Tech Innovations Inc.",
      description: "Leading development of scalable web applications using modern tech stack."
    },
    {
      year: "2023",
      title: "Full Stack Developer",
      company: "StartupXYZ",
      description: "Built and maintained multiple client projects from conception to deployment."
    },
    {
      year: "2022",
      title: "Frontend Developer",
      company: "Digital Agency",
      description: "Focused on creating responsive and interactive user interfaces."
    }
  ];

  return (
    <div className="h-screen bg-transparent text-white overflow-hidden">
      
      {/* Navigation dots */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 flex flex-col space-y-6">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(index)}
            className={`group flex items-center transition-all duration-500 ${
              activeSection === index ? 'translate-x-0' : 'translate-x-2'
            }`}
          >
            <div 
              className={`w-3 h-3 rounded-full border-2 transition-all duration-500 hover:scale-150 ${
                activeSection === index
                  ? 'bg-white border-white shadow-lg shadow-white/50'
                  : 'bg-transparent border-gray-500 hover:border-white'
              }`}
            />
            <span 
              className={`ml-4 text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                activeSection === index 
                  ? 'opacity-100 translate-x-0 text-white' 
                  : 'opacity-0 translate-x-4 text-gray-500 group-hover:opacity-100 group-hover:translate-x-0'
              }`}
            >
              {section.title}
            </span>
          </button>
        ))}
      </div>

      {/* Section counter */}
      <div className="fixed left-8 top-8 z-40 font-mono text-sm text-gray-400">
        <span className="text-white">{String(activeSection + 1).padStart(2, '0')}</span>
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
        >
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div 
              className={`transition-all duration-1000 ${
                visibleSections.has(0) ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight mb-6">
                About
                <span className="block text-2xl sm:text-3xl lg:text-4xl text-gray-400 font-mono mt-2">
                  Developer & Creator
                </span>
              </h1>
              
              <div className="w-24 h-px bg-gray-600 mx-auto mb-8" />
              
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
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
        >
          <div className="max-w-6xl mx-auto w-full">
            <h2 
              className={`text-3xl sm:text-4xl font-light mb-16 text-center transition-all duration-1000 ${
                visibleSections.has(1) ? 'opacity-100' : 'opacity-0'
              }`}
            >
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
                  <h3 className="text-xl font-mono text-gray-400 uppercase tracking-wider border-b border-gray-800 pb-3">
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
                        <div className="w-2 h-2 bg-gray-600 rounded-full group-hover:bg-white transition-colors duration-300" />
                        <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
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
        >
          <div className="max-w-4xl mx-auto w-full">
            <h2 
              className={`text-3xl sm:text-4xl font-light mb-16 text-center transition-all duration-1000 ${
                visibleSections.has(2) ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Experience
            </h2>
            
            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <div 
                  key={exp.year}
                  className={`relative border-l border-gray-800 pl-8 group transition-all duration-1000 ${
                    visibleSections.has(2) ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    transitionDelay: visibleSections.has(2) ? `${index * 0.2}s` : '0s'
                  }}
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-gray-700 rounded-full border-2 border-gray-600 group-hover:bg-white group-hover:border-white transition-all duration-300" />
                  
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h3 className="text-xl sm:text-2xl font-light">{exp.title}</h3>
                      <span className="text-sm font-mono text-gray-400">{exp.year}</span>
                    </div>
                    
                    <p className="text-gray-400 font-medium">{exp.company}</p>
                    
                    <p className="text-gray-300 leading-relaxed max-w-2xl">
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
        >
          <div className="max-w-4xl mx-auto text-center w-full">
            <h2 
              className={`text-3xl sm:text-4xl font-light mb-12 transition-all duration-1000 ${
                visibleSections.has(3) ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Beyond Code
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div 
                className={`space-y-4 transition-all duration-1000 ${
                  visibleSections.has(3) ? 'opacity-100' : 'opacity-0'
                }`}
                // style={{
                //   transitionDelay: visibleSections.has(3) ? '0.2s' : '0s'
                // }}
              >
                <div className="w-12 h-12 bg-gray-800 rounded-lg mx-auto mb-6 flex items-center justify-center">
                  <div className="w-6 h-6 bg-gray-600 rounded" />
                </div>
                <h3 className="text-xl font-mono text-gray-400">Philosophy</h3>
                <p className="text-gray-300 leading-relaxed">
                  I believe in writing clean, maintainable code and creating 
                  user experiences that are both functional and delightful.
                </p>
              </div>
              
              <div 
                className={`space-y-4 transition-all duration-1000 ${
                  visibleSections.has(3) ? 'opacity-100' : 'opacity-0'
                }`}
                // style={{
                //   transitionDelay: visibleSections.has(3) ? '0.4s' : '0s'
                // }}
              >
                <div className="w-12 h-12 bg-gray-800 rounded-lg mx-auto mb-6 flex items-center justify-center">
                  <div className="w-6 h-6 bg-gray-600 rounded-full" />
                </div>
                <h3 className="text-xl font-mono text-gray-400">Interests</h3>
                <p className="text-gray-300 leading-relaxed">
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
