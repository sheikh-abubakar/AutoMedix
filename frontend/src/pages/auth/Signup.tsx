import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import RoleSelector from "./RoleSelector";

const CLOUDINARY_UPLOAD_PRESET = "newpreset";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/du9sqdgkn/raw/upload";

const Signup = () => {
  const { signup, authError } = useAuth();
  const [role, setRole] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Resume upload function
  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    let profileImageUrl = "";
    let resumeUrl = "";

    if (!role) {
      setError("Please select a role.");
      return;
    }
    if (!profileImage) {
      setError("Please select a profile image.");
      return;
    }

    profileImageUrl = await uploadToCloudinary(profileImage);

    let extraFields: any = {};
    if (role === "patient") {
      extraFields.age = formData.get("age");
      extraFields.gender = formData.get("gender");
    }
    if (role === "doctor") {
      extraFields.experience = formData.get("experience");
      extraFields.specialization = formData.get("specialization");
      if (!resumeFile) {
        setError("Please upload your resume.");
        return;
      }
      resumeUrl = await uploadToCloudinary(resumeFile);
      extraFields.resumeUrl = resumeUrl;
    }

    setError(null);

    try {
      await signup(
        email,
        password,
        name,
        role.toLowerCase(),
        profileImageUrl,
        extraFields
      );
      // Show popup after successful signup for doctor
      if (role.toLowerCase() === "doctor") {
        setShowPopup(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
      <h2 className="text-2xl font-semibold text-center text-gray-700">Signup</h2>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex flex-col gap-2">
        <label>Name:</label>
        <input type="text" name="name" required />
      </div>
      <div className="flex flex-col gap-2">
        <label>Email:</label>
        <input type="email" name="email" required />
      </div>
      <div className="flex flex-col gap-2">
        <label>Password:</label>
        <input type="password" name="password" required />
      </div>
      <div className="flex flex-col gap-2">
        <label>Profile Image:</label>
        <input type="file" accept="image/*" name="profileImage" required onChange={e => setProfileImage(e.target.files?.[0] || null)} />
      </div>
      <div className="flex flex-col gap-2">
        <label>Select Role:</label>
        <RoleSelector value={role} onRoleChange={setRole} />
      </div>
      {role === "patient" && (
        <>
          <div className="flex flex-col gap-2">
            <label>Age:</label>
            <input type="number" name="age" required />
          </div>
          <div className="flex flex-col gap-2">
            <label>Gender:</label>
            <select name="gender" required>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </>
      )}
      {role === "doctor" && (
        <>
          <div className="flex flex-col gap-2">
            <label>Experience (years):</label>
            <input type="number" name="experience" required />
          </div>
          <div className="flex flex-col gap-2">
            <label>Specialization:</label>
            <input type="text" name="specialization" required />
          </div>
          <div className="flex flex-col gap-2">
            <label>Resume (PDF):</label>
            <input type="file" accept=".pdf,.doc,.docx" name="resume" required onChange={e => setResumeFile(e.target.files?.[0] || null)} />
          </div>
        </>
      )}
      <button type="submit" disabled={isUploading} className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium">
        {isUploading ? "Uploading..." : "Signup"}
      </button>
      {showPopup && (
        <div className="fixed top-4 right-4 bg-blue-100 text-blue-800 p-4 rounded shadow">
          Your signup request has been sent to admin for approval.
        </div>
      )}
      {authError && (
        <div className="text-red-500">{authError}</div>
      )}
    </form>
  );
};

export default Signup;


