<template>
  <div class="card">
    <h5 class="card-title text-center mt-3">{{item.name}}</h5>
    <div class="card-body">
      <p class="card-text">Mã NXB: <em>{{item.id}}</em></p>
      <p class="card-text">Địa chỉ : <em>{{item.ward.name}}, {{item.district.name}}, {{item.province.name}}</em></p>
      <p class="card-text">
        Sách :
        <ul v-for="(item,index) in item.books" :key="index">
          <li>Mã sách : {{item}}</li>
        </ul>
      </p>
    </div>
    <div class="card-footer text-center">
      <button @click="updateItemAdmin(item)" class="btn btn-warning btn-sm me-3" data-bs-toggle="modal" data-bs-target="#editModal">Sửa</button>
      <button @click="deleteItem(item)" class="btn btn-secondary btn-sm">Xóa</button>
    </div>
  </div>
  <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-center" id="editModalLabel">Sửa thông tin</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleUpload(updateItem)">
            <div class="mb-3">
              <label for="edit-name" class="form-label">Tên sách : <em v-if="selectedItemOld">{{selectedItemOld.name}}</em></label>
              <input type="text" class="form-control" id="edit-name" v-model="updateItem.name">
            </div>
            <div class="mb-3">
              <label for="address" class="form-label">Địa chỉ : <em v-if="selectedItemOld">{{selectedItemOld.ward.name}}, {{selectedItemOld.district.name}}, {{selectedItemOld.province.name}}</em> </label>
              <div id="address">
                <select id="province" name="province" class="form-select mb-3" v-model="updateItem.province" @change="updateCityId">
                  <option value="" disabled selected>Chọn tỉnh thành</option>
                  <option v-for="(city, index) in cities" :value="{code: city.id, name:city.name}" :key="index" :data-id="city.id">{{ city.name }}</option>
                </select>
                <select id="district" name="district" class="form-select mb-3" v-model="updateItem.district" @change="updateDistrictId">
                  <option value="" disabled selected>Chọn quận huyện</option>
                  <option v-for="(district, index) in districts" :value="{code: district.id, name:district.name}" :key="index" :data-id="district.id">{{ district.name }}</option>
                </select>
                <select id="ward" name="ward" class="form-select mb-3" v-model="updateItem.ward">
                  <option value="" disabled selected>Chọn phường xã</option>
                  <option v-for="(ward, index) in wards" :value="{code: ward.id, name:ward.name}" :key="index">{{ ward.name }}</option>
                </select>
              </div>
            </div>
            <button type="submit" class="btn btn-primary">Cập nhật</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import {onMounted, ref} from "vue";
import PublishingService from "@/services/publishing.service.js";
const apiClient = axios.create({
  baseURL: 'https://vnprovinces.pythonanywhere.com/api/',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});
export default {
  name: "PublishingDetail",
  props:['item','index'],
  setup(props){
    const selectedItemOld = ref()
    onMounted( async ()=>{
      const response = await PublishingService.getOne(props.item.id)
      selectedItemOld.value = response.data
    })
    return{
      selectedItemOld
    }
  },
  data(){
    return{
      publishing: '',
      updateItem: {name: '', province: '', district: '', ward:''},
      cities: [], districts: [], wards:[],
      selectedCity: '', selectedDistrict: '', selectedWard: '',
      selectedCityId:'', selectedDistrictId: '', selectedWardId: '',
    }
  },
  methods: {
    updateItemAdmin(item){
      this.updateItem = item;
    },
    async deleteItem(item) {
      this.$emit('delete-item', item);
    },
    updateCityId(event) {
      const selectedOption = event.target.options[event.target.selectedIndex];
      this.selectedCityId = selectedOption.getAttribute('data-id');
      this.getDistricts();
    },
    updateDistrictId(event) {
      const selectedOption = event.target.options[event.target.selectedIndex];
      this.selectedDistrictId = selectedOption.getAttribute('data-id');
      this.getWards();
    },
    getProvinces() {
      apiClient.get('provinces/?basic=true&limit=100').then(response => {
        this.cities = response.data.results;
      });
    },
    getDistricts() {
      return apiClient.get(`provinces/${this.selectedCityId}`).then(response => {
        this.districts = response.data.districts;
        const currentDistrict = this.districts.find(district => district.id === this.selectedDistrictId);
        if (currentDistrict) {
          this.selectedDistrict = currentDistrict.name;
        }
      });
    },
    getWards() {
      return apiClient.get(`/districts/${this.selectedDistrictId}`).then(response => {
        this.wards = response.data.wards;
        const currentWard = this.wards.find(ward => ward.id === this.selectedWardId);
        if (currentWard) {
          this.selectedWard = currentWard.name;
        }
      });
    },
    async handleUpload(data){
      try {
        const response = await PublishingService.updateOne(data.id, data)
      }catch (e) {
        console.log(e.message);
      }
    }
  },
  created() {
    this.getProvinces();
  }
}
</script>