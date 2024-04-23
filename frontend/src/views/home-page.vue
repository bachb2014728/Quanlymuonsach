
<template>
  <div class="row">
    <div class="col-sm">
      <div class="input-group mb-3">
        <input type="search"
               v-model="inputData"
               @input="fetchData"
               class="form-control"
               aria-describedby="button-addon2"
               placeholder="Nhập mã hóa đơn" aria-label="Nhập mã hóa đơn" spellcheck="false" data-ms-editor="true"
        >
        <button class="btn btn-outline-secondary" type="button" id="button-addon2" @click="submitData">Tìm kiếm</button>
      </div>
    </div>
    <div class="col-sm">
      <div v-if="cardData" >
        <h4 class="text-center">Hóa đơn</h4>
        <ul>
          <li>Thông tin người mượn : {{cardData.info}}</li>
          <li>Danh sach cuốn sach : {{cardData.books}}</li>
          <li>Ngày mượn : {{cardData.startDate}}</li>
          <li>Hạn trả : {{cardData.endDate}}</li>
          <li>Trạng thái :
            <span v-if="cardData.status === 'awaiting'" class="badge text-bg-primary">chờ duyệt</span>
            <span v-if="cardData.status === 'progress' " class="badge text-bg-warning">đang mượn</span>
            <span v-if="cardData.status === 'success' " class="badge text-bg-success">đã trả</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import DetailService from "@/services/detail.service.js";
import moment from 'moment';
export default {
  name: "home-page",
  mounted() {
    document.title= 'Trang chủ'
  },
  data() {
    return {
      inputData: '',
      cardData: null,
    };
  },
  methods: {
    async fetchData() {
      if (!this.inputData) {
        this.cardData = null;
        return;
      }
      try {
        const response = await DetailService.getOne(this.inputData);

        this.cardData = {
          info: response.data.reader.code+', '+response.data.reader.name+', '+response.data.reader.phone,
          books : response.data.books.map(book => book.name),
          startDate:  moment(response.data.startDate).format('DD-MM-YYYY'),
          endDate: moment(response.data.endDate).format('DD-MM-YYYY'),
          status: response.data.status
        };
      } catch (error) {
        console.error(error);
      }
    },
    submitData() {
    },
  },
}
</script>