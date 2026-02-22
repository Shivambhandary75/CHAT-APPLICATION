import React, { useState, useEffect } from "react";
import { Camera, Save, User } from "lucide-react";

const Profile = ({ profileData, onSave }) => {
  const [editedProfile, setEditedProfile] = useState({
    name: "",
    username: "",
    photo: null,
    ...profileData,
  });

  useEffect(() => {
    if (profileData) setEditedProfile({ name: "", username: "", photo: null, ...profileData });
  }, [profileData]);
  const [isEditing, setIsEditing] = useState(false);

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
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile({ ...profileData });
    setIsEditing(false);
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
            {/* Profile Photo */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {editedProfile.photo ? (
                  <img
                    src={editedProfile.photo}
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
                    className="flex-1 bg-[var(--color-crazy-green)] border-4 border-black font-black px-6 py-4 text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center gap-2"
                  >
                    <Save size={24} />
                    SAVE
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
