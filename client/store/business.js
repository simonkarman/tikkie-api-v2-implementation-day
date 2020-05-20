export const state = () => ({
  business: null
})

export const mutations = {
  set (state, payload) {
    state.business = payload
  }
}
