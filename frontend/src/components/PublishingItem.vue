<template>
  <a href="#" class="list-group-item list-group-item-action" aria-current="true">
    <div class="d-flex w-100 justify-content-between">
      <p class="mb-1">Mã NXB : <span>{{item.id}}</span></p>
    </div>
    <span class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">{{item.name}}</h5>
       <button @click="deleteItem(item.id)" class="btn btn-secondary btn-sm">Xóa</button>
    </span>
  </a>
</template>
<script>
import PublishingService from "@/services/publishing.service.js";

export default {
  name: "PublishingItem",
  props:['item','index'],
  methods: {
    async deleteItem(item) {
      console.log(item)
      await PublishingService.deleteOne(item)
    },
  }
}
</script>
