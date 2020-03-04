export const state = () => ({
  deffers: []
})

export const actions = {
  async loadDeffers ({ commit }) {
    try {
      const deffers = await this.$axios.$get('/deffers')
      commit('setDeffers', deffers)
    }catch (e) {
      console.log(e)
    }
  } ,
  async setDeffer ({ commit }, deffer) {
    try {
      const newDeffer = await this.$axios.$post('/deffers', deffer)
      commit('SET_DEFFER', newDeffer)
    }catch (e) {
      console.log(e)
    }
  }
}

export const mutations = {
  setDeffers(state, deffers) {
    state.deffers = deffers
  },
  SET_DEFFER(state, deffer) {
    state.deffers.push(deffer);
  }
}

export const getters = {
  getDeffers (state) {
    return state.deffers
  },

}
