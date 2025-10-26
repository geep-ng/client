import React, { useState, FormEvent } from "react";
// import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  GraduationCap,
  MapPin,
  User,
  Loader2,
} from "lucide-react";

// import Input from "./Input";
// import Select from "./Select";
import StepPersonal from "./StepPersonal";
import StepLocation from "./StepLocation";
import StepEducation from "./StepEducation";
import StepMobilization from "./StepMobilization";
import useUser from "@/hooks/useUser";
import axiosInstance from "@/utils/axiosInstance";

// --- Data constants ---
const educationLevels = ["B.Sc.", "M.Sc.", "Ph.D.", "HND", "OND", "Other"];
const disciplines = [
  "Computer Science",
  "Engineering",
  "Political Science",
  "Economics",
  "Law",
  "Medicine",
  "Arts",
  "Other",
];
const politicalAreas = [
  "Youth Mobilization",
  "Media Strategy",
  "Policy Research",
  "Grassroots Campaigning",
  "Volunteering",
  "Other",
];
const nigerianStates = [
  "Lagos",
  "Abuja FCT",
  "Rivers",
  "Kano",
  "Oyo",
  "Enugu",
  "Delta",
  "Other",
];

// --- Type definitions ---
interface FormData {
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  country: string;
  state: string;
  city: string;
  educationLevel: string;
  institution: string;
  discipline: string;
  yearOfGraduation: string;
  politicalInterests: string;
  displayPicture: string | File | null;
}

interface StepConfig {
  id: number;
  title: string;
  icon: React.ElementType;
  fields: (keyof FormData)[];
}

// --- Step configuration ---
const stepsConfig: StepConfig[] = [
  {
    id: 1,
    title: "Personal Details",
    icon: User,
    fields: ["fullName", "dateOfBirth", "phoneNumber"],
  },
  {
    id: 2,
    title: "Location",
    icon: MapPin,
    fields: ["country", "state", "city"],
  },
  {
    id: 3,
    title: "Education & Discipline",
    icon: GraduationCap,
    fields: ["educationLevel", "institution", "discipline", "yearOfGraduation"],
  },
  {
    id: 4,
    title: "Mobilization & Photo",
    icon: CheckCircle,
    fields: ["politicalInterests", "displayPicture"],
  },
];

// --- Default form state ---
const initialFormData: FormData = {
  fullName: "",
  dateOfBirth: "",
  phoneNumber: "",
  country: "Nigeria",
  state: "",
  city: "",
  educationLevel: "",
  institution: "",
  discipline: "",
  yearOfGraduation: "",
  politicalInterests: "",
  displayPicture: null as string | File | null,
};

const OnboardingForm: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const { user } = useUser();

  console.log(user)

  // --- Handle input changes ---
  // const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  //   const { name, value, type } = e.target as HTMLInputElement;
  //   if (type === "file" && e.target instanceof HTMLInputElement && e.target.files) {
  //     setFormData((prev) => ({ ...prev, [name]: e.target.files![0] }));
  //   } else {
  //     setFormData((prev) => ({ ...prev, [name]: value }));
  //   }
  // };


  const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const target = e.target as HTMLInputElement | HTMLSelectElement;
  const { name, value, type } = target;

  if (type === "file") {
    const input = target as HTMLInputElement;
    if (input.files && input.files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: input.files![0],
      }));
    }
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

  const validateStep = (currentStep: number) => {
    const stepFields = stepsConfig.find((s) => s.id === currentStep)?.fields || [];
    return stepFields.every((field) => {
      if (field === "displayPicture") return true;
      return Boolean(formData[field]);
    });
  };

  const calculateProgress = () => {
    let completedFields = 0;
    let totalFields = 0;

    stepsConfig.forEach((s) => {
      s.fields.forEach((field) => {
        totalFields++;
        if (formData[field]) completedFields++;
      });
    });

    return Math.round((completedFields / totalFields) * 100);
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, stepsConfig.length));
      setError(null);
    } else {
      setError("Please fill out all required fields before proceeding.");
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) {
      setError("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      ...formData,
      displayPicture: undefined,
      displayPicturePath: formData.displayPicture ?? null,
      yearOfGraduation: parseInt(formData.yearOfGraduation, 10),
    };

    try {
      const response = await axiosInstance.post(`/api/complete-profile`, payload);
      if (response.data.success) {
        setIsComplete(true);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const apiError =
        err.response?.data?.message ||
        "Failed to complete profile. Please try again.";
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  if (isComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6" style={{backgroundImage: " url('/assets/bg/onboard.jpg')", backgroundSize: 'cover' }}>
        <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-md w-full border-t-8 border-blue-700">
          <CheckCircle className="w-16 h-16 text-blue-700 mx-auto mb-4 animate-bounce" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Profile Complete!
          </h2>
          <p className="text-gray-600 mb-6">
            Welcome to GEEP! Your registration is complete and your profile is
            fully set up.
          </p>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="bg-blue-700 text-white font-semibold py-3 px-6 rounded-full hover:bg-blue-800 transition shadow-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const setMobilizationData: React.Dispatch<
    React.SetStateAction<{
      politicalInterests: string;
      displayPicture: string | File | null;
    }>
  > = (value) => {
    setFormData((prev) => {
      const partial =
        typeof value === "function"
          ? value({
              politicalInterests: prev.politicalInterests,
              displayPicture: prev.displayPicture,
            })
          : value;
      return { ...prev, ...partial };
    });
  };


  const CurrentIcon = stepsConfig.find((s) => s.id === step)?.icon || User;

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#EBF4FF]/90 p-4 " style={{backgroundImage: " url('/assets/bg/onboard.jpg')", backgroundSize: 'cover' }}>
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-2xl w-full">
        <h1 className="text-3xl font-extrabold text-blue-900 mb-2 flex items-center">
          <CurrentIcon className="w-8 h-8 mr-3 text-blue-700" />
          GEEP Profile Setup
        </h1>
        <p className="text-gray-600 mb-6 border-b pb-4">
          Step {step} of {stepsConfig.length}: Complete your profile to unlock
          full access and mobilization opportunities.
        </p>

        <div className="mb-6">
          <div className="text-sm font-semibold text-blue-700 mb-2">
            Profile Progress: {calculateProgress()}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-700 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <StepPersonal formData={formData} handleInputChange={handleInputChange} />
          )}
          {step === 2 && (
            <StepLocation
              formData={formData}
              handleInputChange={handleInputChange}
              nigerianStates={nigerianStates}
            />
          )}
          {step === 3 && (
            <StepEducation
              formData={formData}
              handleInputChange={handleInputChange}
              educationLevels={educationLevels}
              disciplines={disciplines}
            />
          )}
          {step === 4 && (
            <StepMobilization
              formData={formData}
              setFormData={setMobilizationData}
              politicalAreas={politicalAreas}
            />
          )}

          <div className="flex justify-between mt-8 pt-4 border-t">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className="flex items-center text-sm font-semibold text-gray-600 hover:text-blue-700 disabled:opacity-50 transition"
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Previous
            </button>

            {step < stepsConfig.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center bg-blue-700 text-white font-semibold py-2 px-6 rounded-full hover:bg-blue-800 transition shadow-md"
              >
                Next <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex items-center bg-green-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-green-700 transition shadow-md disabled:bg-green-400"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
                  </>
                ) : (
                  "Complete Profile"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingForm;