package damagesim

type offensiveStats struct {
	stab   int
	slash  int
	crush  int
	magic  int
	ranged int
	prayer int
}

type defensiveStats struct {
	stab   int
	slash  int
	crush  int
	magic  int
	ranged int
}

type damageStats struct {
	meleeStrength  int
	rangedStrength int
	magicStrength  int
}

type equipmentItem struct {
	name           string
	equipmentStats equipmentStats
}

type equipmentStats struct {
	offensiveStats offensiveStats
	defensiveStats defensiveStats
	damageStats    damageStats
}

type player struct {
	equipmentStats equipmentStats
}
