import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const SECTIONS = [
  {
    title: "1. Introduction to the Site",
    content: [
      "This website and the related websites contained herein (collectively, the “Site”) make available information on hotels, resorts, and other transient stay facilities owned, managed or franchised by The Galaxy Hotel.",
      "The Site is offered exclusively by The Galaxy Hotel and/or its various third party providers and distributors.",
    ],
  },
  {
    title: "2. Acceptance of Conditions",
    content: [
      "In accessing, using, viewing, transmitting, caching or storing this Site, you shall be deemed to have agreed to each and all the Conditions and notices in this Site without modification.",
      "If you do not accept these Conditions, you must refrain from using the Site.",
    ],
  },
  {
    title: "3. Use of Website",
    content: [
      "This website is provided for informational purposes and to allow guests to make reservations and learn about our services.",
      "You agree to use the website only for lawful purposes and not to engage in any activity that may damage or disrupt the website’s operation.",
    ],
  },
  {
    title: "4. Reservations and Bookings",
    content: [
      "All reservations made through this website are subject to availability and confirmation by The Galaxy Hotel.",
      "The hotel reserves the right to cancel or modify reservations in cases of incorrect information, suspected fraud, or unavoidable operational circumstances.",
    ],
  },
  {
    title: "5. Pricing and Payments",
    content: [
      "Room rates and service prices displayed on the website are subject to change without prior notice.",
      "Payments are processed through secure third-party payment providers. The Galaxy Hotel does not store complete payment card details.",
    ],
  },
  {
    title: "6. Intellectual Property",
    content: [
      "All content on this website including text, images, branding, logos, and design elements are the property of The Galaxy Hotel unless otherwise stated.",
      "Nothing contained on the Site should be construed as granting any licence or right to use any of the trademarks without written permission.",
    ],
  },
  {
    title: "7. User Conduct",
    content: [
      "Users must not attempt unauthorized access to the website, servers, or connected systems.",
      "Any misuse including data scraping, hacking attempts, or malicious activities may result in legal action.",
    ],
  },
  {
    title: "8. Limitation of Liability",
    content: [
      "While we strive to ensure accurate information, The Galaxy Hotel does not guarantee that website content will always be error-free.",
      "The hotel shall not be liable for any indirect or consequential damages arising from the use of this website.",
    ],
  },
  {
    title: "9. Privacy",
    content: [
      "Use of this website is also governed by our Privacy Policy, which explains how personal information is collected and used.",
    ],
  },
  {
    title: "10. Governing Law",
    content: [
      "These Terms of Use shall be governed by and interpreted in accordance with the laws of India.",
      "Any disputes shall be resolved by arbitration in chhidwara, India, conducted in English.",
    ],
  },
];

const TermsOfUse = () => {
  const shouldReduceMotion = useReducedMotion();

  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVars = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 15,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] },
    },
  };

  const lastUpdated = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-white text-stone-800 selection:bg-stone-200">
      <div className="mx-auto max-w-5xl px-5 py-24 sm:px-10 lg:py-32">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVars}
          className="w-full"
        >
          <motion.header
            variants={itemVars}
            className="mb-16 border-b border-stone-200 pb-12"
          >
            <h1 className="mb-6 font-serif text-4xl font-light leading-tight tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
              General <span className="text-[#B5924B]">Terms & Conditions</span>
            </h1>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#B5924B]/40" />
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">
                Last Updated: {lastUpdated}
              </p>
            </div>
          </motion.header>

          <div className="grid gap-16 lg:gap-20">
            {SECTIONS.map((section, index) => (
              <motion.section
                key={index}
                variants={itemVars}
                className="group flex flex-col gap-4 md:flex-row md:gap-8"
              >
                <div className="flex-shrink-0 pt-1">
                  <span className="font-serif text-sm font-bold tracking-tighter text-[#B5924B] opacity-60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="relative flex-1 border-stone-100 transition-colors duration-500 group-hover:border-[#B5924B] md:border-l md:pl-8">
                  <h2 className="mb-6 text-xl font-semibold tracking-tight text-stone-900 sm:text-2xl">
                    {section.title.includes(". ")
                      ? section.title.split(". ")[1]
                      : section.title}
                  </h2>
                  <div className="space-y-5">
                    {section.content.map((para, i) => (
                      <p
                        key={i}
                        className="max-w-prose text-[16px] leading-relaxed text-stone-600 sm:text-lg"
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.section>
            ))}
          </div>

          <motion.footer
            variants={itemVars}
            className="mt-24 border border-[#C6A45C40] bg-[#fcfbf7] p-8 text-center sm:p-16"
          >
            <h3 className="mb-4 font-serif text-2xl text-stone-900 sm:text-3xl">
              Need Clarification?
            </h3>
            <p className="mx-auto mb-10 max-w-md text-stone-600">
              Our concierge team is available around the clock to assist with
              your specific requirements.
            </p>
            <div className="flex flex-col items-center justify-center gap-6 text-sm font-medium tracking-widest sm:flex-row">
              <a
                href="mailto:info@hotelthegalaxy.com"
                className="border-b border-transparent pb-1 transition-all hover:border-[#C6A45C] hover:text-[#C6A45C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A45C] focus-visible:ring-offset-2"
              >
                INFO@HOTELTHEGALAXY.COM
              </a>
              <span className="hidden h-4 w-px bg-stone-300 sm:block" />
              <a
                href="tel:+916262633305"
                className="border-b border-transparent pb-1 transition-all hover:border-[#C6A45C] hover:text-[#C6A45C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A45C] focus-visible:ring-offset-2"
              >
                +91 6262633305
              </a>
            </div>
          </motion.footer>
        </motion.div>
      </div>
    </main>
  );
};

export default TermsOfUse;
