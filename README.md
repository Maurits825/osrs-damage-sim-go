[![Checks](https://github.com/Maurits825/osrs-damage-sim-go/actions/workflows/osrs-dmg-sim-test.yml/badge.svg)](https://github.com/Maurits825/osrs-damage-sim-go/actions/workflows/osrs-dmg-sim-test.yml) [![Checks](https://github.com/Maurits825/osrs-damage-sim-go/actions/workflows/web-app-test.yml/badge.svg)](https://github.com/Maurits825/osrs-damage-sim-go/actions/workflows/web-app-test.yml)

# Osrs Damage Sim Go
Damage simulator for OSRS written in Go with a angular web app frontend.

# Start

## Environment Setup
### Go
- navigate to osrs-damage-sim/backend/osrs-dmg-sim
- `go install github.com/air-verse/air@latest`
- `go get .`
- `air`
#### Test
- Run all unit tests `go test -v ./...`
- Run all benchmark tests `go test -v ./... -bench . -run=xxx`
- Run benchmark with profiling `go test -bench . -cpuprofile='cpu.prof' -memprofile='mem.prof' -benchmem`

### Angular Frontend
- navigate to osrs-damage-sim/frontend/osrs-damage-sim
- install dependencies `npm install`
- start web app `npm start`
