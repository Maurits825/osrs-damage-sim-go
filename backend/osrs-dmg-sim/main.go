package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"
	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpsgrapher"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	ginadapter "github.com/awslabs/aws-lambda-go-api-proxy/gin"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type status struct {
	Status string `json:"status"`
}

type DpsResults struct {
	DpsCalcResults    dpscalc.DpsCalcResults       `json:"dpsCalcResults"`
	DpsGrapherResults dpsgrapher.DpsGrapherResults `json:"dpsGrapherResults"`
}

var ginLambda *ginadapter.GinLambda

var highscoreUrl = "https://services.runescape.com/m=hiscore_oldschool/index_lite.json"

func main() {
	if len(os.Args) > 1 && os.Args[1] == "localhost" {
		log.Println("Starting local server")
		router := getGinEngine()
		router.Run("localhost:8080")
	} else {
		log.Println("Using gin adapter for aws lambda")
		gin.SetMode(gin.ReleaseMode)
		router := getGinEngine()
		ginLambda = ginadapter.New(router)
		lambda.Start(Handler)
	}
}

func Handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// If no name is provided in the HTTP request body, throw an error
	return ginLambda.ProxyWithContext(ctx, req)
}

func getGinEngine() *gin.Engine {
	router := gin.Default()
	router.SetTrustedProxies(nil)

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:4200", "https://maurits825.github.io"}
	router.Use(cors.New(config))

	router.GET("/status", getStatus)
	router.GET("/lookup-highscore", highscoreLookup)
	router.POST("/run-dps-calc", dpsCalc)
	return router
}

func getStatus(c *gin.Context) {
	c.JSON(http.StatusOK, &status{"osrs-dmg-sim-go is running!"})
}

func dpsCalc(c *gin.Context) {
	var inputSetup dpscalc.InputSetup
	if err := c.ShouldBindJSON(&inputSetup); err != nil {
		fmt.Println(err)
		c.JSON(http.StatusOK, gin.H{"error": "Error with request body"})
		return
	}

	dpsCalcResults := dpscalc.RunDpsCalc(&inputSetup)
	dpsGrapherResults := dpsgrapher.RunDpsGrapher(&inputSetup)
	c.JSON(http.StatusOK, DpsResults{*dpsCalcResults, *dpsGrapherResults})
}

func highscoreLookup(c *gin.Context) {
	player := c.Query("player")
	response, err := http.Get(highscoreUrl + "?player=" + player)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	defer response.Body.Close()

	if response.StatusCode == http.StatusNotFound {
		c.Status(http.StatusNotFound)
		return
	}

	var result map[string]interface{}
	err = json.NewDecoder(response.Body).Decode(&result)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}
