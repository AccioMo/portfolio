// {/* About Section */}
//       <section id="about" className="h-screen py-16 px-6 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center cursor-none select-none relative overflow-hidden">
//         {/* Animated background elements */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           {/* Floating geometric shapes */}
//           <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-gray-300/20 dark:border-gray-600/20 rounded-full animate-pulse"></div>
//           <div className="absolute top-3/4 right-1/4 w-24 h-24 border border-gray-400/15 dark:border-gray-500/15 rounded-lg rotate-45 animate-spin" style={{ animationDuration: '20s' }}></div>
//           <div className="absolute top-1/2 left-1/6 w-16 h-16 bg-gradient-to-br from-gray-200/10 to-gray-400/10 dark:from-gray-600/10 dark:to-gray-800/10 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '3s' }}></div>
//           <div className="absolute bottom-1/4 right-1/6 w-20 h-20 border-2 border-gray-300/15 dark:border-gray-600/15 triangle animate-pulse" style={{ animationDelay: '1s' }}></div>
//         </div>

//         <div className="container mx-auto text-center relative z-10">
//           <div className="max-w-4xl mx-auto">
//             {/* Animated title */}
//             <h3 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-tr from-neutral-300 via-neutral-200 to-gray-600 bg-clip-text text-transparent animate-fade-in">
//               About Me
//             </h3>
            
//             {/* Main content with staggered animations */}
//             <div className="space-y-8">
//               <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
//                 I'm a passionate developer who loves creating digital experiences that matter.
//               </p>
              
//               <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
//                 With a focus on clean code, intuitive design, and meaningful functionality, 
//                 I transform ideas into reality through thoughtful development and attention to detail.
//               </p>

//               {/* Skills grid with hover effects */}
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 animate-slide-up" style={{ animationDelay: '0.9s', animationFillMode: 'both' }}>
//                 {['Frontend', 'Backend', 'Design', 'DevOps'].map((skill, index) => (
//                   <div 
//                     key={skill}
//                     className="group relative bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-200/30 dark:border-gray-700/30 hover:border-gray-300/50 dark:hover:border-gray-600/50 transition-all duration-500 hover:transform hover:scale-105"
//                     style={{ animationDelay: `${1.2 + index * 0.1}s` }}
//                     onMouseEnter={() => setIsHoveringButton(true)}
//                     onMouseLeave={() => setIsHoveringButton(false)}
//                   >
//                     <div className="absolute inset-0 bg-gradient-to-br from-gray-100/10 via-transparent to-gray-200/10 dark:from-gray-700/10 dark:to-gray-800/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//                     <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 relative z-10">
//                       {skill}
//                     </h4>
//                   </div>
//                 ))}
//               </div>

//               {/* Call to action */}
//               <div className="mt-12 animate-slide-up" style={{ animationDelay: '1.6s', animationFillMode: 'both' }}>
//                 <a 
//                   href="#contact" 
//                   className="relative inline-block bg-neutral-700/30 text-white px-8 py-3 rounded-full backdrop-blur-md shadow-lg hover:bg-neutral-600/40 transition-all duration-500 font-medium border border-white/20 cursor-none group overflow-hidden"
//                   onMouseEnter={() => setIsHoveringButton(true)}
//                   onMouseLeave={() => setIsHoveringButton(false)}
//                 >
//                   {/* Background spread effect */}
//                   <div className="absolute inset-0 bg-gradient-to-r from-gray-400/20 via-gray-300/20 to-gray-500/20 rounded-full opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-150 transition-all duration-700 ease-out blur-sm group-hover:blur-md"></div>
//                   <div className="absolute inset-0 bg-gradient-to-r from-gray-300/10 via-gray-200/10 to-gray-400/10 rounded-full opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-125 transition-all duration-500 ease-out blur-xs"></div>
//                   <span className="relative z-10">Let's Connect</span>
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Projects Section */}
//       <section id="projects" className="py-16 px-6">
//         <div className="container mx-auto">
//           <h3 className="text-4xl font-bold text-center mb-12">My Projects</h3>
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
//             {/* Project 1 */}
//             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
//               <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
//                 <span className="text-white text-4xl">🚀</span>
//               </div>
//               <div className="p-6">
//                 <h4 className="text-xl font-bold mb-3">E-Commerce Platform</h4>
//                 <p className="text-gray-600 dark:text-gray-300 mb-4">
//                   A full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.
//                 </p>
//                 <div className="flex flex-wrap gap-2 mb-4">
//                   <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm">React</span>
//                   <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm">Node.js</span>
//                   <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm">MongoDB</span>
//                 </div>
//                 <div className="flex gap-4">
//                   <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Live Demo</a>
//                   <a href="#" className="text-gray-600 hover:text-gray-700 font-medium">GitHub</a>
//                 </div>
//               </div>
//             </div>

