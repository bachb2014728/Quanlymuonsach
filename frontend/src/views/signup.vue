<template>
  <main class="container">
    <div class="pt-3">
      <form @submit.prevent="submit">
        <div class="row">
          <div class="col-sm-6">
            <div class="form-floating form-group mb-3">
              <input v-model="data.username" type="email" class="form-control form-control-lg" :class="{ 'is-invalid': errors.username }"  placeholder="name@example.com" @input="onChange('username')">
              <label >Email</label>
              <p v-if="errors.username" class="text-danger label">{{ errors.username }}</p>
            </div>
            <div class="form-floating form-group mb-3">
              <input v-model="data.name" type="text" class="form-control form-control-lg" :class="{ 'is-invalid': errors.name }"  placeholder="Karuizawa Kei" @input="onChange('name')">
              <label >Họ tên</label>
              <p v-if="errors.name" class="text-danger label">{{ errors.name }}</p>
            </div>
            <div class="form-floating form-group mb-3">
              <input v-model="data.phone" type="text" class="form-control form-control-lg" :class="{ 'is-invalid': errors.phone }"  placeholder="0234567899" @input="onChange('phone')">
              <label >Số điện thoại</label>
              <p v-if="errors.phone" class="text-danger label">{{ errors.phone }}</p>
            </div>
          </div>
          <div class="col-sm-6">
            <LocationComponent @location-changed="updateLocation" />
          </div>
        </div>
        <div class="row">
          <div class="col-sm">
            <div class="form-floating form-group mb-3">
              <input v-model="data.password" type="password" class="form-control form-control-lg" :class="{ 'is-invalid': errors.password }"  placeholder="password" @input="onChange('password')">
              <label >Password</label>
              <p v-if="errors.password" class="text-danger label">{{ errors.password }}</p>
            </div>
          </div>
          <div class="col-sm">
            <div class="form-floating form-group mb-3">
              <input v-model="data.passwordConfirm" type="password" class="form-control form-control-lg" :class="{ 'is-invalid': errors.passwordConfirm }" placeholder="password confirm" @input="onChange('passwordConfirm')">
              <label >Password Confirm</label>
              <p v-if="errors.passwordConfirm" class="text-danger label">{{ errors.passwordConfirm }}</p>
            </div>
          </div>
        </div>
        <button class="w-100 btn btn-lg btn-success" type="submit">Đăng ký</button>
      </form>
    </div>
  </main>
</template>

<script>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import AuthService from "@/services/auth.service.js";
import LocationComponent from "@/components/LocationComponent.vue";

export default {
  name: 'signup',
  mounted() {
    document.title = 'Đăng ký';
  },
  components:{
    LocationComponent
  },
  methods:{
    updateLocation(location) {
      this.data.address.province = { code: location.city.id, name: location.city.name };
      this.data.address.district = { code: location.district.id, name: location.district.name };
      this.data.address.ward = { code: location.ward.id, name: location.ward.name };
    },
  },
  setup() {
    const data = reactive({
      username:'',
      name:'',
      phone:'',
      address: {
        province: '',
        district:'',
        ward:''
      },
      role:'USER',
      password:'',
      passwordConfirm: ''
    });
    const errors = reactive({
      username: '',
      name:'',
      phone:'',
      password: '',
      passwordConfirm: ''
    });
    const router = useRouter();
    const onChange = (field) => {
      errors[field] = '';
    }
    const submit = async () => {
      if(!data.username) errors.username = 'Email là rỗng.';
      if(!data.password) errors.password = 'Password là rỗng.';
      if(!data.passwordConfirm) errors.passwordConfirm = 'PasswordConfirm là rỗng.';

      if(data.password !== data.passwordConfirm) {
        errors.passwordConfirm = 'Mật khẩu và mật khẩu xác nhận không khớp. Vui lòng nhập lại.';
      }

      if(Object.values(errors).every(error => !error)) {
        console.log(data);
        await AuthService.signup(data)
        await router.push('/login');
      }
    }
    return{
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
.form-control-lg {
  height: 48px;
}

</style>
