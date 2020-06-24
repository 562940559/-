import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
 
export default new Vuex.Store({
state:{
  token:'',
  deptid:'',
},
mutations:{
  set_token(state, token) {
    state.token = token
    localStorage.setItem('token',token);
  },
  del_token(state) {
    state.token = ''
    localStorage.removeItem('token')
  },
  set_deptid(state, deptid) {
    state.deptid = deptid
    localStorage.setItem('deptid',deptid);
  },
  del_account(state) {
    state.deptid = ''
    localStorage.removeItem('deptid')
  },
},
});