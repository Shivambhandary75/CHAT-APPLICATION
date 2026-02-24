package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/services"
)

type StatsController struct {
	statsService *services.StatsService
}

func NewStatsController(statsService *services.StatsService) *StatsController {
	return &StatsController{statsService: statsService}
}

func (c *StatsController) StreamStats(ctx *gin.Context) {
	// Set headers for SSE
	ctx.Writer.Header().Set("Content-Type", "text/event-stream")
	ctx.Writer.Header().Set("Cache-Control", "no-cache")
	ctx.Writer.Header().Set("Connection", "keep-alive")

	flusher, ok := ctx.Writer.(http.Flusher)
	if !ok {
		ctx.String(http.StatusInternalServerError, "Streaming unsupported")
		return
	}

	// Send initial stats immediately
	stats, err := c.statsService.GetAppStats(ctx.Request.Context())
	if err == nil {
		data, _ := json.Marshal(stats)
		fmt.Fprintf(ctx.Writer, "event: stats\ndata: %s\n\n", string(data))
		flusher.Flush()
	}

	// Poll every 5 seconds
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	// Listen for client disconnect
	clientGone := ctx.Request.Context().Done()

	for {
		select {
		case <-clientGone:
			return
		case <-ticker.C:
			stats, err := c.statsService.GetAppStats(ctx.Request.Context())
			if err == nil {
				data, _ := json.Marshal(stats)
				fmt.Fprintf(ctx.Writer, "event: stats\ndata: %s\n\n", string(data))
				flusher.Flush()
			}
		}
	}
}
