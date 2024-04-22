<script>
import {computed} from "vue";
import axios from "axios";
import {useStore} from "vuex";

export default {
  name: "NavbarComponent",
  setup(){
    const store = useStore();
    const auth = computed(() => store.state.auth);
    const message = computed(() => store.state.message);
    const role = computed(()=> store.state.role);
    const status = role === "USER";
    const logout = async () =>{
      localStorage.removeItem('token');
      axios.defaults.headers.common['Authorization'] = '';
      await store.dispatch('setMessage','')
      await store.dispatch('setAuth',false);
      await store.dispatch('setRole','');
    }

    return {
      auth,
      logout,
      message,
      role,
      status
    }
  }
}
</script>

<template>
  <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
    <a href="/" class="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
      <p v-if="auth">
        Hi, {{message}}
        <span class="badge rounded-pill text-bg-info" v-if="status">{{role}}</span>
        <span class="badge rounded-pill text-bg-warning" v-if="!status">{{role}}</span>
      </p>
    </a>

    <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
      <li>
        <router-link to="/" class="nav-link px-2 link-secondary">Trang chủ</router-link>
      </li>
      <li>
        <router-link to="/books" class="nav-link px-2 link-dark">Sách</router-link>
      </li>
      <li>
        <a href="#" class="nav-link px-2 link-dark">Phiếu mượn trả</a>
      </li>
      <li>
        <router-link to="/publishing" class="nav-link px-2 link-dark">Nhà xuất bản</router-link>
      </li>
      <li v-if="!status">
        <router-link to="/books/create" class="nav-link px-2 link-dark">Thêm sách</router-link>
      </li>
      <li>
        <a href="#" class="nav-link px-2 link-dark">Thông tin cá nhân</a>
      </li>
    </ul>
    <div class="col-md-3 text-end" v-if="!auth">
      <router-link to="/login" type="button" class="btn btn-outline-primary me-2">Login</router-link>
      <router-link to="/register" type="button" class="btn btn-warning">Sign-up</router-link>
    </div>
    <div class="col-md-3 text-end" v-if="auth">
      <router-link to="/" @click="logout" type="button" class="btn btn-sm btn-danger">Đăng xuất</router-link>
    </div>
  </header>
</template>

<style scoped>

</style>