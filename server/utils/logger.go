package utils

import (
	"log"
	"net/http"
	"time"
)

// LoggingMiddleware logs HTTP requests
func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		
		// Log request
		log.Printf("[%s] %s %s", r.Method, r.RequestURI, r.RemoteAddr)
		
		// Call the next handler
		next.ServeHTTP(w, r)
		
		// Log duration
		duration := time.Since(start)
		log.Printf("Request completed in %v", duration)
	})
}
