namespace Services {
    class ReadyService : Service {
        bool isHealthCheckRunning = false;
        bool isHealthy = true;
        uint64 healthCheckMs = 300000;
        bool isEnabled = true;
        Clients::ReadyClient@ client;
        
        ReadyService() {
            super();
            @client = Clients::ReadyClient(Settings.options);
        }

        bool get_IsHealthy() {
            return isHealthy;
        }

        bool IsReady() {
            return client.Fetch();
        }

        void HealthCheck() {
            if (!isEnabled) return;
            if (isHealthCheckRunning) return;
            isHealthCheckRunning = true;

            while (true) {
                if (!IsReady()) {
                    isHealthy = false;
                    warn("Healthcheck failed. API may not be accessible. Retrying in " + healthCheckMs + "ms..");
                } else {
                    isHealthy = true;
                }
                sleep(healthCheckMs);
            }
        }
    }
}

