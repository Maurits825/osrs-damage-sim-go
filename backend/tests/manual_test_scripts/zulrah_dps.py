import random

ZULRAH_MAX_DMG = 50
ZULRAH_MIN_DMG = 45

max_hit = 77
accuracy = 0.8204220237

iterations = 10_000_000

damage_sum = 0
for i in range(iterations):
    damage = int(random.random() * (max_hit + 1))

    if damage > ZULRAH_MAX_DMG:
        damage = int((random.random() * (ZULRAH_MAX_DMG - ZULRAH_MIN_DMG + 1)) + ZULRAH_MIN_DMG)

    damage_sum += damage
average_damage = damage_sum / iterations
dps = (average_damage * accuracy) / 3
print(average_damage)
print(dps)
