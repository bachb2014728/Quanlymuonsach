<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title mb-3 text-center">Thông tin nhà xuất bản</h5>
      <form class="row g-3" @submit.prevent="handleUpload" enctype="multipart/form-data">
        <div class="">
          <label for="name" class="form-label">Tên NXB</label>
          <input type="text" class="form-control"
                 :class="{ 'is-invalid': errors.name, 'is-valid': newItem.name && !errors.name }" id="name" name="name" v-model="newItem.name">
          <div class="text-danger">{{ errors.name }}</div>
        </div>
        <div class="">
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
        </div>
        <div class="text-center">
          <button type="submit" class="btn btn-sm btn-primary">Thêm NXB</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import PublishingService from "@/services/publishing.service.js";
import { ref} from "vue";

const apiClient = axios.create({
  baseURL: 'https://vnprovinces.pythonanywhere.com/api/',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});
export default {
  name: "AddPublishing",
  setup() {
    const selectedItem = ref(null);
    const selectedIndex = ref(null);
    const selectItem = (item, index) => {
      selectedItem.value = item;
      selectedIndex.value = index;
    };
    return {
      selectedItem,
      selectedIndex,
      selectItem
    }
  },
  data() {
    return {
      resultMessage:'',
      newItem: {name: '', address:''},
      cities: [], districts: [], wards:[], selectedCity: '', selectedDistrict: '', selectedWard: '', errors:{},
    }
  },
  methods:{
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
    async handleUpload() {
      this.errors = {};
      if (!this.newItem.name) {
        this.errors.name = 'Tên NXB không được để trống';
      }
      if (Object.keys(this.errors).length > 0) {
        return;
      }
      try {
        this.newItem.address = {province: this.selectedCity, district: this.selectedDistrict, ward: this.selectedWard}
        console.log(this.newItem);
        const response = await PublishingService.createOne(this.newItem)
        this.$emit('create-item', response.data);
        if (response.status === 200) {
          this.resultMessage = { type: 'success', message: 'Thêm thành công' };
          console.log(this.resultMessage)
        } else {
          this.resultMessage = { type: 'error', message: 'Error' };
        }
      } catch (error) {
        this.resultMessage = { type: 'error', message: error.message };
      }
    },
  },
  created() {
    this.getProvinces();
  }
}
</script>