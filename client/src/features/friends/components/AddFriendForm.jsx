import React, { useState, useEffect } from "react";
import { UserPlus } from "lucide-react";
import { searchUsers, sendFriendRequest } from "../api/friends";
import CustomAlert from "../../../components/ui/CustomAlert";

const AddFriendForm = () => {
  const [newFriendUsername, setNewFriendUsername] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [alertState, setAlertState] = useState({
    isOpen: false,
    message: "",
    type: "alert",
    onConfirm: null,
  });

  // Debounce search
  useEffect(() => {
    if (newFriendUsername.trim().length < 2) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const users = await searchUsers(newFriendUsername.trim());
        setSearchResults(users);
        setShowSuggestions(users.length > 0);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
        setShowSuggestions(false);

        // Show alert if unauthorized
        if (error.message.includes("unauthorized") || error.message.includes("401")) {
          setAlertState({
            isOpen: true,
            message: "Please login first to search for users",
            type: "alert",
          });
        }
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [newFriendUsername]);

  const handleAddFriend = async () => {
    if (!newFriendUsername.trim()) {
      setAlertState({
        isOpen: true,
        message: "Please enter a username",
        type: "alert",
      });
      return;
    }

    try {
      await sendFriendRequest(newFriendUsername.trim());
      setAlertState({
        isOpen: true,
        message: `Friend request sent to @${newFriendUsername}!`,
        type: "success",
      });
      setNewFriendUsername("");
      setSearchResults([]);
      setShowSuggestions(false);
    } catch (error) {
      setAlertState({
        isOpen: true,
        message: error.message || "Failed to send friend request",
        type: "alert",
      });
    }
  };

  const handleUsernameChange = (value) => {
    setNewFriendUsername(value);
  };

  const selectSuggestion = async (username) => {
    try {
      await sendFriendRequest(username);
      setAlertState({
        isOpen: true,
        message: `Friend request sent to @${username}!`,
        type: "success",
      });
      setNewFriendUsername("");
      setSearchResults([]);
      setShowSuggestions(false);
    } catch (error) {
      setAlertState({
        isOpen: true,
        message: error.message || "Failed to send friend request",
        type: "alert",
      });
    }
  };

  const getAvatarColor = (index) => {
    const colors = [
      "bg-[var(--color-crazy-pink)]",
      "bg-[var(--color-crazy-blue)]",
      "bg-[var(--color-crazy-green)]",
      "bg-[var(--color-crazy-yellow)]",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="h-full bg-[var(--color-crazy-yellow)] flex flex-col">
      {/* Header */}
      <div className="bg-[var(--color-crazy-pink)] border-b-4 border-black p-4">
        <h2 className="font-black text-2xl uppercase text-center">ADD FRIEND</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
        <div className="bg-white border-6 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl p-8">
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="w-24 h-24 bg-[var(--color-crazy-green)] border-6 border-black rounded-full flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <UserPlus size={48} className="font-black" />
              </div>
              <p className="font-black text-xl uppercase text-center">
                ENTER USERNAME TO ADD FRIEND
              </p>
            </div>

            <div>
              <label className="block font-black text-lg mb-3 uppercase">Friend's Username</label>
              <div className="relative">
                <div className="flex items-center">
                  <span className="bg-black text-white border-4 border-r-0 border-black px-4 py-4 font-black text-lg">@</span>
                  <input
                    type="text"
                    value={newFriendUsername}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    placeholder="Enter username..."
                    className="flex-1 border-4 border-black px-4 py-4 text-lg font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-0.5 focus:-translate-x-0.5 transition-all"
                    style={{ fontFamily: "var(--font-display)" }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAddFriend();
                      }
                    }}
                  />
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-2 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-h-64 overflow-y-auto z-10">
                    {isSearching ? (
                      <div className="p-6 text-center">
                        <p className="font-bold">Searching...</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((user, index) => (
                        <button
                          key={user.id}
                          onClick={() => selectSuggestion(user.username)}
                          className="w-full p-3 border-b-3 border-black hover:bg-[var(--color-crazy-yellow)] active:bg-[var(--color-crazy-green)] active:scale-95 transition-all text-left flex items-center gap-3"
                        >
                          <div className={`w-10 h-10 ${getAvatarColor(index)} border-3 border-black rounded-full flex items-center justify-center font-black text-xs overflow-hidden`}>
                            {user.photo_url ? (
                              <img src={user.photo_url} alt={user.display_name || user.username} className="w-full h-full object-cover" />
                            ) : (
                              user.display_name ? user.display_name.substring(0, 2).toUpperCase() : user.username.substring(0, 2).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="font-black">{user.display_name || user.username}</p>
                            <p className="font-bold text-xs">@{user.username}</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-6 text-center">
                        <p className="font-bold">No users found</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleAddFriend}
              className="w-full bg-[var(--color-crazy-green)] border-4 border-black font-black px-6 py-4 text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center gap-3"
            >
              <UserPlus size={24} />
              SEND FRIEND REQUEST
            </button>

            <div className="bg-[var(--color-crazy-blue)] border-4 border-black p-4 mt-6">
              <p className="font-bold text-sm uppercase text-center">
                TIP: MAKE SURE THE USERNAME IS CORRECT!
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

export default AddFriendForm;
