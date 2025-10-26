import React, { ChangeEvent } from "react";
import Input from "./Input";

interface Props {
  formData: {
    fullName: string;
    dateOfBirth: string;
    phoneNumber: string;
  };
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const StepPersonal: React.FC<Props> = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-blue-800 mb-4">
        Personal Information
      </h2>
      <Input
        label="Full Name"
        name="fullName"
        value={formData.fullName}
        onChange={handleInputChange}
        placeholder="Enter your full name"
        required
      />

      <Input
        label="Date of Birth"
        name="dateOfBirth"
        type="date"
        value={formData.dateOfBirth}
        onChange={handleInputChange}
        required
      />

      <Input
        label="Phone Number"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleInputChange}
        placeholder="e.g. +2348012345678"
        required
      />
    </div>
  );
};

export default StepPersonal;
