package damagesim

func (prayer Prayer) getPrayerBoost() prayerBoost {
	switch prayer {
	case Piety:
		return prayerBoost{meleeAttack: factor{6, 5}, meleeStrenght: factor{123, 100}}
	}

	return prayerBoost{}
}
