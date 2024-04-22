<template>
  <a href="#" class="list-group-item list-group-item-action" aria-current="true">
    <div class="d-flex w-100 justify-content-between">
      <p class="mb-1">Tên sách : <span>{{item.name}}</span></p>
      <small class="text-success" v-if="item.quantity > 0">Vẫn còn</small>
      <span class="text-danger" v-if="item.quantity === 0">Hết rồi</span>
    </div>
    <span class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">{{item.name}}</h5>
      <small>Số lượng : {{item.quantity}}</small>
    </span>
  </a>
</template>
<script>

export default {
  name: "MerchandiseItem",
  props:['item','index'],

}
</script>