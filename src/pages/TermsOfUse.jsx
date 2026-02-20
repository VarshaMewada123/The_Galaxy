import { motion } from "framer-motion";

const TermsOfUse = () => {
  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="bg-white text-stone-800 min-h-screen pt-32 pb-20 px-6 sm:px-10">
      <motion.div 
        className="max-w-4xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVars}
      >
        {/* Header Section */}
        <motion.div variants={itemVars} className="border-b border-stone-200 pb-10 mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-4 tracking-tight">
            General <span style={{ color: "#C6A45C" }}>Terms & Conditions</span>
          </h1>
          <p className="text-sm uppercase tracking-[0.2em] text-stone-500 font-medium">
            Last Updated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-12">
          {sections.map((section, index) => (
            <motion.section 
              key={index} 
              variants={itemVars}
              className="group"
            >
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-xs font-bold tracking-widest" style={{ color: "#C6A45C" }}>
                  0{index + 1}
                </span>
                <h2 className="text-xl md:text-2xl text-stone-900 font-semibold tracking-wide">
                  {section.title.split('. ')[1] || section.title}
                </h2>
              </div>
              
              <div className="pl-0 md:pl-8 border-l-0 md:border-l border-stone-100 group-hover:border-[#C6A45C] transition-colors duration-500">
                {section.content.map((para, i) => (
                  <p key={i} className="mb-4 leading-relaxed text-stone-600 text-[15px] md:text-[16px] max-w-3xl">
                    {para}
                  </p>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Footer Contact Card */}
        <motion.div 
          variants={itemVars}
          className="mt-20 p-8 md:p-12 text-center border"
          style={{ borderColor: "#C6A45C40", backgroundColor: "#fcfbf7" }}
        >
          <h3 className="text-2xl font-serif mb-4 text-stone-900">Need Clarification?</h3>
          <p className="text-stone-600 mb-6">Our concierge team is available 24/7 to assist with your queries.</p>
          <div className="flex flex-col md:flex-row justify-center gap-6 text-sm font-medium tracking-wide">
            <a href="mailto:info@thegalaxyhotel.com" className="hover:text-[#C6A45C] transition-colors">INFO@THEGALAXYHOTEL.COM</a>
            <span className="hidden md:block text-stone-300">|</span>
            <a href="tel:+910000000000" className="hover:text-[#C6A45C] transition-colors">+91 XXXXX XXXXX</a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TermsOfUse;

/* ==============================
   TERMS CONTENT
============================== */

const sections = [
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
      "Any disputes shall be resolved by arbitration in [Your City], India, conducted in English.",
    ],
  },
];