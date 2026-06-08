"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Scale, ShieldCheck, FileText } from "lucide-react";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <div className="bg-[#F8FAFC] border-b border-gray-100 pt-32 pb-16 px-4">
        <div className="max-w-[1260px]  xl:max-w-[1440px] mx-auto">
          <Link 
            href="/signup" 
            className="inline-flex items-center text-[#0266FF] font-semibold mb-8 hover:gap-2 transition-all gap-1"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Signup
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#0266FF]/10 rounded-2xl flex items-center justify-center text-[#0266FF]">
              <Scale className="w-6 h-6" />
            </div>
            <h1 className="text-4xl md:text-[30px] font-extrabold text-[#1A202C] tracking-tight">
              Terms & Conditions
            </h1>
          </div>
          <p className="text-lg text-slate-500 max-w-full font-medium">
           Welcome to Cross Ventura (“Company,” “we,” “our,” or “us”). These Terms and Conditions (“Terms”) govern your use of our website, platform, and services related to U.S. company formation, EIN assistance, registered agent services, virtual office solutions, warehousing consultation, and related business support services.
          </p>
          <div className="mt-6 inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold text-slate-600 shadow-sm">
            Effective Date: May 11, 2026
          </div>
        </div>
      </div>

      {/* Content Section */}
      <main className="py-20 px-4">
        <div className="max-w-[1260px] xl:max-w-[1440px] mx-auto prose prose-slate prose-lg">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-4 flex items-center gap-3">
              <FileText className="w-6 h-6 text-[#0266FF]" />
              1. Nature of Services
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium">
             Our platform is a self-service business formation and support portal that allows users to purchase and request services related to forming and managing business entities in the United States.
            </p>
            <div className="mt-6">
              <p className="text-slate-900 font-bold mb-4">Our services may include:</p>
              <ul className="space-y-2 text-slate-600 font-medium list-disc pl-6">
                <li>U.S. company formation assistance</li>
                <li>State filing support</li>
                <li>EIN application assistance</li>
                <li>Registered agent services</li>
                <li>Virtual mailbox services</li>
                <li>Virtual bank account assistance</li>
                <li>Physical office support</li>
                <li>Warehousing and fulfilment consultation</li>
                <li>Bookkeeping and accounting support</li>
                <li>ITIN application assistance</li>
              </ul>
              <p className="text-slate-900 font-semibold mb-4">We are not a law firm, accounting firm, bank, immigration consultancy, or financial institution</p>
              <p className="text-slate-900 font-semibold mb-4">We do not provide legal, tax, investment, or financial advice.</p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-4 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#0266FF]" />
              2. Eligibility
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              By using our services, you represent that:
            </p>
            <ul className="space-y-3 text-slate-600 font-medium list-disc pl-6">
              <li>You are at least 18 years old.</li>
              <li>You have the legal authority to enter into binding agreements.</li>
              <li>All information submitted by you is accurate, complete, and truthful.</li>
              <li>You are not using our services for unlawful, fraudulent, or prohibited activities.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-4">3. Customer Responsibilities</h2>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              You agree that:
            </p>
            <ul className="space-y-3 text-slate-600 font-medium list-disc pl-6">
              <li>All information submitted for company formation and related services is accurate and complete.</li>
              <li>You are responsible for reviewing all submitted details before payment and filing.</li>
              <li>Any errors in the information provided by you may result in filing delays, rejection, penalties, or additional correction fees.</li>
              <li>You are solely responsible for maintaining compliance with U.S. federal, state, and local laws applicable to your business.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-4">4. Timeline & Government Approval Disclaimer</h2>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              All service timelines provided on the platform are estimated only and depend on approvals, processing times, and actions by U.S. federal agencies, state authorities, banking institutions, and other regulatory bodies.
            </p>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              Processing timelines for services, including company formation, EIN issuance, ITIN applications, banking assistance, and related services, may vary based on:
            </p>
            <ul className="space-y-2 text-slate-600 font-medium list-disc pl-6 mb-6">
              <li>Federal and state government processing timelines</li>
              <li>IRS processing timelines</li>
              <li>Banking compliance and due diligence reviews</li>
              <li>Accuracy and completeness of submitted documents</li>
              <li>Regulatory requirements</li>
              <li>Public holidays and weekends</li>
            </ul>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              While we make commercially reasonable efforts to process applications promptly, we do not control the approval timelines or decisions of government authorities, financial institutions, or regulatory agencies.
            </p>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              Accordingly, no fixed or guaranteed timeline shall be deemed a binding commitment by the Company.
            </p>
            <p className="text-slate-600 leading-relaxed font-medium">
              All approvals are subject to the discretion of government agencies, banking institutions, and other applicable authorities.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-4">5. EIN Services Disclaimer</h2>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              EIN issuance is controlled solely by the Internal Revenue Service (“IRS”).
            </p>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              We assist with the preparation and submission of EIN-related documentation only.
            </p>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              Typical EIN processing may take 4 weeks or longer, depending on IRS workload and processing conditions.
            </p>
            <p className="text-slate-600 leading-relaxed font-medium">
              We do not control IRS processing timelines and cannot guarantee expedited issuance.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-4">6. Banking Services Disclaimer</h2>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              Any banking-related support provided by us is assistance only.
            </p>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              Bank account approval decisions are made exclusively by banking institutions.
            </p>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              Accounts may be denied, restricted, frozen, or closed by the banking institution at its discretion.
            </p>
            <div className="mt-6">
              <p className="text-slate-900 font-bold mb-4">We are not liable for:</p>
              <ul className="space-y-2 text-slate-600 font-medium list-disc pl-6">
                <li>Bank account rejection</li>
                <li>Delays in banking approvals</li>
                <li>Account suspension or closure</li>
                <li>Banking compliance reviews</li>
                <li>Banking policy changes</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-4">7. Pricing and Payments</h2>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              All prices displayed on the platform are in United States Dollars (USD).
            </p>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              Additional state filing fees, government fees, taxes, and other charges may apply separately unless specifically included in the selected plan.
            </p>
            <div className="mt-6">
              <p className="text-slate-900 font-bold mb-4">By making a payment, you authorise us to charge the selected payment method for:</p>
              <ul className="space-y-2 text-slate-600 font-medium list-disc pl-6 mb-6">
                <li>Service fees</li>
                <li>Add-on services</li>
                <li>Recurring subscriptions</li>
                <li>Applicable government or state fees</li>
              </ul>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              Recurring services such as registered agent services, bookkeeping, virtual mailbox, or office address services may renew periodically unless cancelled in accordance with our cancellation policy.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-4">8. Refund Policy</h2>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              Due to the nature of digital and filing services:
            </p>
            <ul className="space-y-2 text-slate-600 font-medium list-disc pl-6 mb-6">
              <li>Government filing fees are non-refundable.</li>
              <li>State fees are non-refundable once submitted.</li>
              <li>Service fees become non-refundable once processing has started.</li>
              <li>Refund requests before filing submission may be reviewed on a case-by-case basis.</li>
              <li>Banking consultation fees and warehousing consultation fees are non-refundable once consultation has been scheduled or completed.</li>
            </ul>
            <p className="text-slate-600 leading-relaxed font-medium">
              We make refund approvals at our discretion.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-4">9. Processing Timelines</h2>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              Estimated timelines displayed on the website are approximate only.
            </p>
            <div className="mt-6">
              <p className="text-slate-900 font-bold mb-4">Processing times depend on:</p>
              <ul className="space-y-2 text-slate-600 font-medium list-disc pl-6 mb-6">
                <li>State government processing</li>
                <li>IRS processing</li>
                <li>Banking institutions</li>
                <li>Document accuracy</li>
                <li>Public holidays and weekends</li>
              </ul>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              We are not liable for delays caused by external agencies or institutions.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-4">10. Intellectual Property</h2>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              All content on the platform, including:
            </p>
            <ul className="space-y-2 text-slate-600 font-medium list-disc pl-6 mb-6">
              <li>Text</li>
              <li>Branding</li>
              <li>Logos</li>
              <li>Graphics</li>
              <li>Documents</li>
              <li>Software</li>
              <li>Website structure</li>
            </ul>
            <p className="text-slate-600 leading-relaxed font-medium">
              is the intellectual property of Cross Ventura and may not be copied, reproduced, distributed, or reused without prior written permission.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-4">11. Prohibited Activities</h2>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              You agree not to:
            </p>
            <ul className="space-y-2 text-slate-600 font-medium list-disc pl-6 mb-6">
              <li>Use the platform for unlawful purposes</li>
              <li>Submit false or misleading information</li>
              <li>Attempt unauthorized access to our systems</li>
              <li>Use our services for money laundering, fraud, or sanctioned activities</li>
              <li>Interfere with website functionality or security</li>
            </ul>
            <p className="text-slate-600 leading-relaxed font-medium">
              We reserve the right to suspend or terminate services if suspicious or prohibited activity is detected.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-4">12. Limitation of Liability</h2>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              To the maximum extent permitted by law, we shall not be liable for:
            </p>
            <ul className="space-y-2 text-slate-600 font-medium list-disc pl-6 mb-6">
              <li>Indirect or consequential damages</li>
              <li>Loss of profits</li>
              <li>Business interruption</li>
              <li>Filing rejection</li>
              <li>Banking rejection</li>
              <li>IRS delays</li>
              <li>Compliance penalties</li>
            </ul>
            <p className="text-slate-600 leading-relaxed font-medium">
              Our total liability shall not exceed the amount paid by you for the specific service giving rise to the claim.
            </p>
          </section>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-4">13. Indemnification</h2>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              You agree to indemnify and hold harmless Cross Ventura, its directors, employees, affiliates, and partners from any claims, liabilities, damages, losses, or expenses arising from:
            </p>
            <ul className="space-y-2 text-slate-600 font-medium list-disc pl-6">
              <li>Your use of the services</li>
              <li>Violation of these Terms</li>
              <li>Violation of laws or regulations</li>
              <li>Incorrect information submitted by you</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-4">14. Privacy</h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              Your use of the platform is also governed by our Privacy Policy below.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-4">15. Termination</h2>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              We reserve the right to refuse, suspend, or terminate services at any time if:
            </p>
            <ul className="space-y-2 text-slate-600 font-medium list-disc pl-6">
              <li>Fraudulent activity is suspected</li>
              <li>Compliance concerns arise</li>
              <li>Required documents are not provided</li>
              <li>These Terms are violated</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-4">16. Governing Law</h2>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              These Terms shall be governed by and interpreted in accordance with the laws of the State of Texas, United States, without regard to conflict of law principles.
            </p>
            <p className="text-slate-600 leading-relaxed font-medium">
              Any disputes shall be subject to the jurisdiction of courts located in Texas, United States.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-4">17. Contact Information</h2>
            <div className="space-y-2 text-slate-600 font-medium">
              <p>India Support: +91 99996 30777</p>
              <p>USA Support: +1 (713) 770-6032</p>
              <p>Email: contact@crossventura.com</p>
            </div>
          </section>
          
        </div>
      </main>
    </div>
  );
};

export default TermsPage;
