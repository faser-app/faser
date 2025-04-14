let modalState = ref(false)

export function changeModal(state) {
    modalState.value = state
    return
}

export function getModalState() {
    return modalState
}
