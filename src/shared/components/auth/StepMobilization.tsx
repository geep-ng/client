"use client";
import React, { ChangeEvent, useState } from "react";
import Select from "./Select";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";

interface Props {
  formData: {
    politicalInterests: string;
    displayPicture: string | File | null; // now stores the uploaded image URL
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      politicalInterests: string;
      displayPicture: string | File | null;
    }>
  >;
  politicalAreas: string[];
}

const StepMobilization: React.FC<Props> = ({
  formData,
  setFormData,
  politicalAreas,
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | File | null>(formData.displayPicture);

  const handleInputChange = async (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;

    if (type === "file") {
      const input = target as HTMLInputElement;
      if (input.files && input.files[0]) {
        const file = input.files[0];
        setPreview(URL.createObjectURL(file));
        await handleImageUpload(file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (file: File) => {
  try {
    setUploading(true);

    const formData = new FormData();
    formData.append("image", file); // ✅ use a real field name like "image"

    // Debug: list contents
    for (const pair of formData.entries()) {
      console.log(pair[0] + ": ", pair[1]);
    }

    const res = await axiosInstance.post("/api/upload-profile-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Upload response:", res.data);

    if (res.data.fileUrl) {
      setFormData((prev) => ({
        ...prev,
        displayPicture: res.data.fileUrl,
      }));
    } else {
      toast.error("Image upload failed. Please try again.");
    }
  } catch (error) {
    console.error("Upload error:", error);
    toast.error("An error occurred while uploading the image.");
  } finally {
    setUploading(false);
  }
};

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-blue-800 mb-4">
        Mobilization & Profile Photo
      </h2>

      <Select
        label="Area of Political Interest"
        name="politicalInterests"
        placeholder=""
        value={formData.politicalInterests}
        onChange={handleInputChange}
        options={politicalAreas}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Display Picture
        </label>
        <input
          type="file"
          name="displayPicture"
          accept="image/*"
          onChange={handleInputChange}
          className="block w-full border border-gray-300 rounded-lg p-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {uploading && (
          <p className="text-sm text-blue-600 mt-2">Uploading image...</p>
        )}

        {preview && (
          <div className="mt-3">
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-full border-2 border-blue-600 shadow-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StepMobilization;
