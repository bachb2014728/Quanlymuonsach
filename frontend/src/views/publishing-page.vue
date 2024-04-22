<template>
  <div class="row">
    <div class="col-sm-4">
      <AddPublishing @create-item ="addItem" />
    </div>
    <div class="col-sm-4">
      <div class="card-body">
        <div class="list-group" v-for="(item, index) in publishing" :key="index" @click="selectItem(item)">
          <a href="#" class="list-group-item list-group-item-action" aria-current="true">
            <div class="d-flex w-100 justify-content-between">
              <p class="mb-1">Mã NXB : <span>{{item.id}}</span></p>
            </div>
            <span class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">{{item.name}}</h5>
            </span>
          </a>
        </div>
      </div>
    </div>
    <div class="col-4" v-if="selectedItem">
      <PublishingDetail :item="selectedItem" @delete-item="deleteItem" />
    </div>
  </div>
</template>
<script>
import PublishingService from "@/services/publishing.service.js";
import AddPublishing from "@/components/AddPublishing.vue";
import PublishingDetail from "@/components/PublishingDetail.vue";
import BookService from "@/services/book.service.js";

export default {
  name: "publishing-page",
  components: {
    AddPublishing,
    PublishingDetail,
  },
  data() {
    return {
      publishing: [],
      selectedItem: null
    }
  },
  async created() {
    const response = await PublishingService.getAll();
    this.publishing = response.data;
  },
  methods: {
    async deleteItem(item) {
      let index = this.publishing.indexOf(item);
      if (index > -1) {
        this.publishing.splice(index, 1);
      }
      this.selectedItem = null;
      await PublishingService.deleteOne(item.id);
    },
    async addItem(item) {
      this.publishing.push(item);
    },
    async selectItem(item) {
      this.selectedItem = item;
    }
  }
}
</script>

