let modalState = ref(false);

export function changeUsernameModal (state) {
    modalState.value = state;
    return
}

export function getModalState () {
    return modalState;
}