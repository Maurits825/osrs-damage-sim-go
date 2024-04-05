package main

import (
	"context"
	"fmt"
	"net/http"

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

func main() {
	lambda.Start(Handler)
}

func Handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// If no name is provided in the HTTP request body, throw an error
	return ginLambda.ProxyWithContext(ctx, req)
}

func init() {
	router := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:4200", "https://maurits825.github.io"}
	router.Use(cors.New(config))

	router.GET("/status", getStatus)
	router.POST("/run-dps-calc", postDpsCalc)

	router.Run("localhost:8080")

	ginLambda = ginadapter.New(router)
}

func getStatus(c *gin.Context) {
	c.JSON(http.StatusOK, &status{"osrs-dmg-sim-go is running!"})
}

func postDpsCalc(c *gin.Context) {
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
