export const state = () => ({
  overlayData: {
    isOpen: false,
    title: "",
    text: "",
  },
})
// s
export const getters = {
  getOverlayData: (state) => state.overlayData,
}

export const mutations = {
  SET_OVERLAY_DATA: (state, payload) => {
    state.overlayData = payload
  },
}
