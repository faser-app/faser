let modalState = ref(false);

export function changeDisplayNameModal (state) {
    modalState.value = state;
    return
}

export function getModalState () {
    return modalState;
}