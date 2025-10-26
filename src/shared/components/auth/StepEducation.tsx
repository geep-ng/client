import React, { ChangeEvent } from "react";
import Input from "./Input";
import Select from "./Select";

interface Props {
  formData: {
    educationLevel: string;
    institution: string;
    discipline: string;
    yearOfGraduation: string;
  };
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  educationLevels: string[];
  disciplines: string[];
}

const StepEducation: React.FC<Props> = ({
  formData,
  handleInputChange,
  educationLevels,
  disciplines,
}) => {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-blue-800 mb-4">
        Education & Discipline
      </h2>

      <Select
        label="Education Level"
        name="educationLevel"
        placeholder=""
        value={formData.educationLevel}
        onChange={handleInputChange}
        options={educationLevels}
        required
      />

      <Input
        label="Institution"
        name="institution"
        value={formData.institution}
        onChange={handleInputChange}
        placeholder="e.g. University of Lagos"
        required
      />

      <Select
        label="Discipline"
        name="discipline"
        placeholder=""
        value={formData.discipline}
        onChange={handleInputChange}
        options={disciplines}
        required
      />

      <Input
        label="Year of Graduation"
        name="yearOfGraduation"
        type="number"
        value={formData.yearOfGraduation}
        onChange={handleInputChange}
        placeholder="e.g. 2022"
        required
      />
    </div>
  );
};

export default StepEducation;
