import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import RoleSelector from "./RoleSelector";

const CLOUDINARY_UPLOAD_PRESET = "firstPreset";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dkmgbgxb8/raw/upload";

export default function Signup({ onLoginClick }: { onLoginClick?: () => void }) {
  const { signup, authError } = useAuth();
  const [role, setRole] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="container-signup animate-slide-in">
        <div className="form-box">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-3xl font-bold text-[#25d7eb] mb-2 text-center">
              Register
            </h2>
            <div className="text-center text-gray-400 mb-4">Create your account</div>
            {error && (
              <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded mb-2 text-sm text-center border border-blue-200">
                {error}
              </div>
            )}
            <div className="input-box">
              <input type="text" name="name" placeholder="Username" required autoComplete="off" />
            </div>
            <div className="input-box">
              <input type="email" name="email" placeholder="Email" required autoComplete="email" />
            </div>
            <div className="input-box">
              <input type="password" name="password" placeholder="Password" required autoComplete="new-password" />
            </div>
            <div className="input-box">
              <label className="text-gray-700 mb-1 block" htmlFor="profileImage">
                Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                name="profileImage"
                id="profileImage"
                required
                onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                style={{ color: "#25d7eb" }}
              />
            </div>
            <div className="input-box">
              <RoleSelector value={role} onRoleChange={setRole} />
            </div>
            {role === "patient" && (
              <>
                <div className="input-box">
                  <input type="number" name="age" placeholder="Age" required />
                </div>
                <div className="input-box">
                  <select name="gender" required className="input-select">
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
                <div className="input-box">
                  <input
                    type="number"
                    name="experience"
                    placeholder="Experience (years)"
                    required
                  />
                </div>
                <div className="input-box">
                  <input
                    type="text"
                    name="specialization"
                    placeholder="Specialization"
                    required
                  />
                </div>
                <div className="input-box">
                  <label className="text-gray-700 mb-1 block" htmlFor="resume">
                    Resume
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    name="resume"
                    id="resume"
                    required
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    style={{ color: "#25d7eb" }}
                  />
                </div>
              </>
            )}
            <button
              type="submit"
              disabled={isUploading}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                isUploading
                  ? "bg-gradient-to-r from-[#2a2082] to-[#1a237e] text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-[#2a2082] to-[#1a237e] text-white hover:from-[#1a237e] hover:to-[#2a2082] shadow-md"
              }`}
              style={{
                boxShadow: "0 0 15px #2a2082",
                border: "none",
                fontWeight: 600,
                fontSize: "18px",
              }}
            >
              {isUploading ? "Uploading..." : "Register"}
            </button>
            <div className="text-center mt-4">
              <span className="text-gray-400">Already have an account? </span>
              <button
                type="button"
                className="text-[#25d7eb] font-semibold hover:underline transition bg-transparent border-none cursor-pointer"
                onClick={onLoginClick}
              >
                Login
              </button>
            </div>
          </form>
        </div>
        <div className="welcome-box">
          <h2 className="text-4xl font-bold text-white mb-2">WELCOME!</h2>
          <p className="text-white font-bold">
            We're delighted to have you here. If you need any assistance, feel free to reach out.
          </p>
          {/* Popup message for signup status */}
          {(showPopup || authError) && (
            <div className="mt-6 flex items-center gap-3 bg-cyan-600 text-white px-6 py-4 rounded-xl shadow-lg animate-slide-in">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
              <span className="font-medium">
                {authError ? authError : "Your signup request has been sent to admin for approval."}
              </span>
            </div>
          )}
        </div>
      </div>
      <style>
        {`
          .container-signup {
            position: relative;
            width: 800px;
            height: 810px;
            border: 2px solid #3299a8;
            box-shadow: 0 0 25px #3299a8; /* blue shadow */
            overflow: hidden;
            background: linear-gradient(120deg, #fff 60%, #3299a8 100%); /* white to blue */
            display: flex;
          }
          .form-box {
            position: absolute;
            top: 0;
            left: 0;
            width: 50%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 50px;
            background: #fff; /* white background */
            z-index: 2;
            color: #555; /* grey text */
          }
          .welcome-box {
            position: absolute;
            right: 0;
            top: 0;
            width: 50%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 50px;
            background: linear-gradient(120deg, #3299a8 50%, #fff 100%);
            color: #555; /* grey text */
            z-index: 1;
          }
          .input-box input,
          .input-box select {
            width: 100%;
            height: 100%;
            background: transparent;
            border: none;
            outline: none;
            font-size: 16px;
            color: #555; /* grey text */
            font-weight: 600;
            border-bottom: 2px solid #3299a8; /* green border */
            padding-right: 23px;
            padding-left: 10px;
            transition: .5s;
          }
          .input-box input[type="file"] {
            border-bottom: none !important;
            box-shadow: none !important;
            padding-left: 0;
            color: #3299a8; /* green for file input */
            font-weight: 400;
            font-size: 14px;
            margin-top: 8px;
          }
          .input-box input:focus,
          .input-box select:focus {
            border-bottom: 2px solid #3299a8;
          }
          .input-box button,
          button[type="submit"] {
            border-bottom: none !important;
          }
          .animate-slide-in {
            animation: slide-in 0.7s cubic-bezier(.68,-0.55,.27,1.55);
          }
          @keyframes slide-in {
            from { opacity: 0; transform: translateY(-40px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
}
