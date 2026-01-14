package dpscalc

func (prayer Prayer) getPrayerBoost() prayerBoost {
	switch prayer {
	case ThickSkinPrayer:
		return prayerBoost{defence: factor{21, 20}}
	case BurstOfStrengthPrayer:
		return prayerBoost{meleeStrength: factor{21, 20}}
	case ClarityOfThoughtPrayer:
		return prayerBoost{meleeAttack: factor{21, 20}}
	case SharpEyePrayer:
		return prayerBoost{rangedAttack: factor{21, 20}, rangedStrength: factor{21, 20}}
	case MysticWillPrayer:
		return prayerBoost{magicAttack: factor{21, 20}, defenceMagic: factor{21, 20}}
	case RockSkinPrayer:
		return prayerBoost{defence: factor{11, 10}}
	case SuperhumanStrengthPrayer:
		return prayerBoost{meleeStrength: factor{11, 10}}
	case ImprovedReflexesPrayer:
		return prayerBoost{meleeAttack: factor{11, 10}}
	case HawkEyePrayer:
		return prayerBoost{rangedAttack: factor{11, 10}, rangedStrength: factor{11, 10}}
	case MysticLorePrayer:
		return prayerBoost{magicAttack: factor{11, 10}, defenceMagic: factor{11, 10}}
	case SteelSkinPrayer:
		return prayerBoost{defence: factor{23, 20}}
	case UltimateStrengthPrayer:
		return prayerBoost{meleeStrength: factor{23, 20}}
	case IncredibleReflexesPrayer:
		return prayerBoost{meleeAttack: factor{23, 20}}
	case EagleEyePrayer:
		return prayerBoost{rangedAttack: factor{23, 20}, rangedStrength: factor{23, 20}}
	case MysticMightPrayer:
		return prayerBoost{magicAttack: factor{23, 20}, defenceMagic: factor{23, 20}}
	case ChivalryPrayer:
		return prayerBoost{meleeAttack: factor{23, 20}, meleeStrength: factor{118, 100}, defence: factor{6, 5}}
	case PietyPrayer:
		return prayerBoost{meleeAttack: factor{6, 5}, meleeStrength: factor{123, 100}, defence: factor{5, 4}}
	case RigourPrayer:
		return prayerBoost{rangedAttack: factor{6, 5}, rangedStrength: factor{123, 100}, defence: factor{5, 4}}
	case AuguryPrayer:
		return prayerBoost{magicAttack: factor{5, 4}, magicStrength: factor{4, 1}, defence: factor{5, 4}, defenceMagic: factor{5, 4}}
	case Deadeye:
		return prayerBoost{rangedAttack: factor{118, 100}, rangedStrength: factor{118, 100}, defence: factor{105, 100}}
	case MysticVigour:
		return prayerBoost{magicAttack: factor{118, 100}, magicStrength: factor{118, 100}, defence: factor{105, 100}, defenceMagic: factor{118, 100}}
	}

	return prayerBoost{}
}
