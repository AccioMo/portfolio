"use client";

import { useEffect, useState } from "react";

export default function Contact() {
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    }, 1500);
  };

  const contactMethods = [
    {
      icon: "📧",
      label: "Email",
      value: "mo.zeggaf@gmail.com",
      link: "mailto:mo.zeggaf@gmail.com"
    },
    {
      icon: "💼",
      label: "LinkedIn",
      value: "/in/mozeggaf",
      link: "https://linkedin.com/in/mozeggaf"
    },
    {
      icon: "🐙",
      label: "GitHub",
      value: "@acciomo",
      link: "https://github.com/acciomo"
    },
    {
      icon: "🐦",
      label: "Twitter",
      value: "@27roundcarots",
      link: "https://twitter.com/27roundcarots"
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-white overflow-x-hidden animate-fade-in"
    data-project-area="true">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto w-full">
          <div 
            className={`text-center mb-16 transition-all duration-1000 ${
              isMounted ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight mb-6">
              Get In Touch
              <span className="block text-2xl sm:text-3xl lg:text-4xl text-gray-400 font-mono mt-2">
                Let's Create Something Amazing
              </span>
            </h1>
            
            <div className="w-24 h-px bg-gray-600 mx-auto mb-8" />
            
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              I'm always interested in hearing about new projects and opportunities. 
              Whether you have a question or just want to say hi, feel free to reach out.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <div 
              className="space-y-8"
              style={{
                animation: isMounted ? 'slideInLeft 0.8s ease-out 0.2s both' : 'none'
              }}
            >
              <h2 className="text-2xl sm:text-3xl font-light mb-8">Send a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2 text-gray-400 focus-within:text-gray-200 focus-within:font-bold transition-all duration-300">
                    <label htmlFor="name" className="ml-8 px-2 text-center transform translate-y-5 bg-background inline-block text-sm font-mono uppercase tracking-wider">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-700 rounded-full focus:outline-none focus:border-white focus:bg-gray-900/70 transition-all duration-300 text-white placeholder-gray-500"
                      // placeholder="Your name"
                    />
                  </div>
                  
                  <div className="space-y-2 text-gray-400 focus-within:text-gray-200 focus-within:font-bold transition-all duration-300">
                    <label htmlFor="email" className="ml-8 px-2 text-center transform translate-y-5 bg-background inline-block text-sm font-mono uppercase tracking-wider">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-700 rounded-full focus:outline-none focus:border-white focus:bg-gray-900/70 transition-all duration-300 text-white placeholder-gray-500"
                      // placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2 text-gray-400 focus-within:text-gray-200 focus-within:font-bold transition-all duration-300">
                  <label htmlFor="subject" className="ml-8 px-2 text-center transform translate-y-5 bg-background inline-block text-sm font-mono uppercase tracking-wider">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-700 rounded-full focus:outline-none focus:border-white focus:bg-gray-900/70 transition-all duration-300 text-white placeholder-gray-500"
                    // placeholder="What's this about?"
                  />
                </div>
                
                <div className="space-y-2 text-gray-400 focus-within:text-gray-200 focus-within:font-bold transition-all duration-300">
                  <label htmlFor="message" className="ml-8 px-2 text-center transform translate-y-5 bg-background inline-block text-sm font-mono uppercase tracking-wider">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-6 py-5 bg-gray-900/50 border-2 border-gray-700 rounded-3xl resize-none focus:outline-none focus:border-white focus:bg-gray-900/70 transition-all duration-300 text-white placeholder-gray-500 resize-vertical"
                    // placeholder="Tell me about your project..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300group relative overflow-hidden"
                >
                  <span className={`transition-all duration-300 ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                    {submitStatus === 'success' ? 'Message Sent!' : 'Send Message'}
                  </span>
                  {isSubmitting && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </button>
                
                {submitStatus === 'success' && (
                  <p className="text-green-400 text-sm">
                    Thanks for reaching out! I'll get back to you soon.
                  </p>
                )}
              </form>
            </div>

            {/* Contact Information */}
            <div 
              className="space-y-8"
              style={{
                animation: isMounted ? 'slideInRight 0.8s ease-out 0.4s both' : 'none'
              }}
            >
              <h2 className="text-2xl sm:text-3xl font-light mb-8">Other Ways to Connect</h2>
              
              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <a
                    key={method.label}
                    href={method.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-4 p-4 bg-gray-900/30 border border-gray-800 rounded-2xl hover:bg-gray-900/50 hover:border-gray-600 transition-all duration-300 group"
                    style={{
                      animation: isMounted ? `fadeInUp 0.6s ease-out ${0.6 + index * 0.1}s both` : 'none'
                    }}
                  >
                    <div className="text-2xl">{method.icon}</div>
                    <div>
                      <div className="text-sm font-mono text-gray-400 uppercase tracking-wider">
                        {method.label}
                      </div>
                      <div className="text-white group-hover:text-gray-200 transition-colors duration-300">
                        {method.value}
                      </div>
                    </div>
                    <div className="ml-auto">
                      <svg 
                        className="w-5 h-5 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
              
              {/* Additional Info */}
              <div className="mt-12 p-6 bg-gray-900/20 border border-gray-800 rounded-2xl">
                <h3 className="text-lg font-mono text-gray-400 mb-4">Availability</h3>
                <p className="text-gray-300 leading-relaxed">
                  I'm currently available for freelance projects and full-time opportunities. 
                  I typically respond to messages within 24 hours.
                </p>
                <div className="flex items-center space-x-2 mt-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-green-400 font-mono">Available for new projects</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
