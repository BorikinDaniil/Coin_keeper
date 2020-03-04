import moment from "moment";
import Vuex from "vuex";

export const state = () => ({
  date: new Date
})

export const actions = {
  async loadDate ({ commit }) {
    try {
      let date = moment()//.format('DD.MM.YYYY')
      commit('SET_DATE', date)
    }catch (e) {
      console.log(e)
    }
  },
  setDate({commit}, date){
    commit('SET_DATE', date)
  }
}
export const mutations = {
  SET_DATE(state, date) {
    state.date = date
  },
  changeDate(state, newDate) {
    state.date = newDate
  }
}
export const getters = {
  getDate (state) {
    return state.date
  }
}
/*
const store = new Vuex.Store({
  state:{
    date: new Date
  },
  actions : {
    setDate({commit}, date){
      commit('SET_DATE', date)
    },

    async loadDate({commit}) {
      try {
        let date = moment()//.format('DD.MM.YYYY')
        commit('SET_DATE', date)
      } catch (e) {
        console.log(e)
      }
    }
  },
  mutations :{
    SET_DATE(state, date) {
      state.date = date
    }
  },
  getters : {
    getDate(state) {
      return state.date
    }
  }
})*/
