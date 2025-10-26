import React, { ChangeEvent } from "react";
import Input from "./Input";
import Select from "./Select";

interface Props {
  formData: {
    country: string;
    state: string;
    city: string;
  };
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  nigerianStates: string[];
}

const StepLocation: React.FC<Props> = ({
  formData,
  handleInputChange,
  nigerianStates,
}) => {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-blue-800 mb-4">
        Location Details
      </h2>

      <Input
        label="Country"
        name="country"
        value={formData.country}
        onChange={handleInputChange}
        placeholder="Enter your country"
        required
      />

      <Select
        label="State of Residence"
        name="state"
        placeholder=""
        value={formData.state}
        onChange={handleInputChange}
        options={nigerianStates}
        required
      />

      <Input
        label="City"
        name="city"
        value={formData.city}
        onChange={handleInputChange}
        placeholder="Enter your city"
        required
      />
    </div>
  );
};

export default StepLocation;
