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

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 3000);
      } else {
        setSubmitStatus('error');
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      label: "Email",
      value: "mo.zeggaf@gmail.com",
      link: "mailto:mo.zeggaf@gmail.com",
      icon: (
        <svg className="w-5 h-5 text-secondary group-hover:text-primary transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" fill="none" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
        </svg>
      )
    },
    {
      label: "LinkedIn",
      value: "/in/mozeggaf",
      link: "https://linkedin.com/in/mozeggaf",
      icon: (
        <svg className="w-5 h-5 text-secondary group-hover:text-primary transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.39v-1.2h-2.84v8.37h2.84v-4.13c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.13h2.84M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      )
    },
    {
      label: "GitHub",
      value: "@bmo-v2",
      link: "https://github.com/bmo-v2",
      icon: (
        <svg className="w-5 h-5 text-secondary group-hover:text-primary transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.544 2.914 1.186.092-.923.35-1.545.636-1.9-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen flex text-primary animate-fade-in" data-project-area="true">
      <section className="my-12 py-8 md:py-12 flex m-auto items-center justify-center px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl mx-auto w-full">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight mb-2 md:mb-3 text-primary">
              Get In Touch
            </h1>

            <div className="w-12 md:w-16 h-px bg-secondary mx-auto mb-4 md:mb-6" />

            <p className="text-xs sm:text-sm text-primary leading-relaxed max-w-2xl mx-auto px-4">
              I'm interested in hearing about projects and opportunities. If you'd like to work together, drop a short message below.
            </p>
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
            {/* Contact Form */}
            <div className="space-y-4 md:space-y-6">
              <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div className="group">
                    <label htmlFor="name" className="block text-xs px-2 md:px-3 font-mono text-secondary uppercase mb-1 group-focus-within:text-primary/80">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 md:px-4 py-2 border border-secondary rounded-md focus:outline-none focus:border-primary text-xs sm:text-sm text-primary placeholder-secondary"
                    />
                  </div>

                  <div className="group">
                    <label htmlFor="email" className="block text-xs px-2 md:px-3 font-mono text-secondary uppercase mb-1 group-focus-within:text-primary/80">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 md:px-4 py-2 border border-secondary rounded-md focus:outline-none focus:border-primary text-xs sm:text-sm text-primary placeholder-secondary"
                    />
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="subject" className="block text-xs px-2 md:px-3 font-mono text-secondary uppercase mb-1 group-focus-within:text-primary/80">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 md:px-4 py-2 border border-secondary rounded-md focus:outline-none focus:border-primary text-xs sm:text-sm text-primary placeholder-secondary"
                  />
                </div>

                <div className="group">
                  <label htmlFor="message" className="block text-xs px-2 md:px-3 font-mono text-secondary uppercase mb-1 group-focus-within:text-primary/80">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-secondary rounded-md resize-none focus:outline-none focus:border-primary text-xs sm:text-sm text-primary placeholder-secondary"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 md:px-6 py-2 bg-primary text-background text-sm md:text-base font-medium rounded-md hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 relative overflow-hidden"
                  >
                    <span className={`transition-all duration-200 ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                      {submitStatus === 'success' ? (
                        <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : submitStatus === 'error' ? 'Error Sending' : 'Send Message'}
                    </span>
                    {isSubmitting && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </button>

                  {submitStatus === 'success' && (
                    <p className="text-secondary text-xs sm:text-sm">
                      Thanks — I'll get back to you soon.
                    </p>
                  )}
                  {submitStatus === 'error' && (
                    <p className="text-red-500 text-xs sm:text-sm">
                      Error sending message. Please try again.
                    </p>
                  )}
                </div>
              </form>
            </div>

            <span className="hidden lg:block absolute left-1/2 top-0 w-[1px] h-full rounded-full bg-secondary" />
            <div className="lg:hidden w-full h-[1px] my-6 bg-secondary" />

            {/* Contact Information */}
            <div className="space-y-4 md:space-y-6 mt-0 lg:mt-4">
              <h2 className="text-sm md:text-base font-light mb-3 md:mb-4 text-primary">Other Ways to Connect</h2>

              <div className="space-y-2 md:space-y-3">
                {contactMethods.map((method, index) => (
                  <a
                    key={method.label}
                    href={method.link}
                    // target="_blank"
                    // rel="noopener noreferrer"
                    className="flex items-center space-x-2 md:space-x-3 py-2 px-3 md:px-4 rounded-md border-transparent cursor-none hover:border-secondary transition-all duration-200 group"
                  >
                    <div className="text-base md:text-lg">
                      {method.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono text-secondary uppercase tracking-wider transition-all duration-200 group-hover:text-primary/80">
                        {method.label}
                      </div>
                      <div className="text-xs sm:text-sm text-primary/40 group-hover:text-primary transition-all duration-200 truncate">
                        {method.value}
                      </div>
                    </div>
                    <div className="ml-auto flex-shrink-0">
                      <svg
                        className="w-3.5 h-3.5 md:w-4 md:h-4 text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all duration-200"
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
