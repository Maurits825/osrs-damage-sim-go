build:
	env GOOS=linux go build -ldflags="-s -w" -o bootstrap main.go
deploy: build
	serverless deploy --stage prod
