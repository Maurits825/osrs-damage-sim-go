import random
import matplotlib.pyplot as plt
import numpy as np

iterations = 1_000_000

randint_values = []
random_values = []

max_value = 1433
min_value = 1345
for i in range(iterations):
    randint_values.append(random.randint(min_value, max_value))
    diff = max_value - min_value
    roll = random.random()
    final_value = int((roll * (max_value - min_value + 1)) + min_value)
    random_values.append(final_value)

# plt.hist(randint_values)
# plt.hist(random_values)

randint_x, randint_counts = np.unique(np.array(randint_values), return_counts=True)
random_x, random_counts = np.unique(np.array(random_values), return_counts=True)

x = [i for i in range(max_value)]
plt.bar(randint_x, randint_counts, width=0.3, label="randint")
plt.bar(random_x+0.3, random_counts, width=0.3, label="random")
plt.legend()
plt.show()
