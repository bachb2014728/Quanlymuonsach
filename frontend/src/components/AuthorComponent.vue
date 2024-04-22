<template>
  <form class="mb-3 " @submit.prevent="handleCreate">
    <div class="row g-2 align-items-center">
      <div class="col-auto">
        <label for="author" class="col-form-label">Thông tin</label>
      </div>
      <div class="col-auto">
        <input type="text" id="author" class="form-control" aria-describedby="name-author" v-model="newItem.name"
               placeholder="Tên tác giả">
      </div>
      <div class="col-auto">
        <input type="text" id="code" class="form-control" aria-describedby="name-author" v-model="newItem.code"
               placeholder="Mã định danh">
      </div>
      <div class="col-auto">
        <button type="submit" class="btn btn-sm btn-primary">Thêm tác giả</button>
      </div>
    </div>
  </form>
  <table class="table table-bordered">
    <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Họ tên tác giả</th>
      <th scope="col">Mã tác giả</th>
      <th scope="col">Số sách</th>
      <th scope="col"></th>
    </tr>
    </thead>
    <tbody>
    <tr v-if="authors" v-for="(item, index) in authors" :key="index">
      <th scope="row">{{index+1}}</th>
      <td>{{item.name}}</td>
      <td>{{item.code}}</td>
      <td>{{item.books.length}}</td>
      <td class="text-center">
        <div class="btn-group" role="group">
          <button @click="updateItemAdmin(item)" class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#editModal">Sửa</button>
          <button @click="deleteItem(item)" class="btn btn-secondary btn-sm">Xóa</button>
        </div>
      </td>
    </tr>
    </tbody>
  </table>
  <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editModalLabel">Sửa thông tin tác giả</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="editItem(updateItem)">
            <div class="mb-3">
              <label for="edit-name" class="form-label">Tên tác giả</label>
              <input type="text" class="form-control" id="edit-name" v-model="updateItem.name">
            </div>
            <div class="mb-3">
              <label for="edit-code" class="form-label">Mã định danh</label>
              <input type="text" class="form-control" id="edit-code" v-model="updateItem.code">
            </div>
            <button type="submit" class="btn btn-primary">Cập nhật</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {onMounted, ref} from "vue";
import AuthorService from "@/services/author.service.js";

export default {
  name: "AuthorComponent",
  setup() {
    const authors = ref([]);
    onMounted( async () => {
      const response = await AuthorService.getAllAuthors();
      console.log(response)
      authors.value = response.data;
    });
    return {
      authors,
    }
  },
  data() {
    return {
      newItem: {
        name: '', code: ''
      },
      updateItem: {
        name: '',
        code: ''
      },
    }
  },
  methods: {
    updateItemAdmin(item){
      this.updateItem = item;
    },
    async handleCreate(){
      try {
        await AuthorService.createOneAuthor(this.newItem)
        const response = await AuthorService.getAllAuthors();
        this.authors = response.data;
      }catch (e) {
        console.log(e.message)
      }
    },
    async editItem(item) {
      try {
        console.log(item['_id'])
        await AuthorService.updateOneAuthor(item['_id'], item);
        const response = await AuthorService.getAllAuthors();
        this.authors = response.data;
      } catch (e) {
        console.log(e.message);
      }
    },
    async deleteItem(item) {
      let index = this.authors.indexOf(item);
      if (index > -1) {
        this.authors.splice(index, 1);
      }
      await AuthorService.deleteOneAuthor(item['_id'])
    },
  }
}
</script>
<style scoped>

</style>