import { defineStore } from "pinia";


export const useStore = defineStore({
    // id: 必须的，在所有 Store 中唯一
    id: "main",
    state: () => {
        return {
            counter: 1,
        }
    },
    getters: {
        doubleCount: (state) => state.counter * 2,
        doublePlusOne: (state) => {
            return state.counter * 2 + 1
        }
    },
    actions: {
        reset() {
            this.counter = 0
        },
        increment() {
            this.counter++
        },
        randomizeCounter() {
            this.counter = Math.round(100 * Math.random())
        },
    },
})