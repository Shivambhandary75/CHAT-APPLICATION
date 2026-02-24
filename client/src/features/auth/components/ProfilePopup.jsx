import React, { useState, useEffect, useRef } from "react";
import { X, Camera, Save, User } from "lucide-react";
import { updateProfile } from "../api/auth";

const ProfilePopup = ({ isOpen, onClose, profileData, onSave }) => {
  const [editedProfile, setEditedProfile] = useState({
    name: "",
    username: "",
    photo: null,
    ...profileData,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const prevPreviewRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setEditedProfile({ name: "", username: "", photo: null, ...profileData });
      setSaveError("");
      setPhotoFile(null);
      if (previewURL) URL.revokeObjectURL(previewURL);
      setPreviewURL(null);
      prevPreviewRef.current = null;
    }
  }, [isOpen, profileData]);

  useEffect(() => {
    return () => {
      if (prevPreviewRef.current) URL.revokeObjectURL(prevPreviewRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (previewURL) URL.revokeObjectURL(previewURL);
    const url = URL.createObjectURL(file);
    prevPreviewRef.current = url;
    setPhotoFile(file);
    setPreviewURL(url);
  };

  const displayPhoto = previewURL || editedProfile.photo || null;

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError("");
    try {
      const result = await updateProfile(editedProfile.name, photoFile || undefined);
      const updatedPhoto = result?.photo_url || editedProfile.photo;
      const updated = { ...editedProfile, photo: updatedPhoto };
      setEditedProfile(updated);
      setPhotoFile(null);
      if (previewURL) URL.revokeObjectURL(previewURL);
      setPreviewURL(null);
      prevPreviewRef.current = null;
      onSave(updated);
      onClose();
    } catch (err) {
      setSaveError(err.message || "Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setEditedProfile({ ...profileData });
    setPhotoFile(null);
    if (previewURL) URL.revokeObjectURL(previewURL);
    setPreviewURL(null);
    prevPreviewRef.current = null;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div className="bg-[var(--color-crazy-yellow)] border-6 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] w-full max-w-md pointer-events-auto">
        {/* Header */}
        <div className="bg-[var(--color-crazy-pink)] border-b-4 border-black p-4 flex items-center justify-between">
          <h2 className="font-black text-2xl uppercase">YOUR PROFILE</h2>
          <button
            onClick={handleClose}
            className="bg-black text-white border-3 border-black p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {saveError && (
            <div className="bg-[var(--color-crazy-pink)] border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="font-black uppercase text-center text-sm">{saveError}</p>
            </div>
          )}
          {/* Profile Photo */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {displayPhoto ? (
                <img
                  src={displayPhoto}
                  alt="Profile"
                  className="w-24 h-24 border-6 border-black rounded-full object-cover shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                />
              ) : (
                <div className="w-24 h-24 bg-black text-white border-6 border-black rounded-full flex items-center justify-center font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <User size={40} />
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-[var(--color-crazy-blue)] border-4 border-black rounded-full p-2 cursor-pointer hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                <Camera size={20} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm font-bold uppercase">Click camera to upload photo</p>
          </div>

          {/* Name Input */}
          <div>
            <label className="block font-black text-sm mb-2 uppercase">Name</label>
            <input
              type="text"
              value={editedProfile.name}
              onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
              className="w-full border-4 border-black px-4 py-3 text-base font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-0.5 focus:-translate-x-0.5 transition-all"
              placeholder="Your Name"
              style={{ fontFamily: "var(--font-display)" }}
            />
          </div>

          {/* Username Input */}
          <div>
            <label className="block font-black text-sm mb-2 uppercase">Username</label>
            <div className="flex items-center">
              <span className="bg-black text-white border-4 border-r-0 border-black px-3 py-3 font-black">@</span>
              <input
                type="text"
                value={editedProfile.username || ""}
                readOnly
                className="flex-1 border-4 border-black px-4 py-3 text-base font-bold bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none cursor-not-allowed"
                placeholder="username"
                style={{ fontFamily: "var(--font-display)" }}
              />
            </div>
            <p className="mt-1 text-xs font-bold text-gray-500">Username cannot be changed</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-[var(--color-crazy-green)] border-4 border-black font-black px-6 py-3 text-lg uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {isSaving ? "SAVING..." : "SAVE"}
            </button>
            <button
              onClick={handleClose}
              className="flex-1 bg-[var(--color-crazy-pink)] border-4 border-black font-black px-6 py-3 text-lg uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px]"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePopup;
