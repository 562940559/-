export default {
  set_token(state, token) {
    state.token = token
    sessionStorage.token = token
  },
  del_token(state) {
    state.token = ''
    sessionStorage.removeItem('token')
  },
  set_account(state, account) {
    state.account = account
    sessionStorage.account = account
  },
  del_token(state) {
    state.account = ''
    sessionStorage.removeItem('account')
  }
}
