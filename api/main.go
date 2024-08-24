package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"tm-medals/api"

	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	slog.SetDefault(logger)

	pool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_CONNSTR"))
	if err != nil {
		logger.Error("Unable to connect to database", err)
		os.Exit(1)
	}
	defer pool.Close()

	// tm := &http.Client{
	// 	Timeout: time.Second * 20,
	// }

	api.Setup(logger, pool)
	http.HandleFunc("/ready", api.ReadyHandler)
	http.HandleFunc("/api/ready", api.ReadyHandler)
	http.HandleFunc("/api/admin", api.AdminMiddleware(api.AdminHandler))

	logger.Info("Server started")
	logger.Error("Server exited", http.ListenAndServe(os.Getenv("HOST") + ":8081", nil))
}