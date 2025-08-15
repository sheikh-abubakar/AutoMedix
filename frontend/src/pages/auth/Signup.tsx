import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import RoleSelector from "./RoleSelector";

const CLOUDINARY_UPLOAD_PRESET = "mypreset"; // Replace with your Cloudinary unsigned preset
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/du9sqdgkn/image/upload"; // Replace with your Cloudinary upload URL

const Signup = () => {
  const { signup } = useAuth();
  const [role, setRole] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    setIsUploading(true);
    const res = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });
    setIsUploading(false);

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const profileImageUrl = formData.get("profileImageUrl") as string;


    if (!role) {
      setError("Please select a role.");
      return;
    }
    if (!profileImage) {
      setError("Please select a profile image.");
      return;
    }

    setError(null);

    try {
      const imageUrl = await handleImageUpload(profileImage);
      //console.log("cloudinary image url:", imageUrl);
      await signup(email, password, name, role.toLowerCase(), imageUrl);
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700">Signup</h2>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="flex flex-col gap-2">
          <label className="text-gray-600">Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-600">Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-600">Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-600">Profile Image:</label>
          <input
            type="file"
            accept="image/*"
            name="profileImage"
            required
            onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
            className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-600">Select Role:</label>
          <RoleSelector value={role} onRoleChange={(role) => setRole(role)} />
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
        >
          {isUploading ? "Uploading..." : "Signup"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
// import React, { useState } from "react";
// import { useAuth } from "@/hooks/useAuth";
// import RoleSelector from "./RoleSelector";

// const Signup = () => {
//   const { signup } = useAuth();
//   const [role, setRole] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [profileImageUrl, setProfileImageUrl] = useState("");



//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     const formData = new FormData(event.currentTarget);
//     const email = formData.get("email") as string;
//     const password = formData.get("password") as string;
//     const name = formData.get("name") as string;
//     const image = formData.get("profileImageUrl") as string;


//     if (!role) {
//       setError("Please select a role.");
//       return;
//     }
//     if (!image) {
//     setError("Profile image is required.");
//     return;
//   }

//     setError(null);
//     try {
//       await signup(email, password, name, role.toLowerCase(), image);
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Signup failed");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6"
//       >
//         <h2 className="text-2xl font-semibold text-center text-gray-700">Signup</h2>

//         {error && <div className="text-red-500 text-sm">{error}</div>}

//         <div className="flex flex-col gap-2">
//           <label className="text-gray-600">Name:</label>
//           <input
//             type="text"
//             name="name"
//             placeholder="Your Name"
//             required
//             className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//           />
//         </div>

//         <div className="flex flex-col gap-2">
//           <label className="text-gray-600">Email:</label>
//           <input
//             type="email"
//             name="email"
//             placeholder="Email Address"
//             required
//             className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//           />
//         </div>

//         <div className="flex flex-col gap-2">
//           <label className="text-gray-600">Password:</label>
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             required
//             className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//           />
//         </div>
//         <div className="flex flex-col gap-2">
//           <label className="text-gray-600">Profile Image URL:</label>
//           <input
//             type="text"
//             name="profileImageUrl"
//             placeholder="Profile Image URL"
//             required
//             className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//             onChange={(e) => setProfileImageUrl(e.target.value)}
//           />
//         </div>

//         <div className="flex flex-col gap-2">
//           <label className="text-gray-600">Select Role:</label>
//           {/* Pass value from state here */}
//           <RoleSelector value={role} onRoleChange={(role) => setRole(role)} />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
//         >
//           Signup
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Signup;


// import React, { useState } from 'react';
// import { useAuth } from '@/hooks/useAuth';
// import RoleSelector from './RoleSelector';

// const Signup = () => {
//   const { signup } = useAuth();
//   const [role, setRole] = useState('');

//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     const email = event.currentTarget.email.value;
//     const password = event.currentTarget.password.value;
//     const name = event.currentTarget.name.value;
//     signup(email, password, name, role);
//   };

//   return (
//     <div>
//       <h1>Signup</h1>
//       <form onSubmit={handleSubmit}>
//         <label>Email:</label>
//         <input type="email" name="email" />
//         <br />
//         <label>Password:</label>
//         <input type="password" name="password" />
//         <br />
//         <label>Name:</label>
//         <input type="text" name="name" />
//         <br />
//         <RoleSelector onRoleChange={(role) => setRole(role)} />
//         <button type="submit">Signup</button>
//       </form>
//     </div>
//   );
// };

// export default Signup;