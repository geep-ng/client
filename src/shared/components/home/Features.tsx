import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Define the structure for a single key feature */
interface Feature {
  id: number;
  icon: string;
  title: string;
  description: string;
}

/** Features data */
const FEATURES_DATA: Feature[] = [
  {
    id: 1,
    icon: "🚀",
    title: "Graduate Mobilization",
    description:
      "Establish a unified digital hub for Nigerian graduates to register, connect, and receive direct campaign communication.",
  },
  {
    id: 2,
    icon: "💼",
    title: "Empowerment & Opportunity",
    description:
      "Exclusive access to verified job openings, entrepreneurship support, loans, grants, and personal development programs.",
  },
  {
    id: 3,
    icon: "🎖️",
    title: "Ambassador Development",
    description:
      "Identify, train, and equip dedicated graduates to serve as Re-election Ambassadors for grassroots engagement.",
  },
  {
    id: 4,
    icon: "📈",
    title: "Data Analytics Backend",
    description:
      "A powerful administrative back-end for data-driven insights, real-time segmentation, and strategic reporting.",
  },
  {
    id: 5,
    icon: "💰",
    title: "Crowdfunding System",
    description:
      "A secure feature to support fundraising, project financing, and campaign-related financial activities on the platform.",
  },
];

/** Features Section Component */
const Features: React.FC = () => {
  useEffect(() => {
    // Register plugin once
    gsap.registerPlugin(ScrollTrigger);

    // Animate each feature card
    FEATURES_DATA.forEach((_, index) => {
      gsap.fromTo(
        `.feature-card-${index}`,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: `.feature-card-${index}`,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          Empowering Features
        </h2>
        <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
          GEEP is structured around four pillars of success: mobilization,
          opportunity, leadership, and sustainability.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {FEATURES_DATA.map((feature, index) => (
            <div
              key={feature.id}
              className={`feature-card feature-card-${index} text-left p-8 bg-gray-50 rounded-xl shadow-lg border-t-4 border-blue-600`}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
