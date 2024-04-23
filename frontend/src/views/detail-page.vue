<template>
  <div class="row">
    <div class="col-sm-6">
      <table class="table table-bordered">
        <thead>
        <tr>
          <th scope="col">#</th>
          <th>Mã sách</th>
          <th scope="col">Tên</th>
          <th scope="col">Hình ảnh</th>
          <th scope="col">Thông tin</th>
          <th></th>
        </tr>
        </thead>
        <tbody class="mb-3">
        <tr v-for="(book, index) in cart" :key="index">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ book.id }}</td>
          <td>{{ book.name }}</td>
          <td><img :src="'data:image/jpeg;base64,' + book.images[0]" alt="" style="height: 4rem"></td>
          <td>Giá tiền: {{book.price}}, Số lượng: 1, Tên tác giả: {{book.author.name}}, Nhà xuất bản: {{book.publishing.name}}</td>
          <td> <button class="btn btn-sm btn-danger">Xóa</button></td>
        </tr>
        </tbody>

      </table>
    </div>
    <div class="col-sm-6">
      <div class="mb-3 d-flex justify-content-center">
        <select id="reader" v-model="reader" class="form-select" @change="updateInfo">
          <option value="" disabled selected>Chọn độc giả</option>
          <option v-for="user in users" :value="user" :key="user.id">{{ user.name }}</option>
        </select>
      </div>
      <form @submit.prevent="checkout(model)">
        <div class="row g-3 mb-3">
          <div class="col-sm-6">
            <label for="name" class="form-label">Tên độc giả</label>
            <input type="text" class="form-control" id="name"  v-model="model.info.name" required="">
          </div>

          <div class="col-sm-6">
            <label for="phone" class="form-label">Số điện thoại</label>
            <input type="text" class="form-control" id="phone" v-model="model.info.phone" required="">
          </div>

          <div class="col-sm-6">
            <label for="name" class="form-label">Mã định danh</label>
            <input type="text" class="form-control" id="code"  v-model="model.info.code" required="">
          </div>
          <div class="col-sm-6">
            <label for="startDate" class="form-label">Ngày mượn</label>
            <input type="date" id="startDate" v-model="model.startDate" class="form-control">
          </div>
          <div class="col-sm-6">
            <label for="endDate" class="form-label">Ngày trả</label>
            <input type="date" id="endDate" v-model="model.endDate" class="form-control">
          </div>
        </div>

        <button class="w-100 btn btn-primary btn-lg" type="submit">Cho mượn</button>
      </form>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import AuthService from "@/services/auth.service.js";
import DetailService from "@/services/detail.service.js";

export default {
  name: "detail-page",
  data() {
    return {
      reader: '',
      model: {info:{name: '', phone:'', code: ''}, startDate: null, endDate: null,},
      users: []
    };
  },
  computed: {
    ...mapState(['cart'])
  },
  async mounted() {
    this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    const response = await AuthService.getReaders();
    this.users = response.data;
    document.title = 'Hóa đơn';
  },
  methods: {
    updateInfo(event){
      this.model.info = {
        name: this.reader.name,
        phone: this.reader.phone,
        code: this.reader.code
      }
    },
    async checkout() {
      const payload = {
        info: this.model.info,
        carts: this.cart,
        startDate: this.model.startDate,
        endDate: this.model.endDate
      };
      try {
        payload['carts'] = this.cart.map(book => book.id);
        this.token = localStorage.getItem('token');
        const response = await DetailService.createOne(payload)
        if(response.status === 200){
          localStorage.removeItem('cart');
          this.cart = [];
          this.$store.commit('updateCart', this.cart);
          window.alert('Thêm hóa đơn thành công!');
        }
      } catch (error) {
        console.error( error);
      }
    }
  }
}
</script>