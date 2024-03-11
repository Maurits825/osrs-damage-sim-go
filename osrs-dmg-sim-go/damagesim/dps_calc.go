package damagesim

import (
	"fmt"
)

var allItems items = loadItemWikiData()

func RunDpsCalc(inputSetup *InputSetup) {
	fmt.Println(inputSetup.GlobalSettings.Npc.Id)
	fmt.Println(allItems["35"].Name)
}
