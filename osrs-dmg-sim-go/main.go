package main

import (
	"fmt"
	"net/http"

	"github.com/Maurits825/osrs-damage-sim/osrs-dmg-sim-go/dpscalc"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type status struct {
	Status string `json:"status"`
}

func main() {
	router := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:4200", "https://maurits825.github.io"}
	router.Use(cors.New(config))

	router.GET("/status", getStatus)
	router.POST("/run-dps-calc", postDpsCalc)

	router.Run("localhost:8080")
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

	results := dpscalc.RunDpsCalc(&inputSetup)
	c.JSON(http.StatusOK, results)
}
