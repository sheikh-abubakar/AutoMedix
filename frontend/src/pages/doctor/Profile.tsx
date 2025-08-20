import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Save, Upload } from "lucide-react";

const CLOUDINARY_UPLOAD_PRESET = "firstPreset";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dkmgbgxb8/raw/upload";

export default function DoctorProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [editField, setEditField] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    console.log("Fetching profile for user:", user._id);
    fetch(`http://localhost:5000/api/doctor-profiles/${user._id}`)
      .then(res => res.json())
      .then(data => {
        console.log("Received profile data:", data);
        setProfile(data);
        setForm({
          profileImageUrl: data.profileImageUrl || "",
          experience_years: data.experience_years || "",
          specialty: data.specialty || "",
          qualifications: data.qualifications || "",
          hospital_address: data.hospital_address || "",
          consultation_fee: data.consultation_fee || "",
          bio: data.bio || "",
        });
        setImagePreview(null);
        setError(null);
      })
      .catch(() => {
        console.error("Error fetching profile:", err);
        setError("Unable to load profile.");
        setProfile(null);
      });
  }, [user]);

  if (!user) {
    return (
      <Layout>
        <div className="p-8 max-w-2xl mx-auto text-center text-gray-600">
          Loading profile...
        </div>
      </Layout>
    );
  }
  if (error) {
    return (
      <Layout>
        <div className="p-8 max-w-2xl mx-auto text-center text-red-600">
          {error}
        </div>
      </Layout>
    );
  }
  if (!profile) {
    return (
      <Layout>
        <div className="p-8 max-w-2xl mx-auto text-center text-gray-600">
          Loading profile...
        </div>
      </Layout>
    );
  }

  const handleEdit = (field: string) => setEditField(field);
  const handleCancel = () => {
    setEditField(null);
    setForm({
      profileImageUrl: profile.profileImageUrl || "",
      experience_years: profile.experience_years || "",
      specialty: profile.specialty || "",
      qualifications: profile.qualifications || "",
      hospital_address: profile.hospital_address || "",
      consultation_fee: profile.consultation_fee || "",
      bio: profile.bio || "",
    });
    setImagePreview(null);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setSaving(true);
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      const res = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
      const data = await res.json();
      setForm((prev: any) => ({ ...prev, profileImageUrl: data.secure_url }));
      setSaving(false);
      setEditField("profileImageUrl");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch(`http://localhost:5000/api/doctor-profiles/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setEditField(null);
    setSaving(false);
    // Refresh profile
    fetch(`http://localhost:5000/api/doctor-profiles/${user._id}`)
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setForm({
          profileImageUrl: data.profileImageUrl || "",
          experience_years: data.experience_years || "",
          specialty: data.specialty || "",
          qualifications: data.qualifications || "",
          hospital_address: data.hospital_address || "",
          consultation_fee: data.consultation_fee || "",
          bio: data.bio || "",
        });
        setImagePreview(null);
      });
  };

  return (
    <Layout>
      <div className="p-8 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary mb-2">
              My Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Profile Image */}
            <div className="flex items-center space-x-6 mb-8">
              <div className="relative">
                <img
                  src={
                    imagePreview ||
                    form.profileImageUrl ||
                    profile.profileImageUrl ||
                    "/default-avatar.png"
                  }
                  alt="Profile"
                  className="h-24 w-24 rounded-full object-cover border-4 border-blue-200"
                />
                <label className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer hover:bg-blue-600">
                  <Upload className="h-4 w-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
                {editField === "profileImageUrl" && (
                  <div className="flex space-x-4 mt-2">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-blue-600 text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Saving..." : "Save"}
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <div className="text-xl font-semibold text-gray-900">
                  {profile.name}
                </div>
                <div className="text-gray-500">{profile.email}</div>
              </div>
            </div>

            {/* Editable Fields */}
            <div className="space-y-6">
              {/* Experience */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Experience (years)</div>
                  {editField === "experience_years" ? (
                    <input
                      type="number"
                      name="experience_years"
                      value={form.experience_years}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-24"
                    />
                  ) : (
                    <div className="text-lg font-medium">
                      {profile.experience_years}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit("experience_years")}
                >
                  <Pencil className="h-5 w-5 text-blue-500" />
                </Button>
              </div>

              {/* Specialization */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Specialization</div>
                  {editField === "specialty" ? (
                    <input
                      type="text"
                      name="specialty"
                      value={form.specialty}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-48"
                    />
                  ) : (
                    <div className="text-lg font-medium">{profile.specialty}</div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit("specialty")}
                >
                  <Pencil className="h-5 w-5 text-blue-500" />
                </Button>
              </div>

              {/* Qualifications */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Qualifications</div>
                  {editField === "qualifications" ? (
                    <input
                      type="text"
                      name="qualifications"
                      value={form.qualifications}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-64"
                    />
                  ) : (
                    <div className="text-lg font-medium">
                      {profile.qualifications}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit("qualifications")}
                >
                  <Pencil className="h-5 w-5 text-blue-500" />
                </Button>
              </div>

              {/* Hospital Address */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Hospital Address</div>
                  {editField === "hospital_address" ? (
                    <input
                      type="text"
                      name="hospital_address"
                      value={form.hospital_address}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-64"
                    />
                  ) : (
                    <div className="text-lg font-medium">
                      {profile.hospital_address}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit("hospital_address")}
                >
                  <Pencil className="h-5 w-5 text-blue-500" />
                </Button>
              </div>

              {/* Consultation Fee */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Consultation Fee</div>
                  {editField === "consultation_fee" ? (
                    <input
                      type="number"
                      name="consultation_fee"
                      value={form.consultation_fee}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-24"
                    />
                  ) : (
                    <div className="text-lg font-medium">
                      {profile.consultation_fee}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit("consultation_fee")}
                >
                  <Pencil className="h-5 w-5 text-blue-500" />
                </Button>
              </div>

              {/* Bio */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Bio</div>
                  {editField === "bio" ? (
                    <textarea
                      name="bio"
                      value={form.bio}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                      rows={3}
                    />
                  ) : (
                    <div className="text-lg font-medium">{profile.bio}</div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit("bio")}
                >
                  <Pencil className="h-5 w-5 text-blue-500" />
                </Button>
              </div>
            </div>

            {/* Save/Cancel Buttons */}
            {editField && editField !== "profileImageUrl" && (
              <div className="flex space-x-4 mt-6">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-blue-600 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}