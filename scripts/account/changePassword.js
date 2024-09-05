let modalState = ref(false);

export function changePasswordModal(state) {
  modalState.value = state;
  return;
}

export function getModalState() {
  return modalState;
}