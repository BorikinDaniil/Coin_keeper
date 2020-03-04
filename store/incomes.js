export const state = () => ({
  incomes: []
})

export const actions = {
  async loadIncomes ({ commit }) {
    const incomes = await this.$axios.$get('/incomes')
    try {
      commit('setIncomes', incomes)
    }catch (e) {
      console.log(e)
    }

  }
}
export const mutations = {
  setIncomes(state, incomes) {
    state.incomes = incomes
  }
}
export const getters = {
  getIncomes (state) {
    return state.incomes
  }
}
