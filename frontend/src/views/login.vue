<template>
  <main class="container">
    <div class="pt-3">
      <form @submit.prevent="submit">
        <h1 class="h3 mb-3 card-title text-center">Đăng nhập</h1>
        <div class="form-floating form-group mb-3">
          <input v-model="data.username" type="email" class="form-control form-control-lg" :class="{ 'is-invalid': errors.username }"  placeholder="name@example.com" @input="onChange('username')">
          <label>Email</label>
          <p v-if="errors.username" class="text-danger label"> {{ errors.username }}</p>
        </div>
        <div class="form-floating form-group mb-3">
          <input v-model="data.password" type="password" class="form-control form-control-lg" :class="{ 'is-invalid': errors.password }"  placeholder="password" @input="onChange('password')">
          <label>Password</label>
          <p v-if="errors.password" class="text-danger label"> {{ errors.password }}</p>
        </div>
        <button class="w-100 btn btn-lg btn-success" type="submit">Đăng nhập</button>
      </form>
    </div>
  </main>
</template>

<script>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useStore } from 'vuex';
import AuthService from "@/services/auth.service.js";
import store from "@/store/index.js";

export default {
  name: "login",
  mounted() {
    document.title = 'Đăng nhập'
  },
  setup() {
    const data = reactive({
      username: '',
      password: ''
    });
    const errors = reactive({
      username: '',
      password: ''
    });
    const store = useStore();
    const router = useRouter();
    const onChange = (field) => {
      errors[field] = '';
    }
    const submit = async () => {
      try {
        if (!data.username) errors.username = 'username là rỗng.';
        if (!data.password) errors.password = 'password là rỗng.';

        if (Object.values(errors).every(error => !error)) {
          const response = await AuthService.login(data);
          if (response && response.status === 200) {
            await store.dispatch('setAuth', true);
            localStorage.setItem('token', response.data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            await router.push('/');
            const  responseProfile = await AuthService.profile();
            await store.dispatch('setMessage', responseProfile.data.account.name);
            await store.dispatch('setRole', responseProfile.data.role);

          } else {
            errors.username = 'username hoặc mật khẩu không đúng.';
            errors.password = 'username hoặc mật khẩu không đúng.';
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    return {
      data,
      submit,
      errors,
      onChange
    }
  }
}
</script>

<style scoped>
.is-invalid {
  border-color: red;
}
</style>
