package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/biscalc"
	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"
	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpsgrapher"
	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/simpledmgsim"
	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/wikishortlink"
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
	DpsCalcResults    []*dpscalc.DpsCalcResults       `json:"dpsCalcResults"`
	DpsGrapherResults []*dpsgrapher.DpsGrapherResults `json:"dpsGrapherResults"`
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
	router.POST("/run-simple-dmg-sim", simpleDmgSim)
	router.POST("/run-bis-calc", bisCalc)

	router.POST("/wiki-dps-shortlink", wikiDpsShortlink)
	return router
}

func getStatus(c *gin.Context) {
	c.JSON(http.StatusOK, &status{"osrs-dmg-sim-go is running!"})
}

func dpsCalc(c *gin.Context) {
	var inputSetup dpscalc.InputSetup

	if err := c.ShouldBindJSON(&inputSetup); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := inputSetup.Validate(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	dpsCalcResults := dpscalc.RunDpsCalc(&inputSetup)
	dpsGrapherResults := dpsgrapher.RunDpsGrapher(inputSetup)
	c.JSON(http.StatusOK, DpsResults{dpsCalcResults, dpsGrapherResults})
}

func simpleDmgSim(c *gin.Context) {
	var inputSetup simpledmgsim.InputSetup

	if err := c.ShouldBindJSON(&inputSetup); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := inputSetup.Validate(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	simpleSimresults := simpledmgsim.RunSimpleDmgSim(&inputSetup)
	c.JSON(http.StatusOK, simpleSimresults)
}

func bisCalc(c *gin.Context) {
	var inputSetup biscalc.BisCalcInputSetup

	if err := c.ShouldBindJSON(&inputSetup); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//TODO validation?
	bisCalcResults := biscalc.RunBisCalc(&inputSetup)
	c.JSON(http.StatusOK, bisCalcResults)
}

func wikiDpsShortlink(c *gin.Context) {
	var inputSetup dpscalc.InputSetup

	if err := c.ShouldBindJSON(&inputSetup); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := inputSetup.Validate(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//todo better place to put this
	if inputSetup.GlobalSettings.Npc.Id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "multi npc not support with wiki shortlink"})
		return
	}

	shortLink := wikishortlink.CreateWikiDpsShortlink(inputSetup)
	c.JSON(http.StatusOK, shortLink)
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
