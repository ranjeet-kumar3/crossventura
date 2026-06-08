"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Lock, Eye, Database, Globe } from "lucide-react";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <div className="bg-[#F8FAFC] border-b border-gray-100 pt-32 pb-16 px-4">
        <div className="max-w-[1260px] xl:max-w-[1440px] lg:max-w-[960px] md:max-w-[720px] sm:max-w-[540px] max-w-[400px] mx-auto">
          <Link 
            href="/signup" 
            className="inline-flex items-center text-[#0266FF] font-semibold mb-8 hover:gap-2 transition-all gap-1"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Signup
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#0266FF]/10 rounded-2xl flex items-center justify-center text-[#0266FF]">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-4xl md:text-[30px] font-extrabold text-[#1A202C] tracking-tight">
              Privacy Policy
            </h1>
          </div>
          <p className="text-lg text-slate-500  max-w-2xl font-medium">
           Cross Ventura (“Company,” “we,” “our,” or “us”) respects your privacy and is committed to protecting your personal information.<br/>This Privacy Policy explains how we collect, use, store, and protect your information when you use our website and services.
          </p>
          <div className="mt-6 inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold text-slate-600 shadow-sm">
            Effective Date: May 11, 2026
          </div>
        </div>
      </div>

      {/* Content Section */}
      <main className="py-20 px-4">
        <div className="max-w-[1260px] xl:max-w-[1440px] lg:max-w-[960px] md:max-w-[720px] sm:max-w-[540px] max-w-[400px] mx-auto prose prose-slate prose-lg">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-4 flex items-center gap-3">
              <Database className="w-6 h-6 text-[#0266FF]" />
              1. Information We Collect
            </h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-3">Personal Information:</h3>
                <ul className="space-y-2 text-slate-600 text-[18px] font-medium list-disc pl-6">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Country and address details</li>
                  <li>Identity documents</li>
                  <li>Business ownership information</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-3">Business Information:</h3>
                <ul className="space-y-2 text-slate-600 text-[18px] font-medium list-disc pl-6">
                  <li>Proposed business name</li>
                  <li>State of formation</li>
                  <li>Entity type</li>
                  <li>Shareholder/member details</li>
                  <li>Existing business details</li>
                  <li>Warehousing and logistics information</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-3">Payment Information:</h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Payments are processed securely through payment processors. We do not store full card details on our servers.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-3">Technical Information:</h3>
                <ul className="space-y-2 text-slate-600 text-[18px] font-medium list-disc pl-6">
                  <li>IP address</li>
                  <li>Browser information</li>
                  <li>Device information</li>
                  <li>Website activity logs</li>
                  <li>Cookies and analytics data</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-4 flex items-center gap-3">
              <Eye className="w-6 h-6 text-[#0266FF]" />
              2. How We Use Information
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              We use the collected information to:
            </p>
            <ul className="space-y-3 text-slate-600 font-medium text-[18px] list-disc pl-6">
              <li>Process company formation requests</li>
              <li>Submit government filings</li>
              <li>Assist with EIN applications</li>
              <li>Provide customer support</li>
              <li>Communicate order updates</li>
              <li>Improve our services</li>
              <li>Process payments</li>
              <li>Prevent fraud and unauthorized activity</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-4 flex items-center gap-3">
              <Globe className="w-6 h-6 text-[#0266FF]" />
              3. Information Sharing
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              We may share information with:
            </p>
            <ul className="space-y-3 text-slate-600 font-medium text-[18px] list-disc pl-6 mb-6">
              <li>State filing authorities</li>
              <li>IRS and government agencies</li>
              <li>Banking institutions</li>
              <li>Warehousing and fulfilment partners</li>
              <li>Payment processors</li>
              <li>Compliance and verification providers</li>
            </ul>
            <p className="text-slate-600 leading-relaxed font-medium">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-4 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#0266FF]" />
              4. Data Retention
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              We retain information for as long as necessary to:
            </p>
            <ul className="space-y-3 text-slate-600 font-medium text-[18px] list-disc pl-6 mb-6">
              <li>Provide services</li>
              <li>Maintain compliance obligations</li>
              <li>Resolve disputes</li>
              <li>Enforce agreements</li>
              <li>Meet legal and regulatory requirements</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-4">5. Cookies and Tracking Technologies</h2>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              We may use cookies and analytics tools to:
            </p>
            <ul className="space-y-3 text-slate-600 font-medium text-[18px] list-disc pl-6 mb-6">
              <li>Improve website functionality</li>
              <li>Analyze website traffic</li>
              <li>Remember user preferences</li>
              <li>Enhance user experience</li>
            </ul>
            <p className="text-slate-600 leading-relaxed font-medium">
              Users may manage cookie preferences through browser settings.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-4">6. Data Security</h2>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              We implement commercially reasonable security measures to protect information from:
            </p>
            <ul className="space-y-3 text-slate-600 font-medium text-[18px] list-disc pl-6 mb-6">
              <li>Unauthorized access</li>
              <li>Disclosure</li>
              <li>Misuse</li>
              <li>Loss</li>
              <li>Alteration</li>
            </ul>
            <p className="text-slate-600 leading-relaxed font-medium">
              However, no internet transmission or storage system is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-4">7. International Users</h2>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              As our services are offered globally, your information may be processed and stored in the United States or other jurisdictions where our service providers operate.
            </p>
            <p className="text-slate-600 leading-relaxed font-medium">
              By using our services, you consent to such transfers.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-4">8. Third-Party Websites</h2>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              Our platform may contain links to third-party websites or services.
            </p>
            <p className="text-slate-600 leading-relaxed font-medium">
              We are not responsible for the privacy practices or content of third-party websites.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-4">9. Your Rights</h2>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              Depending on applicable laws, users may have rights to:
            </p>
            <ul className="space-y-3 text-slate-600 font-medium text-[18px] list-disc pl-6 mb-6">
              <li>Access personal information</li>
              <li>Correct inaccurate data</li>
              <li>Withdraw consent where applicable</li>
            </ul>
            <p className="text-slate-600 leading-relaxed font-medium">
              Requests may be submitted through our support email.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-4">10. Children's Privacy</h2>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              Our services are not intended for individuals under 18 years of age.
            </p>
            <p className="text-slate-600 leading-relaxed font-medium">
              We do not knowingly collect personal information from minors.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-4">11. Policy Updates</h2>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              We may update this Privacy Policy periodically.
            </p>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              Updated versions will be posted on the website with the revised effective date.
            </p>
            <p className="text-slate-600 leading-relaxed font-medium">
              Continued use of the platform after updates constitutes acceptance of the revised policy.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-4">12. Contact Us</h2>
            <p className="text-slate-600 leading-relaxed font-medium mb-2">
              <strong>Email:</strong> contact@crossventura.com
            </p>
            <p className="text-slate-600 leading-relaxed font-medium mb-2">
              <strong>India Support:</strong> +91 99996 30777
            </p>
            <p className="text-slate-600 leading-relaxed font-medium">
              <strong>USA Support:</strong> +1 (713) 770-6032
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

// Helper component for the check icon
const ShieldCheck = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default PrivacyPage;
