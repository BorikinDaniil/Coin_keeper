export const state = () => ({
  expenses: []
})

export const actions = {
  async loadExpenses ({ commit }) {
    try {
    const expenses = await this.$axios.$get('/expenses')
      commit('setExpenses', expenses)
    }catch (e) {
      console.log(e)
    }

  }
}
export const mutations = {
  setExpenses(state, expenses) {
    state.expenses = expenses
  }
}
export const getters = {
  getExpenses (state) {
    return state.expenses
  },

}
