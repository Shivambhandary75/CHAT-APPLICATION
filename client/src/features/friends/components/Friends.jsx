"use client";

import React, { useState, useEffect } from "react";
import { UserPlus, MessageCircle, UserMinus, Search } from "lucide-react";
import { getFriends, sendFriendRequest, removeFriend } from "../api/friends";
import CustomAlert from "../../../components/ui/CustomAlert";
import chatService from "../../chat/services/ChatService";
import { useChatStore } from "../../chat/store/ChatStore";

const Friends = ({ onSelectFriend, showAddSection = true }) => {
	const [friends, setFriends] = useState([]);
	const [showAddFriend, setShowAddFriend] = useState(false);
	const [newFriendUsername, setNewFriendUsername] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [alertState, setAlertState] = useState({
		isOpen: false,
		message: "",
		type: "alert",
		onConfirm: null,
	});

	const setSelectedConversation = useChatStore(
		(s) => s.setSelectedConversation
	);
	const setMessages = useChatStore((s) => s.setMessages);
	const setConversations = useChatStore((s) => s.setConversations);
	const onlineUsers = useChatStore((s) => s.onlineUsers);

	useEffect(() => {
		loadFriends();
	}, []);

	const loadFriends = async () => {
		setIsLoading(true);
		try {
			const friendsData = await getFriends();
			setFriends(friendsData);
		} catch (error) {
			setAlertState({
				isOpen: true,
				message:
					error.message?.toUpperCase() ||
					"FAILED TO LOAD FRIENDS!",
				type: "alert",
				onConfirm: null,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleOpenChat = async (friend) => {
		try {
			const conversation =
				await chatService.createOrGetDirectConversation(
					friend.id
				);
            
            conversation.display_name = friend.display_name || friend.username;
            conversation.username = friend.username;
            conversation.photo_url = friend.photo_url;

			setSelectedConversation(conversation);

			const conversationId = conversation.id;

			const messages =
				await chatService.fetchMessages(conversationId);

			setMessages(conversationId, messages);

			if (onSelectFriend) {
				onSelectFriend(friend);
			}
		} catch (error) {
			console.error("Failed to open chat:", error);
		}
	};

	const filteredFriends = friends.filter(
		(friend) =>
			friend.display_name
				?.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			friend.username
				.toLowerCase()
				.includes(searchQuery.toLowerCase())
	);

	const handleAddFriend = async () => {
		if (newFriendUsername.trim()) {
			try {
				await sendFriendRequest(newFriendUsername.trim());
				setAlertState({
					isOpen: true,
					message: `FRIEND REQUEST SENT TO @${newFriendUsername.toUpperCase()}!`,
					type: "alert",
					onConfirm: null,
				});
				setNewFriendUsername("");
				setShowAddFriend(false);
			} catch (error) {
				setAlertState({
					isOpen: true,
					message:
						error.message?.toUpperCase() ||
						"FAILED TO SEND FRIEND REQUEST!",
					type: "alert",
					onConfirm: null,
				});
			}
		}
	};

	const handleRemoveFriend = (friend) => {
		setAlertState({
			isOpen: true,
			message: `REMOVE ${friend.display_name?.toUpperCase() || friend.username.toUpperCase()} FROM YOUR FRIENDS?`,
			type: "confirm",
			onConfirm: async () => {
				try {
					await removeFriend(friend.username);
					setFriends(
						friends.filter(
							(f) =>
								f.username !== friend.username
						)
					);
					setAlertState({
						isOpen: true,
						message: "FRIEND REMOVED!",
						type: "alert",
						onConfirm: null,
					});
				} catch (error) {
					setAlertState({
						isOpen: true,
						message:
							error.message?.toUpperCase() ||
							"FAILED TO REMOVE FRIEND!",
						type: "alert",
						onConfirm: null,
					});
				}
			},
		});
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
				<h2 className="font-black text-2xl uppercase text-center">
					FRIENDS
				</h2>
			</div>

			{/* Add Friend Section */}
			{showAddSection && (
				<div className="p-4 border-b-4 border-black bg-[var(--color-crazy-green)]">
					{!showAddFriend ? (
						<button
							onClick={() => setShowAddFriend(true)}
							className="w-full bg-[var(--color-crazy-green)] border-4 border-black font-black px-4 py-3 uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
						>
							<UserPlus size={20} />
							ADD FRIEND
						</button>
					) : (
						<div className="space-y-2">
							<input
								type="text"
								value={newFriendUsername}
								onChange={(e) =>
									setNewFriendUsername(e.target.value)
								}
								placeholder="Enter username..."
								className="w-full border-4 border-black px-3 py-2 font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
							/>
							<div className="flex gap-2">
								<button
									onClick={handleAddFriend}
									className="flex-1 bg-[var(--color-crazy-blue)] border-3 border-black font-black px-3 py-2 uppercase text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
								>
									SEND
								</button>
								<button
									onClick={() =>
										setShowAddFriend(false)
									}
									className="flex-1 bg-[var(--color-crazy-pink)] border-3 border-black font-black px-3 py-2 uppercase text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
								>
									CANCEL
								</button>
							</div>
						</div>
					)}
				</div>
			)}

			{/* Search Bar */}
			<div className="p-4 border-b-4 border-black bg-[var(--color-crazy-blue)]">
				<div className="relative flex items-center">
					<Search className="absolute left-3 pointer-events-none" size={20} />
					<input
						type="text"
						value={searchQuery}
						onChange={(e) =>
							setSearchQuery(e.target.value)
						}
						placeholder="Search friends..."
						className="w-full border-4 border-black pl-12 pr-4 py-3 font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
					/>
				</div>
			</div>

			{/* Friends List */}
			<div className="flex-1 overflow-y-auto p-4 space-y-3">
				{isLoading ? (
					<div className="bg-white border-4 border-black p-8 text-center">
						<p className="font-black text-lg uppercase">
							LOADING FRIENDS...
						</p>
					</div>
				) : filteredFriends.length === 0 ? (
					<div className="bg-white border-4 border-black p-8 text-center">
						<p className="font-black text-lg uppercase">
							NO FRIENDS FOUND
						</p>
					</div>
				) : (
					filteredFriends.map((friend, index) => (
						<div
							key={friend.id}
							className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3 flex-1">
									<div className="relative">
										<div
											className={`w-12 h-12 ${getAvatarColor(
												index
											)} border-4 border-black rounded-full flex items-center justify-center font-black text-sm overflow-hidden`}
										>
											{friend.photo_url ? (
												<img src={friend.photo_url} alt={friend.username} className="w-full h-full object-cover" />
											) : (
												(friend.display_name ||
													friend.username)
													.substring(0, 2)
													.toUpperCase()
											)}
										</div>
										{onlineUsers[friend.id] && (
										 <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-black rounded-full animate-pulse"></div>
										)}
									</div>
									<div>
										<h3 className="font-black text-lg">
											{friend.display_name ||
												friend.username}
										</h3>
										<p className="font-bold text-sm">
											@{friend.username}
										</p>
									</div>
								</div>

								<div className="flex flex-col gap-2">
									<button
										onClick={() =>
											handleOpenChat(friend)
										}
										className="bg-[var(--color-crazy-blue)] border-3 border-black p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
									>
										<MessageCircle size={18} />
									</button>

									<button
										onClick={() =>
											handleRemoveFriend(friend)
										}
										className="bg-[var(--color-crazy-pink)] border-3 border-black p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
									>
										<UserMinus size={18} />
									</button>
								</div>
							</div>
						</div>
					))
				)}
			</div>

			{/* Stats Footer */}
			<div className="bg-[var(--color-crazy-pink)] border-t-4 border-black p-4 text-center">
				<p className="font-black uppercase">
					{searchQuery
						? `SHOWING: ${filteredFriends.length} / ${friends.length}`
						: `TOTAL FRIENDS: ${friends.length}`}
				</p>
				<p className="font-bold text-sm mt-1">
					{
						friends.filter(
							(f) => onlineUsers[f.id]
						).length
					}{" "}
					ONLINE
				</p>
			</div>

			<CustomAlert
				isOpen={alertState.isOpen}
				onClose={() =>
					setAlertState({
						isOpen: false,
						message: "",
						type: "alert",
						onConfirm: null,
					})
				}
				message={alertState.message}
				type={alertState.type}
				onConfirm={alertState.onConfirm}
			/>
		</div>
	);
};

export default Friends;