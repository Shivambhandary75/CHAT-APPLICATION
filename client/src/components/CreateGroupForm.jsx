import React, { useState } from "react";
import { Users } from "lucide-react";
import CustomAlert from "./CustomAlert";

const CreateGroupForm = () => {
  const [newGroupName, setNewGroupName] = useState("");
  const [alertState, setAlertState] = useState({
    isOpen: false,
    message: "",
    type: "alert",
    onConfirm: null,
  });

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      setAlertState({
        isOpen: true,
        message: `GROUP "${newGroupName.toUpperCase()}" CREATED SUCCESSFULLY!`,
        type: "alert",
        onConfirm: null,
      });
      setNewGroupName("");
    }
  };

  return (
    <div className="h-full bg-[var(--color-crazy-blue)] flex flex-col">
      {/* Header */}
      <div className="bg-[var(--color-crazy-yellow)] border-b-4 border-black p-4">
        <h2 className="font-black text-2xl uppercase text-center">CREATE GROUP</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
        <div className="bg-white border-6 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl p-8">
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="w-24 h-24 bg-[var(--color-crazy-pink)] border-6 border-black rounded-full flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <Users size={48} className="font-black" />
              </div>
              <p className="font-black text-xl uppercase text-center">
                CREATE YOUR OWN CHAOS ZONE
              </p>
            </div>

            <div>
              <label className="block font-black text-lg mb-3 uppercase">Group Name</label>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter group name..."
                className="w-full border-4 border-black px-4 py-4 text-lg font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-0.5 focus:-translate-x-0.5 transition-all"
                style={{ fontFamily: "var(--font-display)" }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleCreateGroup();
                  }
                }}
              />
            </div>

            <button
              onClick={handleCreateGroup}
              className="w-full bg-[var(--color-crazy-green)] border-4 border-black font-black px-6 py-4 text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center gap-3"
            >
              <Users size={24} />
              CREATE GROUP
            </button>

            <div className="bg-[var(--color-crazy-yellow)] border-4 border-black p-4 mt-6">
              <p className="font-bold text-sm uppercase text-center">
                TIP: CHOOSE A COOL NAME FOR YOUR GROUP!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Alert */}
      <CustomAlert
        isOpen={alertState.isOpen}
        onClose={() => setAlertState({ isOpen: false, message: "", type: "alert", onConfirm: null })}
        message={alertState.message}
        type={alertState.type}
        onConfirm={alertState.onConfirm}
      />
    </div>
  );
};

export default CreateGroupForm;
