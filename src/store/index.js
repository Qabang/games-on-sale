import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    shoppingList: [],
    stores: [],
    favouriteStores: [],
  },
  mutations: {
    addToList(state, deal) {
      state.shoppingList.push(deal)
    },
    addStores(state, stores) {
      state.stores = stores
    },
    toggleFavourite(state, storeId) {
      const storeIndex = state.stores.findIndex((x) => x.storeID === storeId)

      // If property favourite exist and is set to true we remove the store from favouriteStores array.
      if (state.stores[storeIndex].favourite === true) {
        Vue.set(state.stores[storeIndex], 'favourite', false)

        // Find the index of the store we want to remove.
        const index = state.favouriteStores.findIndex(
          (x) => x.storeID === storeId
        )
        // If it exist in the array we delete it.
        if (index > -1) {
          Vue.delete(state.favouriteStores, index)
        }
      } else {
        // Add propery favourite to store object.
        Vue.set(state.stores[storeIndex], 'favourite', true)
        state.favouriteStores.push(state.stores[storeIndex])
      }
    },
    removeDeal(state, dealId) {
      const deal_index = state.shoppingList.findIndex(
        (x) => x.dealID === dealId
      )

      if (deal_index > -1) {
        Vue.delete(state.shoppingList, deal_index)
      }
    },
  },
  actions: {
    getStores({ commit }) {
      axios
        .get('https://www.cheapshark.com/api/1.0/stores')
        .then((response) => {
          commit('addStores', response.data)
        })
        .catch((error) => console.error('Get stores: ', error))
    },
  },
  modules: {},
})
