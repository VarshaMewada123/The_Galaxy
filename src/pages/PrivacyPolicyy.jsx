/* eslint-disable no-unused-vars */
import { motion, useReducedMotion } from "framer-motion";

const sections = [
  {
    title: "Introduction",
    content: [
      "Hotel The Galaxy values the privacy of its customers and is committed to protecting personal information shared while using our website or placing online food orders.",
      "This policy is effective as of 15 March 2026 and applies to our operations in Chhindwara, Madhya Pradesh.",
    ],
  },
  {
    title: "Information We Collect",
    content: [
      "We collect personal information including your name, contact number, and email address (if provided).",
      "We also collect delivery and billing address details, along with order history and preferences to enhance your experience.",
    ],
  },
  {
    title: "Payment Information",
    content: [
      "Payments are processed through secure third-party payment gateways including debit cards, credit cards, UPI, and net banking.",
      "Hotel The Galaxy does not store full card numbers or CVV details.",
    ],
  },
  {
    title: "Use of Information",
    content: [
      "Customer information is used to process and deliver orders, provide updates, and improve our services.",
      "We may also use this information to maintain internal records and comply with legal obligations.",
    ],
  },
  {
    title: "Data Protection & Sharing",
    content: [
      "We implement reasonable security measures to protect your information from unauthorized access or misuse.",
      "Information may be shared with delivery personnel, payment providers, or authorities if required by law.",
    ],
  },
  {
    title: "Cookies",
    content: [
      "Our website may use cookies to improve functionality and user experience.",
    ],
  },
  {
    title: "Policy Updates",
    content: [
      "Hotel The Galaxy reserves the right to update this policy at any time without prior notice.",
    ],
  },
];

const PrivacyPolicy = () => {
  const shouldReduceMotion = useReducedMotion();

  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: shouldReduceMotion ? 0 : 0.2,
      },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <main className="bg-white text-stone-800 min-h-screen pt-32 pb-20 px-6 sm:px-10">
      <motion.div
        className="max-w-4xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVars}
      >
        {/* Header */}
        <motion.header
          variants={itemVars}
          className="border-b border-stone-200 pb-10 mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-4 tracking-tight">
            Privacy <span className="text-[#C6A45C]">Policy</span>
          </h1>

          <p className="text-sm uppercase tracking-[0.2em] text-stone-500 font-serif font-medium">
            Hotel The Galaxy — Effective: 20 March 2026
          </p>
        </motion.header>

        {/* Sections */}
        <section className="space-y-12" aria-label="Privacy policy sections">
          {sections.map((section, index) => (
            <motion.article
              key={section.title}
              variants={itemVars}
              className="group"
            >
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-xs font-bold tracking-widest text-[#C6A45C]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="text-xl md:text-2xl text-stone-900 font-semibold tracking-wide">
                  {section.title}
                </h2>
              </div>

              <div className="md:pl-8 md:border-l border-stone-100 group-hover:border-[#C6A45C] transition-colors duration-300">
                {section.content.map((para, i) => (
                  <p
                    key={i}
                    className="mb-4 leading-relaxed text-stone-600 text-[15px] md:text-[16px] max-w-3xl"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </motion.article>
          ))}
        </section>

        {/* Contact Section */}
        <motion.footer
          variants={itemVars}
          className="mt-20 p-8 md:p-12 text-center border border-[#C6A45C40] bg-[#fcfbf7]"
        >
          <h3 className="text-2xl font-serif mb-4 text-stone-900">
            Privacy Concerns?
          </h3>

          <p className="text-stone-600 mb-6">
            If you have any questions regarding your data or this policy, please
            contact us.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-6 text-sm font-medium tracking-wide">
            <a
              href="mailto:gmhotelthegalaxy@gmail.com"
              className="hover:text-[#C6A45C] transition-colors border-b border-transparent hover:border-[#C6A45C]"
            >
              EMAIL US
            </a>

            <span className="hidden md:block text-stone-300">|</span>

            <a
              href="tel:+916262633305"
              className="hover:text-[#C6A45C] transition-colors border-b border-transparent hover:border-[#C6A45C]"
            >
              CALL SUPPORT
            </a>
          </div>
        </motion.footer>
      </motion.div>
    </main>
  );
};

export default PrivacyPolicy;