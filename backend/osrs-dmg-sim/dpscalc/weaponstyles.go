package dpscalc

type CombatOption struct {
	Name        string
	StyleType   CombatStyleType
	StyleStance combatStyleStance
}

var WeaponStyles = map[string][]CombatOption{
	"TWO_HANDED_SWORD": {
		{"Chop (Slash/Accurate)", CombatStyleType("Slash"), combatStyleStance("Accurate")},
		{"Slash (Slash/Aggressive)", CombatStyleType("Slash"), combatStyleStance("Aggressive")},
		{"Smash (Crush/Aggressive)", CombatStyleType("Crush"), combatStyleStance("Aggressive")},
		{"Block (Slash/Defensive)", CombatStyleType("Slash"), combatStyleStance("Defensive")},
	},
	"AXE": {
		{"Chop (Slash/Accurate)", CombatStyleType("Slash"), combatStyleStance("Accurate")},
		{"Hack (Slash/Aggressive)", CombatStyleType("Slash"), combatStyleStance("Aggressive")},
		{"Smash (Crush/Aggressive)", CombatStyleType("Crush"), combatStyleStance("Aggressive")},
		{"Block (Slash/Defensive)", CombatStyleType("Slash"), combatStyleStance("Defensive")},
	},
	"BANNER": {
		{"Lunge (Stab/Accurate)", CombatStyleType("Stab"), combatStyleStance("Accurate")},
		{"Swipe (Slash/Aggressive)", CombatStyleType("Slash"), combatStyleStance("Aggressive")},
		{"Pound (Crush/Aggressive)", CombatStyleType("Crush"), combatStyleStance("Aggressive")},
		{"Block (Stab/Defensive)", CombatStyleType("Stab"), combatStyleStance("Defensive")},
	},
	"BLADED_STAFF": {
		{"Jab (Stab/Accurate)", CombatStyleType("Stab"), combatStyleStance("Accurate")},
		{"Swipe (Slash/Aggressive)", CombatStyleType("Slash"), combatStyleStance("Aggressive")},
		{"Fend (Crush/Defensive)", CombatStyleType("Crush"), combatStyleStance("Defensive")},
		{"Spell (Magic/Autocast)", CombatStyleType("Magic"), combatStyleStance("Autocast")},
	},
	"BLUDGEON": {
		{"Pound (Crush/Aggressive)", CombatStyleType("Crush"), combatStyleStance("Aggressive")},
		{"Pummel (Crush/Aggressive)", CombatStyleType("Crush"), combatStyleStance("Aggressive")},
		{"Smash (Crush/Aggressive)", CombatStyleType("Crush"), combatStyleStance("Aggressive")},
	},
	"BLUNT": {
		{"Pound (Crush/Accurate)", CombatStyleType("Crush"), combatStyleStance("Accurate")},
		{"Pummel (Crush/Aggressive)", CombatStyleType("Crush"), combatStyleStance("Aggressive")},
		{"Block (Crush/Defensive)", CombatStyleType("Crush"), combatStyleStance("Defensive")},
	},
	"BOW": {
		{"Accurate (Ranged/Accurate)", CombatStyleType("Ranged"), combatStyleStance("Accurate")},
		{"Rapid (Ranged/Rapid)", CombatStyleType("Ranged"), combatStyleStance("Rapid")},
		{"Longrange (Ranged/Longrange)", CombatStyleType("Ranged"), combatStyleStance("Longrange")},
	},
	"BULWARK": {
		{"Pummel (Crush/Accurate)", CombatStyleType("Crush"), combatStyleStance("Accurate")},
	},
	"CHINCHOMPAS": {
		{"Short fuse (Ranged/Accurate)", CombatStyleType("Ranged"), combatStyleStance("Accurate")},
		{"Medium fuse (Ranged/Rapid)", CombatStyleType("Ranged"), combatStyleStance("Rapid")},
		{"Long fuse (Ranged/Longrange)", CombatStyleType("Ranged"), combatStyleStance("Longrange")},
	},
	"CLAW": {
		{"Chop (Slash/Accurate)", CombatStyleType("Slash"), combatStyleStance("Accurate")},
		{"Slash (Slash/Aggressive)", CombatStyleType("Slash"), combatStyleStance("Aggressive")},
		{"Lunge (Stab/Controlled)", CombatStyleType("Stab"), combatStyleStance("Controlled")},
		{"Block (Slash/Defensive)", CombatStyleType("Slash"), combatStyleStance("Defensive")},
	},
	"CROSSBOW": {
		{"Accurate (Ranged/Accurate)", CombatStyleType("Ranged"), combatStyleStance("Accurate")},
		{"Rapid (Ranged/Rapid)", CombatStyleType("Ranged"), combatStyleStance("Rapid")},
		{"Longrange (Ranged/Longrange)", CombatStyleType("Ranged"), combatStyleStance("Longrange")},
	},
	"PARTISAN": {
		{"Stab (Stab/Accurate)", CombatStyleType("Stab"), combatStyleStance("Accurate")},
		{"Lunge (Stab/Aggressive)", CombatStyleType("Stab"), combatStyleStance("Aggressive")},
		{"Pound (Crush/Aggressive)", CombatStyleType("Crush"), combatStyleStance("Aggressive")},
		{"Block (Stab/Defensive)", CombatStyleType("Stab"), combatStyleStance("Accurate")},
	},
	"PICKAXE": {
		{"Spike (Stab/Accurate)", CombatStyleType("Stab"), combatStyleStance("Accurate")},
		{"Impale (Stab/Aggressive)", CombatStyleType("Stab"), combatStyleStance("Aggressive")},
		{"Smash (Crush/Aggressive)", CombatStyleType("Crush"), combatStyleStance("Aggressive")},
		{"Block (Stab/Defensive)", CombatStyleType("Stab"), combatStyleStance("Defensive")},
	},
	"POLEARM": {
		{"Jab (Stab/Controlled)", CombatStyleType("Stab"), combatStyleStance("Controlled")},
		{"Swipe (Slash/Aggressive)", CombatStyleType("Slash"), combatStyleStance("Aggressive")},
		{"Fend (Stab/Defensive)", CombatStyleType("Stab"), combatStyleStance("Defensive")},
	},
	"POLESTAFF": {
		{"Bash (Crush/Accurate)", CombatStyleType("Crush"), combatStyleStance("Accurate")},
		{"Pound (Crush/Aggressive)", CombatStyleType("Crush"), combatStyleStance("Aggressive")},
		{"Block (Crush/Defensive)", CombatStyleType("Crush"), combatStyleStance("Defensive")},
	},
	"POWERED_STAFF": {
		{"Accurate (Magic/Accurate)", CombatStyleType("Magic"), combatStyleStance("Accurate")},
		{"Accurate (Magic/Accurate)", CombatStyleType("Magic"), combatStyleStance("Accurate")},
		{"Longrange (Magic/Longrange)", CombatStyleType("Magic"), combatStyleStance("Longrange")},
	},
	"SALAMANDER": {
		{"Scorch (Slash/Aggressive)", CombatStyleType("Slash"), combatStyleStance("Aggressive")},
		{"Flare (Ranged/Accurate)", CombatStyleType("Ranged"), combatStyleStance("Accurate")},
		{"Blaze (Magic/Defensive)", CombatStyleType("Magic"), combatStyleStance("Defensive")},
	},
	"SCYTHE": {
		{"Reap (Slash/Accurate)", CombatStyleType("Slash"), combatStyleStance("Accurate")},
		{"Chop (Slash/Aggressive)", CombatStyleType("Slash"), combatStyleStance("Aggressive")},
		{"Jab (Crush/Aggressive)", CombatStyleType("Crush"), combatStyleStance("Aggressive")},
		{"Block (Slash/Defensive)", CombatStyleType("Slash"), combatStyleStance("Defensive")},
	},
	"SLASH_SWORD": {
		{"Chop (Slash/Accurate)", CombatStyleType("Slash"), combatStyleStance("Accurate")},
		{"Slash (Slash/Aggressive)", CombatStyleType("Slash"), combatStyleStance("Aggressive")},
		{"Lunge (Stab/Controlled)", CombatStyleType("Stab"), combatStyleStance("Controlled")},
		{"Block (Slash/Defensive)", CombatStyleType("Slash"), combatStyleStance("Defensive")},
	},
	"SPEAR": {
		{"Lunge (Stab/Controlled)", CombatStyleType("Stab"), combatStyleStance("Controlled")},
		{"Swipe (Slash/Controlled)", CombatStyleType("Slash"), combatStyleStance("Controlled")},
		{"Pound (Crush/Controlled)", CombatStyleType("Crush"), combatStyleStance("Controlled")},
		{"Block (Stab/Defensive)", CombatStyleType("Stab"), combatStyleStance("Defensive")},
	},
	"SPIKED": {
		{"Pound (Crush/Accurate)", CombatStyleType("Crush"), combatStyleStance("Accurate")},
		{"Pummel (Crush/Aggressive)", CombatStyleType("Crush"), combatStyleStance("Aggressive")},
		{"Spike (Stab/Controlled)", CombatStyleType("Stab"), combatStyleStance("Controlled")},
		{"Block (Crush/Defensive)", CombatStyleType("Crush"), combatStyleStance("Defensive")},
	},
	"STAB_SWORD": {
		{"Stab (Stab/Accurate)", CombatStyleType("Stab"), combatStyleStance("Accurate")},
		{"Lunge (Stab/Aggressive)", CombatStyleType("Stab"), combatStyleStance("Aggressive")},
		{"Slash (Slash/Aggressive)", CombatStyleType("Slash"), combatStyleStance("Aggressive")},
		{"Block (Stab/Defensive)", CombatStyleType("Stab"), combatStyleStance("Defensive")},
	},
	"STAFF": {
		{"Bash (Crush/Accurate)", CombatStyleType("Crush"), combatStyleStance("Accurate")},
		{"Pound (Crush/Aggressive)", CombatStyleType("Crush"), combatStyleStance("Aggressive")},
		{"Focus (Crush/Defensive)", CombatStyleType("Crush"), combatStyleStance("Defensive")},
		{"Spell (Magic/Autocast)", CombatStyleType("Magic"), combatStyleStance("Autocast")},
	},
	"THROWN": {
		{"Accurate (Ranged/Accurate)", CombatStyleType("Ranged"), combatStyleStance("Accurate")},
		{"Rapid (Ranged/Rapid)", CombatStyleType("Ranged"), combatStyleStance("Rapid")},
		{"Longrange (Ranged/Longrange)", CombatStyleType("Ranged"), combatStyleStance("Longrange")},
	},
	"UNARMED": {
		{"Punch (Crush/Accurate)", CombatStyleType("Crush"), combatStyleStance("Accurate")},
		{"Kick (Crush/Aggressive)", CombatStyleType("Crush"), combatStyleStance("Aggressive")},
		{"Block (Crush/Defensive)", CombatStyleType("Crush"), combatStyleStance("Defensive")},
	},
	"WHIP": {
		{"Flick (Slash/Accurate)", CombatStyleType("Slash"), combatStyleStance("Accurate")},
		{"Lash (Slash/Controlled)", CombatStyleType("Slash"), combatStyleStance("Controlled")},
		{"Deflect (Slash/Defensive)", CombatStyleType("Slash"), combatStyleStance("Defensive")},
	},
	"GUN": {
		{"Kick (Crush/Aggressive)", CombatStyleType("Crush"), combatStyleStance("Aggressive")},
	},
}
