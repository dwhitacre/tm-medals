FROM golang:1.22 AS build

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY *.go ./
COPY api/*.go ./api/
RUN CGO_ENABLED=0 GOOS=linux go build -o /tm-medals-api

FROM gcr.io/distroless/base-debian12

WORKDIR /
COPY --from=build /tm-medals-api /tm-medals-api

EXPOSE 8080
USER nonroot:nonroot

ENTRYPOINT ["/tm-medals-api"]