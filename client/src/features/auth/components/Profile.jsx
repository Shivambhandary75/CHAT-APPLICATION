import React, { useState, useEffect, useRef } from "react";
import { Camera, Save, User } from "lucide-react";
import { updateProfile } from "../api/auth";

const Profile = ({ profileData, onSave }) => {
  const [editedProfile, setEditedProfile] = useState({
    name: "",
    username: "",
    photo: null,
    ...profileData,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  // File object for the new photo picked by user
  const [photoFile, setPhotoFile] = useState(null);
  // Local object URL for immediate preview
  const [previewURL, setPreviewURL] = useState(null);
  const prevPreviewRef = useRef(null);

  useEffect(() => {
    if (profileData) setEditedProfile({ name: "", username: "", photo: null, ...profileData });
  }, [profileData]);

  // Revoke old object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (prevPreviewRef.current) URL.revokeObjectURL(prevPreviewRef.current);
    };
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Revoke previous preview
    if (previewURL) URL.revokeObjectURL(previewURL);
    const url = URL.createObjectURL(file);
    prevPreviewRef.current = url;
    setPhotoFile(file);
    setPreviewURL(url);
  };

  // The image src to show: local preview > cloudinary URL > nothing
  const displayPhoto = previewURL || editedProfile.photo || null;

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const result = await updateProfile(editedProfile.name, photoFile || undefined);
      const updatedPhoto = result?.photo_url || editedProfile.photo;
      const updated = { ...editedProfile, photo: updatedPhoto };
      setEditedProfile(updated);
      // Clear local file state after successful upload
      setPhotoFile(null);
      if (previewURL) URL.revokeObjectURL(previewURL);
      setPreviewURL(null);
      prevPreviewRef.current = null;
      if (onSave) onSave(updated);
      setIsEditing(false);
    } catch (err) {
      setSaveError(err.message || "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile({ ...profileData });
    setPhotoFile(null);
    if (previewURL) URL.revokeObjectURL(previewURL);
    setPreviewURL(null);
    prevPreviewRef.current = null;
    setIsEditing(false);
    setSaveError(null);
  };

  return (
    <div className="h-full bg-[var(--color-crazy-yellow)] flex flex-col">
      {/* Header */}
      <div className="bg-[var(--color-crazy-pink)] border-b-4 border-black p-4">
        <h2 className="font-black text-2xl uppercase text-center">YOUR PROFILE</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
        <div className="bg-white border-6 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl p-8">
          <div className="space-y-6">
            {saveError && (
              <div className="bg-[var(--color-crazy-pink)] border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-black uppercase text-center text-sm">{saveError}</p>
              </div>
            )}
            {/* Profile Photo */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {displayPhoto ? (
                  <img
                    src={displayPhoto}
                    alt="Profile"
                    className="w-32 h-32 border-6 border-black rounded-full object-cover shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                  />
                ) : (
                  <div className="w-32 h-32 bg-black text-white border-6 border-black rounded-full flex items-center justify-center font-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <User size={60} />
                  </div>
                )}
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-[var(--color-crazy-blue)] border-4 border-black rounded-full p-3 cursor-pointer hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <Camera size={24} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              {isEditing && <p className="text-sm font-bold uppercase">Click camera to upload photo</p>}
            </div>

            {/* Name Field */}
            <div>
              <label className="block font-black text-lg mb-3 uppercase">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                  className="w-full border-4 border-black px-4 py-3 text-lg font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-0.5 focus:-translate-x-0.5 transition-all"
                  placeholder="Your Name"
                  style={{ fontFamily: "var(--font-display)" }}
                />
              ) : (
                <div className="w-full border-4 border-black px-4 py-3 text-lg font-black bg-[var(--color-crazy-blue)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {editedProfile.name}
                </div>
              )}
            </div>

            {/* Username Field */}
            <div>
              <label className="block font-black text-lg mb-3 uppercase">Username</label>
              {isEditing ? (
                <>
                  <div className="flex items-center">
                    <span className="bg-black text-white border-4 border-r-0 border-black px-4 py-3 font-black text-lg">@</span>
                    <input
                      type="text"
                      value={editedProfile.username || ""}
                      readOnly
                      className="flex-1 border-4 border-black px-4 py-3 text-lg font-bold bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none cursor-not-allowed"
                      placeholder="username"
                      style={{ fontFamily: "var(--font-display)" }}
                    />
                  </div>
                  <p className="mt-2 text-sm font-bold text-gray-500">Username cannot be changed</p>
                </>
              ) : (
                <div className="w-full border-4 border-black px-4 py-3 text-lg font-black bg-[var(--color-crazy-green)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  @{editedProfile.username}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-[var(--color-crazy-pink)] border-4 border-black font-black px-6 py-4 text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px]"
                >
                  EDIT PROFILE
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 bg-[var(--color-crazy-green)] border-4 border-black font-black px-6 py-4 text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Save size={24} />
                    {isSaving ? "SAVING..." : "SAVE"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-[var(--color-crazy-pink)] border-4 border-black font-black px-6 py-4 text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px]"
                  >
                    CANCEL
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
