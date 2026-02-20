package handlers

import (
	"chat-app/server/models"
	"chat-app/server/services"
	"context"
	"encoding/json"
	"net/http"
	"strings"
)

type AuthHandler struct {
	userService *services.UserService
}

// NewAuthHandler creates a new auth handler
func NewAuthHandler(userService *services.UserService) *AuthHandler {
	return &AuthHandler{
		userService: userService,
	}
}

// Signup handles user registration
func (h *AuthHandler) Signup(w http.ResponseWriter, r *http.Request) {
	var req models.SignupRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	user, err := h.userService.CreateUser(r.Context(), &req)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	// Generate token for the new user
	token, err := h.userService.GenerateToken(user)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	response := models.AuthResponse{
		Token: token,
		User:  *user,
	}

	respondWithJSON(w, http.StatusCreated, response)
}

// Login handles user authentication
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req models.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	authResponse, err := h.userService.AuthenticateUser(r.Context(), &req)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, err.Error())
		return
	}

	respondWithJSON(w, http.StatusOK, authResponse)
}

// GetProfile retrieves the authenticated user's profile
func (h *AuthHandler) GetProfile(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(string)

	user, err := h.userService.GetUserByID(r.Context(), userID)
	if err != nil {
		respondWithError(w, http.StatusNotFound, "User not found")
		return
	}

	respondWithJSON(w, http.StatusOK, user)
}

// ValidateToken middleware validates JWT token
func (h *AuthHandler) ValidateToken(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			respondWithError(w, http.StatusUnauthorized, "Authorization header is required")
			return
		}

		// Extract token from "Bearer <token>"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			respondWithError(w, http.StatusUnauthorized, "Invalid authorization header format")
			return
		}

		token := parts[1]
		claims, err := h.userService.ValidateToken(token)
		if err != nil {
			respondWithError(w, http.StatusUnauthorized, "Invalid or expired token")
			return
		}

		// Add user information to context
		ctx := r.Context()
		ctx = setContextValue(ctx, "user_id", claims["user_id"].(string))
		ctx = setContextValue(ctx, "email", claims["email"].(string))
		ctx = setContextValue(ctx, "username", claims["username"].(string))

		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

// Helper functions
func respondWithJSON(w http.ResponseWriter, statusCode int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(payload)
}

func respondWithError(w http.ResponseWriter, statusCode int, message string) {
	respondWithJSON(w, statusCode, map[string]string{"error": message})
}

func setContextValue(ctx context.Context, key, value string) context.Context {
	return context.WithValue(ctx, key, value)
}
