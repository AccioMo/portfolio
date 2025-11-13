"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface ContactMethod {
  icon: string;
  label: string;
  value: string;
  link: string;
}

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
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    }, 1500);
  };

  const contactMethods: ContactMethod[] = [
    {
      icon: "email.svg",
      label: "Email",
      value: "mo.zeggaf@gmail.com",
      link: "mailto:mo.zeggaf@gmail.com"
    },
    {
      icon: "linkedin.svg",
      label: "LinkedIn",
      value: "/in/mozeggaf",
      link: "https://linkedin.com/in/mozeggaf"
    },
    {
      icon: "github.svg",
      label: "GitHub",
      value: "@acciomo",
      link: "https://github.com/acciomo"
    }
  ];

  return (
  <div className="bg-site-bg min-h-screen flex text-site-text animate-fade-in" data-project-area="true">
      <section className="py-12 flex m-auto items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto w-full">
          <div className={`text-center mb-8 transition-all duration-700 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="text-3xl sm:text-3xl lg:text-4xl font-light tracking-tight mb-3">
              Get In Touch
              <span className="block text-sm text-site-accent font-mono mt-1">
                Let's create something — say hello.
              </span>
            </h1>

            <div className="w-16 h-px bg-site-accent mx-auto mb-6" />

            <p className="text-sm text-site-accent leading-relaxed max-w-2xl mx-auto">
              I'm interested in hearing about projects and opportunities. If you'd like to work together, drop a short message below.
            </p>
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div
              className="space-y-6"
              style={{ animation: isMounted ? 'slideInLeft 0.6s ease-out 0.15s both' : 'none' }}
            >

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="text-site-accent transition-all duration-200">
                    <label htmlFor="name" className="block text-xs px-3 font-mono text-site-accent uppercase mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-site-accent rounded-md focus:outline-none focus:border-site-text focus:bg-site-bg text-sm text-site-text placeholder-site-accent"
                    />
                  </div>

                  <div className="text-site-accent transition-all duration-200">
                    <label htmlFor="email" className="block text-xs px-3 font-mono text-site-accent uppercase mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-site-accent rounded-md focus:outline-none focus:border-site-text focus:bg-site-bg text-sm text-site-text placeholder-site-accent"
                    />
                  </div>
                </div>

                <div className="text-site-accent transition-all duration-200">
                  <label htmlFor="subject" className="block text-xs px-3 font-mono text-site-accent uppercase mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-site-accent rounded-md focus:outline-none focus:border-site-text focus:bg-site-bg text-sm text-site-text placeholder-site-accent"
                  />
                </div>

                <div className="text-site-accent transition-all duration-200">
                  <label htmlFor="message" className="block text-xs px-3 font-mono text-site-accent uppercase mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-site-accent rounded-md resize-none focus:outline-none focus:border-site-text focus:bg-site-bg text-sm text-site-text placeholder-site-accent"
                  />
                </div>

                <div className="flex items-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-site-text text-site-bg font-medium rounded-md hover:bg-site-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 relative overflow-hidden"
                  >
                    <span className={`transition-all duration-200 ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                      {submitStatus === 'success' ? 'Message Sent!' : 'Send Message'}
                    </span>
                    {isSubmitting && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-site-accent border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </button>

                  {submitStatus === 'success' && (
                    <p className="text-site-accent text-sm ml-4">
                      Thanks — I'll get back to you soon.
                    </p>
                  )}
                </div>
              </form>
            </div>

            <span className="absolute left-1/2 top-0 w-[1px] h-full rounded-full bg-site-accent" />

            {/* Contact Information */}
            <div
              className="space-y-6 mt-4"
              style={{ animation: isMounted ? 'slideInRight 0.6s ease-out 0.25s both' : 'none' }}
            >
              <h2 className="text-base font-light mb-4">Other Ways to Connect</h2>

              <div className="space-y-3">
                {contactMethods.map((method, index) => (
                  <a
                    key={method.label}
                    href={method.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 py-2 px-4 rounded-md border-transparent hover:border-site-accent transition-all duration-200 group"
                    style={{ animation: isMounted ? `fadeInUp 0.5s ease-out ${0.45 + index * 0.06}s both` : 'none' }}
                  >
                    <div className="text-lg">
                      <Image src={`/${method.icon}`} alt={`${method.label} icon`} width={24} height={24} />
                    </div>
                    <div>
                      <div className="text-xs font-mono text-site-accent uppercase tracking-wider">
                        {method.label}
                      </div>
                      <div className="text-sm text-site-text group-hover:text-site-accent transition-colors duration-200">
                        {method.value}
                      </div>
                    </div>
                    <div className="ml-auto">
                      <svg
                        className="w-4 h-4 text-site-accent group-hover:text-site-text group-hover:translate-x-1 transition-all duration-200"
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

              {/* Additional Info (minimal, creative availability) */}
              {/* <div className="mt-6 p-4 bg-gradient-to-r from-gray-900/8 to-transparent border border-gray-800 rounded-md flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 flex items-center justify-center bg-white/6 rounded-full backdrop-blur-sm transform -rotate-6">
                    <svg className="w-4 h-4 text-green-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-mono text-gray-300">Availability</h3>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-green-300 font-mono">Open</span>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mt-2">Freelance & full-time — reply within 24 hours.</p>
                  <p className="text-gray-400 text-xs mt-2">Model collaborations: limited capacity — inquire for scheduling.</p>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
