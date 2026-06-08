"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  User,
  Globe,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    message: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Phone number: only digits and max length 15
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 15) {
        setFormData(prev => ({ ...prev, [name]: numericValue }));
      }
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          subject: `Contact Inquiry from ${formData.country}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      toast.success('Message Sent Successfully!', {
        description: 'We have received your inquiry and will get back to you soon.',
        duration: 5000,
      });

      setStatus({
        type: 'success',
        message: 'Your message has been sent successfully! We will get back to you soon.'
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        country: '',
        message: ''
      });
    } catch (error: any) {
      toast.error('Failed to Send Message', {
        description: error.message || 'Something went wrong. Please try again later.',
        duration: 5000,
      });
      setStatus({
        type: 'error',
        message: error.message || 'Failed to send message. Please try again later.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[650px] w-full overflow-hidden flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2000&auto=format&fit=crop"
          alt="Modern Business Meeting"
          fill
          className="object-cover object-center scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <h1 className="text-[48px] md:text-[46px] font-[800] font-black text-white tracking-tight mb-4 uppercase leading-none">
            Let's Talk About Your US Business
          </h1>
          <p className="text-[18px] md:text-[22px] text-white/85 font-[500] max-w-3xl mx-auto leading-relaxed">
            Have questions or need guidance? Our experts are here to help you every step of the way.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 max-w-[1260px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

          {/* Left Side: Get in touch */}
          <div className="space-y-10">
            <div>
              <h2 className="text-[32px] font-bold text-[#1A202C] mb-4">Get in touch</h2>

              <div className="space-y-6">
                {/* Call Us (India) */}
                <div className="flex gap-4 items-center group">
                  <div className="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center shrink-0 transition-all duration-300">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-[20px] font-bold text-slate-900">Call Us (India)</h4>
                    <p className="text-slate-600 text-[16px] font-medium">+91 99996 30777</p>
                  </div>
                </div>

                {/* Call Us (USA) */}
                <div className="flex gap-4 items-center group">
                  <div className="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center shrink-0 transition-all duration-300">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-[20px] font-bold text-slate-900">Call Us (USA)</h4>
                    <p className="text-slate-600 text-[16px] font-medium">+1 (713) 770-6032</p>
                  </div>
                </div>

                {/* Email Support */}
                <div className="flex gap-4 items-center group">
                  <div className="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center shrink-0 transition-all duration-300">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-[20px] font-bold text-slate-900">Email Support</h4>
                    <p className="text-slate-600 text-[16px] font-medium">contact@crossventura.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="pt-4">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Follow our social media</h3>
              <div className="flex gap-4">
                {/* Facebook */}
                <a href="https://facebook.com/crossventura" target="_blank" rel="noopener noreferrer" className="w-12 h-12 cursor-pointer bg-white shadow-md rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 border border-slate-50 group">
                  <svg className="w-6 h-6 text-[#1877F2] fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
                {/* Instagram */}
                <a href="https://instagram.com/crossventura" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white shadow-md rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 border border-slate-50 group">
                  <svg className="w-6 h-6 text-[#E4405F] fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                {/* Twitter */}
                <a href="https://twitter.com/crossventura" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white shadow-md rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 border border-slate-50 group">
                  <svg className="w-6 h-6 text-[#1DA1F2] fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                </a>
                {/* Youtube */}
                <a href="https://youtube.com/@crossventura" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white shadow-md rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 border border-slate-50 group">
                  <svg className="w-6 h-6 text-[#FF0000] fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Side: Send Us a Message */}
          <div className="bg-white">
            <h2 className="text-[32px] font-bold text-[#1A202C] mb-4">Send Us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[18px] font-bold text-slate-700 ml-1">Name</label>
                  <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter name"
                      className="w-full pl-14 pr-6  py-4 bg-[#193D66]/4 text-[#3E4246CC] border-2 border-transparent focus:border-blue-500/20 focus:bg-white rounded-full focus:ring-4 focus:ring-blue-500/5 outline-none placeholder:text-slate-400 font-[400] text-[16px] transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[18px] font-bold text-slate-700 ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter email.."
                      className="w-full pl-14 pr-6 py-4 bg-[#193D66]/4 text-[#3E4246CC] border-2 border-transparent focus:border-blue-500/20 focus:bg-white rounded-full focus:ring-4 focus:ring-blue-500/5 outline-none placeholder:text-slate-400 font-medium text-[16px] transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[18px] font-bold text-slate-700 ml-1">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength={15}
                      required
                      placeholder="+91 9887767216"
                      className="w-full pl-14 pr-6 py-4 bg-[#193D66]/4 text-[#3E4246CC] border-2 border-transparent focus:border-blue-500/20 focus:bg-white rounded-full focus:ring-4 focus:ring-blue-500/5 text-[16px] outline-none placeholder:text-slate-400 font-medium transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[18px] font-bold text-slate-700 ml-1">Country</label>
                  <div className="relative">
                    <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      placeholder="Country"
                      className="w-full pl-14 pr-6 py-4 bg-[#193D66]/4 text-[#3E4246CC] border-2 border-transparent focus:border-blue-500/20 focus:bg-white rounded-full focus:ring-4 focus:ring-blue-500/5 text-[16px] outline-none placeholder:text-slate-400 font-medium transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[18px] font-bold text-slate-700 ml-1">Message</label>
                <div className="relative">
                  <MessageSquare className="absolute left-6 top-6 w-5 h-5 text-slate-400" />
                  <textarea
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="How can we help you?"
                    className="w-full pl-14 pr-6 py-4 bg-[#193D66]/4 text-[#3E4246CC] border-2 border-transparent focus:border-blue-500/20 focus:bg-white rounded-[32px] focus:ring-4 focus:ring-blue-500/5 text-[16px] outline-none placeholder:text-slate-400 font-medium resize-none transition-all"
                  />
                </div>
              </div>

              {status && (
                <div className={`p-4 rounded-2xl text-center text-sm font-medium ${
                  status.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                  {status.message}
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4 cursor-pointer bg-gradient-to-r from-[#0266FF] to-[#3B87FA] hover:opacity-90 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-[#0266FF]/20 flex items-center justify-center gap-2 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Submit Inquiry'}
                {!isLoading && <Send className="w-5 h-5" />}
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}
