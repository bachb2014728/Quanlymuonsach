<template>
  <label for="addressStart" class="form-label">Địa chỉ</label>
  <div id="addressStart">
    <select id="provincesStart" name="provinceSender" class="form-select mb-3" v-model="selectedCity" @change="updateCityId">
      <option value="" disabled selected>Chọn tỉnh thành</option>
      <option v-for="(city, index) in cities" :value="city" :key="index">{{ city.name }}</option>
    </select>
    <select id="districtsStart" name="districtSender" class="form-select mb-3" v-model="selectedDistrict" @change="updateDistrictId">
      <option value="" disabled selected>Chọn quận huyện</option>
      <option v-for="(district, index) in districts" :value="district" :key="index">{{ district.name }}</option>
    </select>
    <select id="wardsStart" name="wardSender" class="form-select mb-3" v-model="selectedWard" @change="updateWardId">
      <option value="" disabled selected>Chọn phường xã</option>
      <option v-for="(ward, index) in wards" :value="ward" :key="index">{{ ward.name }}</option>
    </select>
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
  name: "LocationComponent",
  data(){
    return{
      cities: [],
      districts: [],
      wards:[],
      selectedCity: '',
      selectedDistrict: '',
      selectedWard: '',
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
    emitLocation() {
      this.$emit('location-changed', {
        city: this.selectedCity,
        district: this.selectedDistrict,
        ward: this.selectedWard,
      });
    }
  },
  watch: {
    selectedWard() {
      this.emitLocation();
    }
  },
  created() {
    this.getProvinces();
  }
}
</script>