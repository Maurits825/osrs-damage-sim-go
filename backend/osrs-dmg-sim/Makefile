build:
	env GOOS=linux GIN_MODE=release go build -ldflags="-s -w" -o bootstrap main.go
deploy: build
	serverless deploy --stage prod
