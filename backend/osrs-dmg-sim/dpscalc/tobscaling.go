package dpscalc

import "slices"

var (
	verzikP1Ids = []int{
		10830, 10831, 10832, // em
		8369, 8370, 8371, // norm
		10847, 10848, 10849, // hmt
	}

	verzikIds = slices.Concat(verzikP1Ids, []int{
		10833, 10834, 10835, // verzik entry mode
		8372, 8373, 8374, // verzik normal mode
		10850, 10851, 10852, // verzik hard mode
	})
)

func (npc *Npc) applyTobScaling(globalSettings *GlobalSettings) {
	//TODO
}
