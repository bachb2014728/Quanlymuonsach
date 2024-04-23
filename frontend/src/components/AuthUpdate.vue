<template>
  <div class="col-sm-8" v-if="item">
    <h5 class="mb-3 text-center">Cập nhật thông tin</h5>
    <form @submit.prevent="updateProfile" class="needs-validation" novalidate="">
      <div class="row mb-3">
        <div class="col-sm">
          <label for="name" class="form-label">Họ tên: <em>{{item.account.name}}</em></label>
          <input type="text" class="form-control" id="name"  v-model="updateItem.name">
        </div>
        <div class="col-sm">
          <label for="code" class="form-label">Mã định danh: <em>{{item.account.code}}</em></label>
          <input type="text" class="form-control" id="code"  v-model="updateItem.code">
        </div>
        <div class="col-sm">
          <label for="phone" class="form-label">Số điện thoại: <em>{{item.account.phone}}</em></label>
          <input type="text" class="form-control" id="phone"  v-model="updateItem.phone">
        </div>
      </div>
      <div class="row mb-3">
        <div  class="col-sm-4"  v-if="item.role ==='USER'">
          <label for="gender" class="form-label">Giới tính: <em>{{item.account.gender}}</em></label>
          <input type="text" class="form-control" id="gender"  v-model="updateItem.gender">
        </div>
        <div  class="col-sm-4"  v-if="item.role ==='USER'">
          <label for="date" class="form-label">Ngày sinh: <em>{{new Date(item.account.date)}}</em></label>
          <input type="date" class="form-control" id="date"  v-model="updateItem.date">
        </div>
      </div>
      <div class="row mb-3">
        <label for="addressStart" class="form-label">Địa chỉ</label>
        <div id="addressStart" class="row">
          <select id="provincesStart" name="provinceSender" class="form-select col-sm" v-model="selectedCity" @change="updateCityId">
            <option value="" disabled selected>Chọn tỉnh thành</option>
            <option v-for="(city, index) in cities" :value="city" :key="index">{{ city.name }}</option>
          </select>
          <select id="districtsStart" name="districtSender" class="form-select col-sm" v-model="selectedDistrict" @change="updateDistrictId">
            <option value="" disabled selected>Chọn quận huyện</option>
            <option v-for="(district, index) in districts" :value="district" :key="index">{{ district.name }}</option>
          </select>
          <select id="wardsStart" name="wardSender" class="form-select col-sm " v-model="selectedWard" @change="updateWardId">
            <option value="" disabled selected>Chọn phường xã</option>
            <option v-for="(ward, index) in wards" :value="ward" :key="index">{{ ward.name }}</option>
          </select>
        </div>
      </div>
      <div class="text-center">
        <button class=" btn btn-primary btn-sm" type="submit">Cập nhật</button>
      </div>
    </form>
  </div>
</template>
<script>
import axios from "axios";

const apiClient = axios.create({
  baseURL: 'https://vnprovinces.pythonanywhere.com/api/',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});
export default {
  name: "AuthUpdate",
  props:['item'],
  onMounted() {
    this.updateItem2 = this.item.account
    console.log(this.item)
  },
  data(){
    return{
      cities: [], districts: [], wards:[],
      selectedCity: '', selectedDistrict: '', selectedWard: '',
      updateItem: {name: '', code: '', phone:'', gender: '', date: ''},
      updateItem2: ''
    }
  },
  methods: {
    updateCityId(event) {
      const selectedOption = event.target.options[event.target.selectedIndex];
      this.selectedCity.code = selectedOption.getAttribute('data-id');
      this.getDistricts();
    },
    updateDistrictId(event) {
      const selectedOption = event.target.options[event.target.selectedIndex];
      this.selectedDistrict.code = selectedOption.getAttribute('data-id');
      this.getWards();
    },
    updateWardId(event){
      const selectedOption = event.target.options[event.target.selectedIndex];
      this.selectedWard.code = selectedOption.getAttribute('data-id');
    },
    getProvinces() {
      apiClient.get('provinces/?basic=true&limit=100').then(response => {
        this.cities = response.data.results;
        this.citiesEnd = response.data.results;
      });
    },
    getDistricts() {
      if (this.selectedCity.id) {
        apiClient.get(`provinces/${this.selectedCity.id}`).then(response => {
          this.districts = response.data.districts;
        });
      }
    },
    getWards() {
      if (this.selectedDistrict.id) {
        apiClient.get(`/districts/${this.selectedDistrict.id}`).then(response => {
          this.wards = response.data.wards;
        });
      }
    },
    updateProfile() {
      this.updateItem.value = this.$emit('update', this.item);
      console.log(this.$emit('update', this.item))
    },
  },
  watch: {
  },
  created() {
    this.getProvinces();
    this.updateProfile();
  }
}
</script>