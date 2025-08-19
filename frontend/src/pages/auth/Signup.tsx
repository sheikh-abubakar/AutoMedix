import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import RoleSelector from "./RoleSelector";

const CLOUDINARY_UPLOAD_PRESET = "mypreset";
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
    setIsUploading(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    let profileImageUrl = "";
    let resumeUrl = "";

    if (!role) {
      setError("Please select a role.");
      setIsUploading(false);
      return;
    }
    if (!profileImage) {
      setError("Please select a profile image.");
      setIsUploading(false);
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
        setIsUploading(false);
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
        setTimeout(() => setShowPopup(false), 4000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    }
    setIsUploading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-100 to-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-2">Create Account</h2>
        <p className="text-center text-gray-500 mb-4">Sign up to get started</p>
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2 text-sm text-center border border-red-200">
            {error}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            required
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter your name"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            required
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter your email"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            required
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter password"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Profile Image</label>
          <input
            type="file"
            accept="image/*"
            name="profileImage"
            required
            onChange={e => setProfileImage(e.target.files?.[0] || null)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Select Role</label>
          <RoleSelector value={role} onRoleChange={setRole} />
        </div>
        {role === "patient" && (
          <>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Age</label>
              <input
                type="number"
                name="age"
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Enter your age"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
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
              <label className="font-medium text-gray-700">Experience (years)</label>
              <input
                type="number"
                name="experience"
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Years of experience"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Specialization</label>
              <input
                type="text"
                name="specialization"
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Your specialization"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Resume (PDF/DOC)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                name="resume"
                required
                onChange={e => setResumeFile(e.target.files?.[0] || null)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
              />
            </div>
          </>
        )}
        <button
          type="submit"
          disabled={isUploading}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            isUploading
              ? "bg-indigo-300 text-white cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {isUploading ? "Uploading..." : "Signup"}
        </button>
        {showPopup && (
          <div className="fixed top-8 right-8 z-50 flex items-center gap-3 bg-blue-600 text-white px-6 py-4 rounded-xl shadow-lg animate-slide-in">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4" />
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
            <span className="font-medium">
              Your signup request has been sent to admin for approval.
            </span>
          </div>
        )}
        {authError && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mt-2 text-sm text-center border border-red-200">
            {authError}
          </div>
        )}
      </form>
      <style>
        {`
          .animate-slide-in {
            animation: slide-in 0.5s ease;
          }
          @keyframes slide-in {
            from { opacity: 0; transform: translateY(-20px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
};

export default Signup;


