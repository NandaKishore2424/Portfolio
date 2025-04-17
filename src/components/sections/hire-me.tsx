"use client";

import { useState } from "react";
import { Mail, Phone, FileText, MapPin, Send, Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function HireMe() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send data to Formspree
      const response = await fetch('https://formspree.io/f/xkgjadjy', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formState)
      });
      
      if (response.ok) {
        // Form submission was successful
        setSubmitStatus("success");
        setFormState({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
      } else {
        // Form submission failed
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Decorative cosmic elements */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-violet-400/10 blur-3xl" />
      <div className="absolute bottom-20 right-40 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-indigo-400/10 blur-2xl" />
      
      {/* Animated stars */}
      <motion.div 
        className="absolute top-1/4 right-1/4"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5] 
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Star className="text-purple-300/30 h-4 w-4" />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-1/3 left-1/3"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.7, 0.3] 
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Star className="text-indigo-300/30 h-5 w-5" />
      </motion.div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Get In Touch</h2>
          <div className="w-24 h-1 bg-purple-500 mx-auto mb-6"></div>
          <p className="text-violet-200 max-w-2xl mx-auto">
            Interested in working together or have a question?
            Feel free to reach out and I'll get back to you as soon as possible.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-black/20 backdrop-blur-lg p-8 rounded-lg shadow-lg border border-violet-500/20 h-full">
              <h3 className="text-2xl font-bold mb-6 text-white">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-violet-500/30 flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="w-5 h-5 text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-white">Email</h4>
                    <a 
                      href="mailto:r.nandakishore24@gmail.com" 
                      className="text-violet-200 hover:text-white transition-colors"
                    >
                      r.nandakishore24@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-violet-500/30 flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone className="w-5 h-5 text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-white">Phone</h4>
                    <p className="text-violet-200">+91 9344248604</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-violet-500/30 flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="w-5 h-5 text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-white">Location</h4>
                    <p className="text-violet-200">Chennai, Tamil Nadu, India</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <h4 className="font-medium mb-4 text-white">Download Resume</h4>
                <motion.a 
                  href="/Nanda_Kishore_Resume.pdf" 
                  download 
                  className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-500 transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Resume PDF
                </motion.a>
              </div>
            </div>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <form 
              onSubmit={handleSubmit} 
              className="bg-black/20 backdrop-blur-lg p-8 rounded-lg shadow-lg border border-violet-500/20"
            >
              <h3 className="text-2xl font-bold mb-6 text-white">Send Me a Message</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1 text-violet-100">
                    Your Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formState.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-violet-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500/50 bg-black/30 text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1 text-violet-100">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2 border border-violet-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500/50 bg-black/30 text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1 text-violet-100">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formState.subject}
                    onChange={handleChange}
                    placeholder="Project Inquiry"
                    className="w-full px-4 py-2 border border-violet-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500/50 bg-black/30 text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1 text-violet-100">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={formState.message}
                    onChange={handleChange}
                    placeholder="Your message here..."
                    className="w-full px-4 py-2 border border-violet-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500/50 bg-black/30 text-white resize-none"
                  ></textarea>
                </div>
                
                <div>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "w-full flex items-center justify-center px-4 py-3 bg-violet-600 text-white rounded-md transition-colors",
                      isSubmitting ? "opacity-80 cursor-not-allowed" : "hover:bg-violet-500"
                    )}
                    whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                  
                  {submitStatus === "success" && (
                    <p className="text-green-400 mt-3 text-sm">
                      Message sent successfully! I'll get back to you soon.
                    </p>
                  )}
                  
                  {submitStatus === "error" && (
                    <p className="text-red-400 mt-3 text-sm">
                      Something went wrong. Please try again later.
                    </p>
                  )}
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}