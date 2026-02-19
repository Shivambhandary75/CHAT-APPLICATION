import React, { useState } from "react";
import { X, Camera, Save, User } from "lucide-react";

const ProfilePopup = ({ isOpen, onClose, profileData, onSave }) => {
  const [editedProfile, setEditedProfile] = useState({ ...profileData });

  if (!isOpen) return null;

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile({ ...editedProfile, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(editedProfile);
    onClose();
  };

  const handleClose = () => {
    setEditedProfile({ ...profileData });
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
          {/* Profile Photo */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {editedProfile.photo ? (
                <img
                  src={editedProfile.photo}
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
                value={editedProfile.username}
                onChange={(e) => setEditedProfile({ ...editedProfile, username: e.target.value })}
                className="flex-1 border-4 border-black px-4 py-3 text-base font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-0.5 focus:-translate-x-0.5 transition-all"
                placeholder="username"
                style={{ fontFamily: "var(--font-display)" }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-[var(--color-crazy-green)] border-4 border-black font-black px-6 py-3 text-lg uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center gap-2"
            >
              <Save size={20} />
              SAVE
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
