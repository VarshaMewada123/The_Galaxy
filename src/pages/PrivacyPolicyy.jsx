import { motion } from "framer-motion";

const PrivacyPolicy = () => {
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
            Privacy <span style={{ color: "#C6A45C" }}>Policy</span>
          </h1>
          <p className="text-sm uppercase tracking-[0.2em] text-stone-500 font-medium">
            Effective Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
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
                  {index + 1 < 10 ? `0${index + 1}` : index + 1}
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

        {/* Contact Support Card */}
        <motion.div 
          variants={itemVars}
          className="mt-20 p-8 md:p-12 text-center border"
          style={{ borderColor: "#C6A45C40", backgroundColor: "#fcfbf7" }}
        >
          <h3 className="text-2xl font-serif mb-4 text-stone-900">Privacy Concerns?</h3>
          <p className="text-stone-600 mb-6">If you have any questions about how we handle your data, our legal team is here to help.</p>
          <div className="flex flex-col md:flex-row justify-center gap-6 text-sm font-medium tracking-wide">
            <a href="mailto:info@thegalaxyhotel.com" className="hover:text-[#C6A45C] transition-colors border-b border-transparent hover:border-[#C6A45C]">EMAIL US</a>
            <span className="hidden md:block text-stone-300">|</span>
            <a href="tel:+910000000000" className="hover:text-[#C6A45C] transition-colors border-b border-transparent hover:border-[#C6A45C]">CALL CONCIERGE</a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;

/* ==============================
   PRIVACY POLICY CONTENT
============================== */

const sections = [
  {
    title: "1. Introduction",
    content: [
      "Welcome to The Galaxy Hotel. We value the privacy of our guests and website visitors. This Privacy Policy explains how we collect, use, store, and protect your personal information when you interact with our website, make reservations, or communicate with us.",
      "By using our website or services, you agree to the practices described in this policy.",
    ],
  },
  {
    title: "2. Information We Collect",
    content: [
      "We may collect personal information such as your name, email address, phone number, and booking details when you make reservations or contact us.",
      "Technical information such as IP address, browser type, and usage data may be automatically collected to improve website performance and security.",
    ],
  },
  {
    title: "3. How We Use Your Information",
    content: [
      "Your information is used to process hotel reservations, provide customer support, and improve our hospitality services.",
      "We may also use your information to communicate important updates or send promotional offers only with your explicit consent.",
    ],
  },
  {
    title: "4. Cookies and Tracking",
    content: [
      "Our website uses cookies to enhance user experience and analyze traffic. You may disable cookies through your browser settings, though some features may be limited.",
    ],
  },
  {
    title: "5. Sharing of Information",
    content: [
      "We do not sell or rent your personal information to third parties. Information is only shared with trusted partners like payment processors for operational purposes.",
    ],
  },
  {
    title: "6. Data Security",
    content: [
      "We implement high-level administrative and technical security measures to protect your data from unauthorized access or disclosure.",
    ],
  },
  {
    title: "7. Your Rights",
    content: [
      "You have the right to access, correct, or request deletion of your personal data. You may withdraw marketing consent at any time by contacting our support team.",
    ],
  },
  {
    title: "8. Updates to This Policy",
    content: [
      "We may update this Privacy Policy periodically. Updated versions will be posted on this page with a revised 'Last Updated' date.",
    ],
  },
];