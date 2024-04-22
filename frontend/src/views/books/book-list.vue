<template>
  <div class="row">
    <div class=" col-8">
      <div class="card-body">
        <div class="list-group" v-for="(item, index) in books" :key="index" @click="selectItem(item)">
          <BookItem :item="item" :index="index" />
        </div>
      </div>
    </div>
    <div class="col-4" v-if="selectedItem">
      <BookDetail :item="selectedItem" :index="selectedIndex" @update-item="updateItem" @delete-item="deleteItem"/>
    </div>
  </div>
</template>
<script>
import { onMounted, ref } from 'vue';
import BookItem from "@/components/BookItem.vue";
import BookDetail from "@/components/BookDetail.vue";
import BookService from "@/services/book.service.js";

export default {
  name: "book-list",
  mounted() {
    document.title = 'Sách'
  },
  components:{
    BookItem,
    BookDetail
  },
  setup() {
    const books = ref([]);
    const selectedItem = ref(null);
    const selectedIndex = ref(null);
    onMounted( async () => {
      const response = await BookService.getAllBooks();
      books.value = response.data;
    });
    const selectItem = (item, index) => {
      selectedItem.value = item;
      selectedIndex.value = index;
    };
    return {
      books,
      selectedItem,
      selectedIndex,
      selectItem
    }
  },
  methods: {
    updateItem(updatedItem) {
      let index = this.books.findIndex(item => item.id === updatedItem.id);
      if (index !== -1) {
        this.books.splice(index, 1, updatedItem);
      }
    },
    async deleteItem(item) {
      let index = this.books.indexOf(item);
      if (index > -1) {
        this.books.splice(index, 1);
      }
      this.selectedItem = null;

      await BookService.deleteOneBook(item.id)
    },
  }
}
</script>