//             {/* Project 2 */}
//             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
//               <div className="h-48 bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
//                 <span className="text-white text-4xl">📱</span>
//               </div>
//               <div className="p-6">
//                 <h4 className="text-xl font-bold mb-3">Task Management App</h4>
//                 <p className="text-gray-600 dark:text-gray-300 mb-4">
//                   A collaborative task management application with real-time updates, team features, and progress tracking.
//                 </p>
//                 <div className="flex flex-wrap gap-2 mb-4">
//                   <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm">Next.js</span>
//                   <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm">TypeScript</span>
//                   <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm">Prisma</span>
//                 </div>
//                 <div className="flex gap-4">
//                   <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Live Demo</a>
//                   <a href="#" className="text-gray-600 hover:text-gray-700 font-medium">GitHub</a>
//                 </div>
//               </div>
//             </div>

//             {/* Project 3 */}
//             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
//               <div className="h-48 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
//                 <span className="text-white text-4xl">📊</span>
//               </div>
//               <div className="p-6">
//                 <h4 className="text-xl font-bold mb-3">Analytics Dashboard</h4>
//                 <p className="text-gray-600 dark:text-gray-300 mb-4">
//                   A comprehensive analytics dashboard with data visualization, reporting, and insights generation.
//                 </p>
//                 <div className="flex flex-wrap gap-2 mb-4">
//                   <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm">React</span>
//                   <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm">D3.js</span>
//                   <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm">Python</span>
//                 </div>
//                 <div className="flex gap-4">
//                   <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Live Demo</a>
//                   <a href="#" className="text-gray-600 hover:text-gray-700 font-medium">GitHub</a>
//                 </div>
//               </div>
//             </div>

//           </div>
//         </div>
//       </section>

//       {/* Contact Section */}
//       <section id="contact" className="py-16 px-6 bg-gray-50 dark:bg-gray-900/50">
//         <div className="container mx-auto text-center">
//           <h3 className="text-4xl font-bold mb-8">Let's Work Together</h3>
//           <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
//             I'm always open to discussing new opportunities and interesting projects. 
//             Feel free to reach out if you'd like to collaborate!
//           </p>
//           <div className="flex justify-center gap-6">
//             <a 
//               href="mailto:your.email@example.com" 
//               className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors font-medium"
//               onMouseEnter={() => setIsHoveringButton(true)}
//               onMouseLeave={() => setIsHoveringButton(false)}
//             >
//               Get In Touch
//             </a>
//             <a 
//               href="#" 
//               className="border border-blue-600 text-blue-600 px-8 py-3 rounded-full hover:bg-blue-600 hover:text-white transition-colors font-medium"
//               onMouseEnter={() => setIsHoveringButton(true)}
//               onMouseLeave={() => setIsHoveringButton(false)}
//             >
//               Download Resume
//             </a>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="py-8 px-6 border-t border-gray-200 dark:border-gray-800">
//         <div className="container mx-auto text-center">
//           <p className="text-gray-600 dark:text-gray-300">
//             © 2025 Your Name. Built with Next.js and Tailwind CSS.
//           </p>
//         </div>
//       </footer>
//     </div>