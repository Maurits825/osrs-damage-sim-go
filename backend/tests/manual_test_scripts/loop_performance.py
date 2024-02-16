from dataclasses import dataclass
import numpy as np
from numpy import ndarray


@dataclass()
class State:
    value1: int
    value2: int
    value3: int
    value4: int
    value5: int
    value6: int


@dataclass()
class StateList:
    values1: list[int]
    values2: list[int]
    values3: list[int]
    values4: list[int]
    values5: list[int]
    values6: list[int]


@dataclass()
class StateNpArray:
    values1: ndarray
    values2: ndarray
    values3: ndarray
    values4: ndarray
    values5: ndarray
    values6: ndarray


iterations = 5_000_000


def state_loop():
    state_list = []
    for i in range(iterations):
        state_list.append(State(1, 2, 3, 4, 5, 6))
    return state_list


def state_list_loop():
    state_list = StateList([], [], [], [], [], [])
    for i in range(iterations):
        state_list.values1.append(1)
        state_list.values2.append(2)
        state_list.values3.append(3)
        state_list.values4.append(4)
        state_list.values5.append(5)
        state_list.values6.append(6)
    return state_list


def state_np_array():
    state_list = StateNpArray(np.zeros(iterations), np.zeros(iterations), np.zeros(iterations), np.zeros(iterations), np.zeros(iterations), np.zeros(iterations))
    for i in range(iterations):
        state_list.values1[i] = 1
        state_list.values2[i] = 2
        state_list.values3[i] = 3
        state_list.values4[i] = 4
        state_list.values5[i] = 5
        state_list.values6[i] = 6
    return state_list


r1 = state_loop()
r2 = state_list_loop()
r3 = state_np_array()
