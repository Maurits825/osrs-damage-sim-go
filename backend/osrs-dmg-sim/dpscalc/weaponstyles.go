package dpscalc

type CombatOption struct {
	Name        string
	StyleType   combatStyleType
	StyleStance combatStyleStance
}

var WeaponStyles = map[string][]CombatOption{
	"TWO_HANDED_SWORD": {
		{"Chop (Slash/Accurate)", combatStyleType("Slash"), combatStyleStance("Accurate")},
		{"Slash (Slash/Aggressive)", combatStyleType("Slash"), combatStyleStance("Aggressive")},
		{"Smash (Crush/Aggressive)", combatStyleType("Crush"), combatStyleStance("Aggressive")},
		{"Block (Slash/Defensive)", combatStyleType("Slash"), combatStyleStance("Defensive")},
	},
	"AXE": {
		{"Chop (Slash/Accurate)", combatStyleType("Slash"), combatStyleStance("Accurate")},
		{"Hack (Slash/Aggressive)", combatStyleType("Slash"), combatStyleStance("Aggressive")},
		{"Smash (Crush/Aggressive)", combatStyleType("Crush"), combatStyleStance("Aggressive")},
		{"Block (Slash/Defensive)", combatStyleType("Slash"), combatStyleStance("Defensive")},
	},
	"BANNER": {
		{"Lunge (Stab/Accurate)", combatStyleType("stab"), combatStyleStance("Accurate")},
		{"Swipe (Slash/Aggressive)", combatStyleType("Slash"), combatStyleStance("Aggressive")},
		{"Pound (Crush/Aggressive)", combatStyleType("Crush"), combatStyleStance("Aggressive")},
		{"Block (Stab/Defensive)", combatStyleType("Stab"), combatStyleStance("Defensive")},
	},
	"BLADED_STAFF": {
		{"Jab (Stab/Accurate)", combatStyleType("stab"), combatStyleStance("Accurate")},
		{"Swipe (Slash/Aggressive)", combatStyleType("Slash"), combatStyleStance("Aggressive")},
		{"Fend (Crush/Defensive)", combatStyleType("Crush"), combatStyleStance("Defensive")},
		{"Spell (Magic/Autocast)", combatStyleType("Magic"), combatStyleStance("Autocast")},
	},
	"BLUDGEON": {
		{"Pound (Crush/Aggressive)", combatStyleType("Crush"), combatStyleStance("Aggressive")},
		{"Pummel (Crush/Aggressive)", combatStyleType("Crush"), combatStyleStance("Aggressive")},
		{"Smash (Crush/Aggressive)", combatStyleType("Crush"), combatStyleStance("Aggressive")},
	},
	"BLUNT": {
		{"Pound (Crush/Accurate)", combatStyleType("Crush"), combatStyleStance("Accurate")},
		{"Pummel (Crush/Aggressive)", combatStyleType("Crush"), combatStyleStance("Aggressive")},
		{"Block (Crush/Defensive)", combatStyleType("Crush"), combatStyleStance("Defensive")},
	},
	"BOW": {
		{"Accurate (Ranged/Accurate)", combatStyleType("Ranged"), combatStyleStance("Accurate")},
		{"Rapid (Ranged/Rapid)", combatStyleType("Ranged"), combatStyleStance("Rapid")},
		{"Longrange (Ranged/Longrange)", combatStyleType("Ranged"), combatStyleStance("Longrange")},
	},
	"BULWARK": {
		{"Pummel (Crush/Accurate)", combatStyleType("Crush"), combatStyleStance("Accurate")},
	},
	"CHINCHOMPAS": {
		{"Short fuse (Ranged/Accurate)", combatStyleType("Ranged"), combatStyleStance("Accurate")},
		{"Medium fuse (Ranged/Rapid)", combatStyleType("Ranged"), combatStyleStance("Rapid")},
		{"Long fuse (Ranged/Longrange)", combatStyleType("Ranged"), combatStyleStance("Longrange")},
	},
	"CLAW": {
		{"Chop (Slash/Accurate)", combatStyleType("Slash"), combatStyleStance("Accurate")},
		{"Slash (Slash/Aggressive)", combatStyleType("Slash"), combatStyleStance("Aggressive")},
		{"Lunge (Stab/Controlled)", combatStyleType("stab"), combatStyleStance("Controlled")},
		{"Block (Slash/Defensive)", combatStyleType("Slash"), combatStyleStance("Defensive")},
	},
	"CROSSBOW": {
		{"Accurate (Ranged/Accurate)", combatStyleType("Ranged"), combatStyleStance("Accurate")},
		{"Rapid (Ranged/Rapid)", combatStyleType("Ranged"), combatStyleStance("Rapid")},
		{"Longrange (Ranged/Longrange)", combatStyleType("Ranged"), combatStyleStance("Longrange")},
	},
	"PARTISAN": {
		{"Stab (Stab/Accurate)", combatStyleType("stab"), combatStyleStance("Accurate")},
		{"Lunge (Stab/Aggressive)", combatStyleType("stab"), combatStyleStance("Aggressive")},
		{"Pound (Crush/Aggressive)", combatStyleType("Crush"), combatStyleStance("Aggressive")},
		{"Block (Stab/Defensive)", combatStyleType("stab"), combatStyleStance("Accurate")},
	},
	"PICKAXE": {
		{"Spike (Stab/Accurate)", combatStyleType("stab"), combatStyleStance("Accurate")},
		{"Impale (Stab/Aggressive)", combatStyleType("stab"), combatStyleStance("Aggressive")},
		{"Smash (Crush/Aggressive)", combatStyleType("Crush"), combatStyleStance("Aggressive")},
		{"Block (Stab/Defensive)", combatStyleType("stab"), combatStyleStance("Defensive")},
	},
	"POLEARM": {
		{"Jab (Stab/Controlled)", combatStyleType("stab"), combatStyleStance("Controlled")},
		{"Swipe (Slash/Aggressive)", combatStyleType("Slash"), combatStyleStance("Aggressive")},
		{"Fend (Stab/Defensive)", combatStyleType("stab"), combatStyleStance("Defensive")},
	},
	"POLESTAFF": {
		{"Bash (Crush/Accurate)", combatStyleType("Crush"), combatStyleStance("Accurate")},
		{"Pound (Crush/Aggressive)", combatStyleType("Crush"), combatStyleStance("Aggressive")},
		{"Block (Crush/Defensive)", combatStyleType("Crush"), combatStyleStance("Defensive")},
	},
	"POWERED_STAFF": {
		{"Accurate (Magic/Accurate)", combatStyleType("Magic"), combatStyleStance("Accurate")},
		{"Accurate (Magic/Accurate)", combatStyleType("Magic"), combatStyleStance("Accurate")},
		{"Longrange (Magic/Longrange)", combatStyleType("Magic"), combatStyleStance("Longrange")},
	},
	"SALAMANDER": {
		{"Scorch (Slash/Aggressive)", combatStyleType("Slash"), combatStyleStance("Aggressive")},
		{"Flare (Ranged/Accurate)", combatStyleType("Ranged"), combatStyleStance("Accurate")},
		{"Blaze (Magic/Defensive)", combatStyleType("Magic"), combatStyleStance("Defensive")},
	},
	"SCYTHE": {
		{"Reap (Slash/Accurate)", combatStyleType("Slash"), combatStyleStance("Accurate")},
		{"Chop (Slash/Aggressive)", combatStyleType("Slash"), combatStyleStance("Aggressive")},
		{"Jab (Crush/Aggressive)", combatStyleType("Crush"), combatStyleStance("Aggressive")},
		{"Block (Slash/Defensive)", combatStyleType("Slash"), combatStyleStance("Defensive")},
	},
	"SLASH_SWORD": {
		{"Chop (Slash/Accurate)", combatStyleType("Slash"), combatStyleStance("Accurate")},
		{"Slash (Slash/Aggressive)", combatStyleType("Slash"), combatStyleStance("Aggressive")},
		{"Lunge (Stab/Controlled)", combatStyleType("stab"), combatStyleStance("Controlled")},
		{"Block (Slash/Defensive)", combatStyleType("Slash"), combatStyleStance("Defensive")},
	},
	"SPEAR": {
		{"Lunge (Stab/Controlled)", combatStyleType("stab"), combatStyleStance("Controlled")},
		{"Swipe (Slash/Controlled)", combatStyleType("Slash"), combatStyleStance("Controlled")},
		{"Pound (Crush/Controlled)", combatStyleType("Crush"), combatStyleStance("Controlled")},
		{"Block (Stab/Defensive)", combatStyleType("stab"), combatStyleStance("Defensive")},
	},
	"SPIKED": {
		{"Pound (Crush/Accurate)", combatStyleType("Crush"), combatStyleStance("Accurate")},
		{"Pummel (Crush/Aggressive)", combatStyleType("Crush"), combatStyleStance("Aggressive")},
		{"Spike (Stab/Controlled)", combatStyleType("stab"), combatStyleStance("Controlled")},
		{"Block (Crush/Defensive)", combatStyleType("Crush"), combatStyleStance("Defensive")},
	},
	"STAB_SWORD": {
		{"Stab (Stab/Accurate)", combatStyleType("stab"), combatStyleStance("Accurate")},
		{"Lunge (Stab/Aggressive)", combatStyleType("stab"), combatStyleStance("Aggressive")},
		{"Slash (Slash/Aggressive)", combatStyleType("Slash"), combatStyleStance("Aggressive")},
		{"Block (Stab/Defensive)", combatStyleType("stab"), combatStyleStance("Defensive")},
	},
	"STAFF": {
		{"Bash (Crush/Accurate)", combatStyleType("Crush"), combatStyleStance("Accurate")},
		{"Pound (Crush/Aggressive)", combatStyleType("Crush"), combatStyleStance("Aggressive")},
		{"Focus (Crush/Defensive)", combatStyleType("Crush"), combatStyleStance("Defensive")},
		{"Spell (Magic/Autocast)", combatStyleType("Magic"), combatStyleStance("Autocast")},
	},
	"THROWN": {
		{"Accurate (Ranged/Accurate)", combatStyleType("Ranged"), combatStyleStance("Accurate")},
		{"Rapid (Ranged/Rapid)", combatStyleType("Ranged"), combatStyleStance("Rapid")},
		{"Longrange (Ranged/Longrange)", combatStyleType("Ranged"), combatStyleStance("Longrange")},
	},
	"UNARMED": {
		{"Punch (Crush/Accurate)", combatStyleType("Crush"), combatStyleStance("Accurate")},
		{"Kick (Crush/Aggressive)", combatStyleType("Crush"), combatStyleStance("Aggressive")},
		{"Block (Crush/Defensive)", combatStyleType("Crush"), combatStyleStance("Defensive")},
	},
	"WHIP": {
		{"Flick (Slash/Accurate)", combatStyleType("Slash"), combatStyleStance("Accurate")},
		{"Lash (Slash/Controlled)", combatStyleType("Slash"), combatStyleStance("Controlled")},
		{"Deflect (Slash/Defensive)", combatStyleType("Slash"), combatStyleStance("Defensive")},
	},
	"GUN": {
		{"Kick (Crush/Aggressive)", combatStyleType("Crush"), combatStyleStance("Aggressive")},
	}}
