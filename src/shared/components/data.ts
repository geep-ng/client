// Mock data for demonstration purposes
export const mockPosts = [
  {
    _id: "1",
    type: "Image",
    caption: "A sleek, modern product design mock-up.",
    displayUrl: "https://placehold.co/800x600/1e293b/cbd5e1?text=Product+Design",
    images: [],
    videoUrl: null,
    childPosts: []
  },
  {
    _id: "2",
    type: "Video",
    caption: "Short motion graphic loop.",
    displayUrl: "https://placehold.co/600x800/2f2f2f/a1a1aa?text=Video+Content",
    videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
    images: [],
    childPosts: []
  },
  {
    _id: "3",
    type: "Image",
    caption: "Abstract digital art piece.",
    displayUrl: "https://placehold.co/600x900/4c0519/fca5a5?text=Digital+Art",
    images: [],
    videoUrl: null,
    childPosts: []
  },
  {
    _id: "4",
    type: "Sidecar",
    caption: "A series showcasing some branding work.",
    displayUrl: "https://placehold.co/800x1200/0c4a6e/90e0ef?text=Branding",
    images: [],
    videoUrl: null,
    childPosts: [
      {
        igId: "1-1",
        type: "Image",
        caption: "Logo design.",
        displayUrl: "https://placehold.co/800x800/155e75/cffafe?text=Logo+Design",
      },
      {
        igId: "1-2",
        type: "Image",
        caption: "Brand pattern.",
        displayUrl: "https://placehold.co/800x800/083344/ecfeff?text=Brand+Pattern",
      },
    ]
  },
  {
    _id: "5",
    type: "Image",
    caption: "Photography from a recent trip.",
    displayUrl: "https://placehold.co/900x700/6f1e29/e5a8b7?text=Travel+Photography",
    images: [],
    videoUrl: null,
    childPosts: []
  },
];






export type BillingInterval = "monthly" | "annual";

export type Plan = {
  id: string;            // internal id (free, creator, influencer)
  name: string;
  description: string;
  postsAllowed: number | "unlimited";
  monthlyPrice: number;  // dollars
  annualPrice: number;   // dollars
  features: string[];
  badge?: string;
  paystackPlanMonthlyId?: string; // optional: set if you created plans in Paystack
  paystackPlanAnnualId?: string;
};

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    description: "Backup up to 100 posts",
    postsAllowed: 100,
    monthlyPrice: 0,
    annualPrice: 0,
    features: ["100 posts", "Basic backup", "Community support"],
    badge: "Popular",
  },
  {
    id: "creator",
    name: "Creator",
    description: "For creators with steady posting",
    postsAllowed: 1000,
    monthlyPrice: 5,
    annualPrice: 50,
    features: ["1000 posts", "Priority uploads", "Email support"],
    badge: "Best value",
    paystackPlanAnnualId: "PLN_2bb7zmckhemr08g", // example ids if pre-created
    paystackPlanMonthlyId: "PLN_ylrss6nuph48ryr",
    // optionally set paystack ids if pre-created
  },
  {
    id: "influencer",
    name: "Influencer",
    description: "Unlimited posts & features",
    postsAllowed: "unlimited",
    monthlyPrice: 20,
    annualPrice: 200,
    features: ["Unlimited posts", "Priority processing", "Advanced analytics"],
    badge: "Enterprise",
    paystackPlanAnnualId: "PLN_2bb7zmckhemr08g", // example ids if pre-created
    paystackPlanMonthlyId: "PLN_ylrss6nuph48ryr",
  },
];