import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const SECTIONS = [
  // TERMS
  {
    category: "Terms & Conditions",
    title: "Acceptance of Terms",
    content: [
      "By placing an order through our website, customers agree to these terms.",
    ],
  },
  {
    category: "Terms & Conditions",
    title: "Orders",
    content: ["Orders are subject to acceptance and availability."],
  },
  {
    category: "Terms & Conditions",
    title: "Pricing",
    content: [
      "Prices listed may change without notice.",
      "Taxes and delivery charges may apply.",
    ],
  },
  {
    category: "Terms & Conditions",
    title: "Payments",
    content: [
      "Customers may pay via approved online payment methods available on the website.",
    ],
  },
  {
    category: "Terms & Conditions",
    title: "Service & Liability",
    content: [
      "Customers must ensure delivery details are correct before confirming an order.",
      "Hotel The Galaxy is not responsible for delays due to external factors like traffic or weather.",
    ],
  },

  // REFUND
  {
    category: "Refund & Cancellation",
    title: "Order Booking and Financial Terms",
    content: [
      "All payments must be made in Indian Rupees using approved methods.",
      "Prices are subject to change; taxes and delivery charges may apply.",
    ],
  },
  {
    category: "Refund & Cancellation",
    title: "Order Cancellation",
    content: [
      "Orders can only be cancelled before preparation begins.",
      "Hotel The Galaxy may cancel orders due to unavailability or technical issues.",
    ],
  },
  {
    category: "Refund & Cancellation",
    title: "Refund Eligibility",
    content: [
      "Refunds apply if the order is cancelled before preparation.",
      "Refunds may also apply if payment is made but the order is not confirmed or incorrect.",
    ],
  },
  {
    category: "Refund & Cancellation",
    title: "Refund Processing",
    content: [
      "Refunds are processed to the original payment method.",
      "Processing may take 5–7 working days.",
    ],
  },
];

const TermsAndRefund = () => {
  const shouldReduceMotion = useReducedMotion();

  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const lastUpdated = "15 March 2026";

  return (
    <main className="min-h-screen bg-white text-stone-800">
      <div className="mx-auto max-w-5xl px-5 py-24 sm:px-10 lg:py-32">
        <motion.div initial="hidden" animate="visible" variants={containerVars}>
          
          {/* HEADER */}
          <motion.header
            variants={itemVars}
            className="mb-16 border-b border-stone-200 pb-12"
          >
            <h1 className="text-3xl sm:text-5xl text-stone-900 mb-4">
              Terms, Conditions &{" "}
              <span className="text-[#B5924B]">Refund Policy</span>
            </h1>

            <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
              Last Updated: {lastUpdated}
            </p>
          </motion.header>

          {/* SECTIONS */}
          <div className="space-y-16">
            {["Terms & Conditions", "Refund & Cancellation"].map(
              (category, catIndex) => (
                <div key={category}>
                  
                  {/* CATEGORY TITLE */}
                  <motion.h2
                    variants={itemVars}
                    className="text-2xl font-serif text-[#B5924B] mb-8 border-l-4 border-[#B5924B] pl-4"
                  >
                    {category}
                  </motion.h2>

                  {/* ITEMS */}
                  <div className="space-y-10">
                    {SECTIONS.filter(
                      (s) => s.category === category
                    ).map((section, index) => (
                      <motion.section
                        key={section.title}
                        variants={itemVars}
                        className="flex gap-6"
                      >
                        <span className="text-[#B5924B] font-bold">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div>
                          <h3 className="text-lg font-semibold text-stone-900 mb-3">
                            {section.title}
                          </h3>

                          {section.content.map((para, i) => (
                            <p key={i} className="text-stone-600 mb-2">
                              {para}
                            </p>
                          ))}
                        </div>
                      </motion.section>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>

          {/* FOOTER */}
          <motion.footer
            variants={itemVars}
            className="mt-24 border border-[#C6A45C40] bg-[#fcfbf7] p-10 text-center"
          >
            <h3 className="text-2xl font-serif text-stone-900 mb-4">
              Need Help?
            </h3>

            <p className="text-stone-600 mb-6">
              Contact Hotel The Galaxy for any queries regarding orders, refunds, or policies.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-6 text-sm font-medium">
              <a
                href="mailto:info@hotelthegalaxy.com"
                className="hover:text-[#B5924B]"
              >
                info@hotelthegalaxy.com
              </a>

              <span className="hidden sm:block text-stone-300">|</span>

              <a
                href="tel:+916262633305"
                className="hover:text-[#B5924B]"
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

export default TermsAndRefund;