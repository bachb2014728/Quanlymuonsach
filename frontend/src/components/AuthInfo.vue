
<template>
  <div class="col-sm-4">
    <h5 class="mb-3 text-center">Thông tin</h5>
    <ul class="list-group mb-3" v-if="item">
      <li class="list-group-item d-flex justify-content-between lh-sm">
        <div>
          <h6 class="my-0">Họ tên</h6>
        </div>
        <span class="text-body-secondary">{{item.account.name}}</span>
      </li>
      <li class="list-group-item d-flex justify-content-between lh-sm">
        <div>
          <h6 class="my-0">Số điện thoại:</h6>
        </div>
        <span class="text-body-secondary">{{item.account.phone}}</span>
      </li>
      <li class="list-group-item d-flex justify-content-between lh-sm">
        <div>
          <h6 class="my-0">Địa chỉ :</h6>
        </div>
        <span class="text-body-secondary">
          {{item.ward.name}}, {{item.district.name}}, {{item.province.name}}
        </span>
      </li>
      <li class="list-group-item d-flex justify-content-between lh-sm" v-if="item.role === 'USER'">
        <div>
          <h6 class="my-0">Giớ tính: </h6>
        </div>
        <span class="text-body-secondary">{{item.account.gender}}</span>
      </li>
      <li class="list-group-item d-flex justify-content-between lh-sm" v-if="item.role === 'USER'">
        <div>
          <h6 class="my-0">Ngày sinh: </h6>
        </div>
        <span class="text-body-secondary">{{new Date(item.account.date)}}</span>
      </li>
      <li class="list-group-item d-flex justify-content-between lh-sm">
        <div>
          <h6 class="my-0">Username: </h6>
        </div>
        <span class="text-body-secondary">{{item.account.user.username}}</span>
      </li>
      <li class="list-group-item d-flex justify-content-between lh-sm">
        <div>
          <h6 class="my-0">Mã định danh: </h6>
        </div>
        <span class="text-body-secondary">{{item.account.code}}</span>
      </li>
      <li class="list-group-item d-flex justify-content-between lh-sm">
        <div>
          <h6 class="my-0">Vai trò: </h6>
        </div>
        <span class="text-body-secondary">{{item.role}}</span>
      </li>
      <li class="list-group-item d-flex justify-content-between lh-sm">
        <div>
          <h6 class="my-0">Ngày tạo tài khoản: </h6>
        </div>
        <span class="text-body-secondary">{{new Date(item.account.createdAt)}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "AuthInfo",
  props:['item'],
  methods:{
    updateProfile() {
      this.$emit('update', this.item);
    }
  }
}
</script>