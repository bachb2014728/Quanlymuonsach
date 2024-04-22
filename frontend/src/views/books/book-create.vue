<template>
  <div v-if="resultMessage" :class="resultMessage.type">
    <div class="alert alert-success" role="alert">{{ getResultMessageText() }}</div>
  </div>
  <div class="row">
    <div class="col-sm">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title mb-3 text-center">Thông tin sách mới</h5>
          <form class="row g-3"  enctype="multipart/form-data" @submit.prevent="handleUpload">
            <div class="">
              <label for="name" class="form-label">Tên sách</label>
              <input type="text" class="form-control"
                     :class="{ 'is-invalid': errors.name, 'is-valid': newItem.name && !errors.name }" id="name" name="name" v-model="newItem.name">
              <div class="text-danger">{{ errors.name }}</div>
            </div>
            <div class="d-flex justify-content-between">
              <div class="flex-grow-1 me-3">
                <label for="image" class="form-label">Hình ảnh</label>
                <input type="file" id="image" name="photos"  class="form-control" @change="onFileChange"  multiple>
              </div>
              <div class="flex-grow-1">
                <label for="year" class="form-label">Năm phát hành</label>
                <input type="text" class="form-control"
                       :class="{ 'is-invalid': errors.year, 'is-valid': newItem.year && !errors.year }" id="name" name="name" v-model="newItem.year">
                <div class="text-danger">{{ errors.year }}</div>
              </div>
            </div>
            <div class="d-flex justify-content-between">
              <div class="flex-grow-1 me-3">
                <label for="weight" class="form-label">Số lượng</label>
                <input type="number" class="form-control"
                       :class="{ 'is-invalid': errors.quantity, 'is-valid': newItem.quantity }" id="weight" name="weight" v-model="newItem.quantity">
                <div class="text-danger">{{ errors.weight }}</div>
              </div>
              <div class="flex-grow-1">
                <label for="price" class="form-label">Giá trị</label>
                <input type="number" class="form-control"
                       :class="{ 'is-invalid': errors.price, 'is-valid': newItem.price }" id="price" name="price" v-model="newItem.price">
                <div class="text-danger">{{ errors.price }}</div>
              </div>
            </div>
            <div class="">
              <select id="author" name="author" class="form-select" v-model="newItem.author">
                <option value="" disabled selected>Chọn tác giả</option>
                <option v-for="(item, index) in authors" :value="item._id" :key="index">{{ item.name }}</option>
              </select>
            </div>
            <div class="">
              <select id="publishing" name="publishing" class="form-select" v-model="newItem.publishing">
                <option value="" disabled selected>Chọn nhà xuất bản</option>
                <option v-for="(item, index) in publishing" :value="item.id" :key="index">{{ item.name }}</option>
              </select>
            </div>
            <div class="d-flex justify-content-center">
              <button type="submit" class="btn btn-primary btn-sm me-3" >Thêm sách</button>
              <button class="btn btn-sm btn-secondary me-3" @change="onChangeAuthor">Tải dữ liệu</button>
              <router-link to="/publishing/create" class="btn btn-sm btn-success">Thêm NXB</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="col-sm">
      <AuthorComponent />
    </div>
  </div>
</template>
<script>
import axios from "axios";
import AuthorComponent from "@/components/AuthorComponent.vue";
import {onMounted, ref} from "vue";
import AuthorService from "@/services/author.service.js";
import PublishingService from "@/services/publishing.service.js";
import BookService from "@/services/book.service.js";
export default {
  name: "book-create",
  mounted(){
    document.title = 'Thêm sách'
  },
  components:{
    AuthorComponent
  },
  setup(){
    const authors = ref([]);
    const publishing = ref([]);
    onMounted( async () => {
      const response = await AuthorService.getAllAuthors();
      authors.value = response.data;
      const responsePublishing = await PublishingService.getAll();
      publishing.value = responsePublishing.data;
    });
    return {
      authors,
      publishing
    }
  },
  data() {
    return {
      selectedFile: '', resultMessage: '', images: [], uploadImage: [],
      newItem: {
        name: '', images: '', price: '',year: '' , publishing: '', author:'', quantity:''
      },
      errors:{},
    }
  },
  methods: {
    onFileChange(event) {
      const files = event.target.files;
      if (files) {
        this.selectedFiles = Array.from(files);
      }
    },
    onChangeAuthor(){
      this.fetchAuthors()
    },
    async handleUpload() {
      this.errors = {};
      if (!this.newItem.name) {
        this.errors.name = 'Tên hàng hóa không được để trống';
      }
      if (!this.newItem.price) {
        this.errors.price = 'Giá trị không được để trống';
      }
      if (!this.newItem.quantity) {
        this.errors.price = 'Số lượng không được để trống';
      }
      if (!this.newItem.year) {
        this.errors.price = 'Năm phát hành không được để trống';
      }
      console.log(this.errors);
      if (Object.keys(this.errors).length > 0) {
        return;
      }
      try {
        const token = localStorage.getItem('token');
        for (const file of this.selectedFiles) {
          const index = this.selectedFiles.indexOf(file);
          let formData = new FormData();
          formData.append("image", file);
          let response = await axios.post('http://localhost:3000/api/v1/images', formData, {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          });
          if (response.status === 200) {
            console.log(response.data)
            this.uploadImage[index] = response.data._id;
          } else {
            this.resultMessage = { type: 'error', message: response.data.message };
            this.clearMessageAfterDelay();
          }
        }
        this.newItem.images=(this.uploadImage);
        await this.createItem();
      } catch (error) {
        console.error('Lỗi không tải được ảnh:', error.message);
        this.resultMessage = { type: 'error', message: error.message };
        this.clearMessageAfterDelay();
      }
    },
    async fetchAuthors() {
      const response = await AuthorService.getAllAuthors();
      this.authors = response.data;
    },
    async createItem() {
      console.log(this.newItem);
      const response = await BookService.createOneBook(this.newItem)

      if (response.status === 200) {
        console.log(response);
        this.resultMessage = { type: 'success', message: 'Thêm hàng hóa thành công' };
        this.getResultMessageText();
      } else {
        this.resultMessage = { type: 'error', message: 'Error' };
      }
      this.clearMessageAfterDelay();
    },
    clearMessageAfterDelay() {
      setTimeout(() => (this.resultMessage = null), 5000);
    },
    getResultMessageText() {
      return this.resultMessage.type === 'success'
          ? 'Success: ' + this.resultMessage.message
          : 'Error: ' + this.resultMessage.message;
    },
  }
}
</script>
<style scoped>
.is-invalid {
  border-color: #dc3545;
  padding-right: calc(1.5em + 0.75rem);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.is-valid {
  border-color: #28a745;
  padding-right: calc(1.5em + 0.75rem);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}
</style>