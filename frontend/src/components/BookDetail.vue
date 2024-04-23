<template>
  <div class="card">
    <h5 class="card-title text-center mt-3">{{item.name}}</h5>
    <p class="text-center">Mã sách : <span>{{item.id}}</span></p>
    <div class="card-body">
      <div class="image-container mb-3">
        <div v-for="(image, index) in item.images" :key="index">
          <img :src="'data:image/jpeg;base64,' + image" alt="" style="height: 5rem">
        </div>
      </div>
      <p class="card-text">Giá trị : {{item.price}}</p>
      <p class="card-text">Số lượng : {{item.quantity}}</p>
      <p class="card-text">Năm phát hành : {{item.year}}</p>
      <p class="card-text">Tên tác giả :
        <span v-if="item.author.name">
            {{item.author.name}}
          </span>
      </p>
      <p class="card-text">Tên nhà xuất bản :
        <span v-if="item.publishing.name">{{item.publishing.name}}</span>
      </p>
      <p class="card-text">Yêu thích : {{item.favorites.length}}</p>
    </div>
    <div class="card-footer text-center" v-if="auth && role ==='ADMIN'">
      <button @click="updateItemAdmin(item)" class="btn btn-warning btn-sm me-3" data-bs-toggle="modal" data-bs-target="#editModal">Sửa</button>
      <button  @click="deleteItem(item)" class="btn btn-secondary btn-sm me-3">Xóa</button>
      <button @click="addToCart(item)" class="btn btn-info btn-sm text-light">Mượn xíu</button>
    </div>
  </div>
  <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editModalLabel">Sửa thông tin sách</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleUpload(updateItem)">
            <div class="mb-3">
              <label for="edit-name" class="form-label">Tên sách : <em>{{updateItem.name}}</em></label>
              <input type="text" class="form-control" id="edit-name" v-model="updateItem.name">
            </div>
            <div class="d-flex justify-content-between mb-3">
              <div class="flex-grow-1 me-3">
                <label for="image" class="form-label">Hình ảnh</label>
                <input type="file" id="image" name="photos"  class="form-control" @change="onFileChange"  multiple >
              </div>
              <div class="flex-grow-1">
                <label for="year" class="form-label">Năm phát hành : <em>{{updateItem.year}}</em></label>
                <input type="text" class="form-control" id="name" name="name" v-model="updateItem.year">
              </div>
            </div>
            <div class="row">
              <div class="col-sm mb-3">
                <label for="edit-code" class="form-label">Số lượng : <em>{{updateItem.quantity}}</em></label>
                <input type="text" class="form-control" id="edit-code" v-model="updateItem.quantity">
              </div>
              <div class="col-sm mb-3">
                <label for="edit-code" class="form-label">Giá trị : <em>{{updateItem.price}}</em></label>
                <input type="text" class="form-control" id="edit-code" v-model="updateItem.price">
              </div>
            </div>
            <div class="mb-3">
              <label for="author" class="form-label">Tác giả : <em>{{updateItem.author['name']}}</em></label>
              <select id="author" name="author" class="form-select" v-model="updateItem.author">
                <option value="" disabled selected>Chọn tác giả</option>
                <option v-for="(item, index) in authors" :value="item" :key="index" >{{ item.name }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="author" class="form-label">Nhà xuất bản : <em>{{updateItem.publishing['name']}}</em></label>
              <select id="publishing" name="publishing" class="form-select" v-model="updateItem.publishing">
                <option value="" disabled selected>Chọn nhà xuất bản</option>
                <option v-for="(item, index) in publishingList" :value="item" :key="index">{{ item.name }}</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary">Cập nhật</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AuthorService from "@/services/author.service.js";
import {computed, onMounted, ref} from "vue";
import PublishingService from "@/services/publishing.service.js";
import axios from "axios";
import BookService from "@/services/book.service.js";
import {useStore} from "vuex";

export default {
  name: "MerchandiseDetail",
  props:['item','index'],
  setup(){
    const authors = ref([]);
    const publishingList = ref([]);
    const selectedFiles = ref([]);
    const store = useStore();
    const auth = computed(() => store.state.auth);
    const role = computed(()=> store.state.role);
    const addToCart = (item) => {
      store.dispatch('addToCart', item);
    };
    onMounted( async () => {

      const response = await AuthorService.getAllAuthors();
      authors.value = response.data;
      const responsePublishing = await PublishingService.getAll();
      publishingList.value = responsePublishing.data;
    });
    return {
      auth,
      role,
      addToCart,
      selectedFiles,
      authors,
      publishingList
    }
  },
  data() {
    return {
      selectedFile: '',
      resultMessage: '',
      images: [],
      uploadImage: [],
      updateItem: {name: '', price: '', quantity: '', year:'', author:'', publishing: '', images: ''},
    }
  },
  methods: {
    onFileChange(event) {
      const files = event.target.files;
      if (files) {
        this.selectedFiles = Array.from(files);
      }
    },
    async deleteItem(item) {
      this.$emit('delete-item', item);
    },
    updateItemAdmin(item){
      this.updateItem = item;
    },
    async handleUpload(data) {
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
        this.updateItem.images = (this.uploadImage);
        await this.editItem(data);
      } catch (error) {
        console.error('Lỗi không tải được ảnh:', error.message);
        this.resultMessage = { type: 'error', message: error.message };
        this.clearMessageAfterDelay();
      }
    },
    async editItem(item) {
      try {
        console.log(item)
        const response = await BookService.updateOneBook(item.id , item)
        if (response.status === 200){
          let updatedData = response.data;
          this.$emit('update-item', { ...this.item, ...updatedData });
        }
      } catch (e) {
        console.log(e.message);
      }
    },
    clearMessageAfterDelay() {
      setTimeout(() => (this.resultMessage = null), 5000);
    },
    getResultMessageText() {
      return this.resultMessage.type === 'success'
          ? 'Success: ' + this.resultMessage.message
          : 'Error: ' + this.resultMessage.message;
    },
  },
}
</script>
<style scoped>
.image-container {
  display: flex;
  justify-content: start;
  gap: 10px;
}
</style>