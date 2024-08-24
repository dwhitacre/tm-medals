package api

import (
	"net/http"
)

func AdminHandler(w http.ResponseWriter, r *http.Request) {
	logger.Info("Admin found")
	w.WriteHeader(http.StatusOK)
}