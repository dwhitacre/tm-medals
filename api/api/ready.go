package api

import (
	"context"
	"net/http"
)

func ReadyHandler(w http.ResponseWriter, r *http.Request) {
	logger.Debug("Ready")
	err := db.Ping(context.Background())
	if err != nil {
		logger.Error("DB connection failed", err)
		w.WriteHeader(http.StatusServiceUnavailable)
		return
	}
	w.WriteHeader(http.StatusOK)
}