<template>
  <div class="row">
    <AuthInfo :item="profile" @update="updateProfile"/>
    <AuthUpdate :item="profile" @update="updateProfile"/>
  </div>
</template>
<script>
import AuthInfo from "@/components/AuthInfo.vue";
import AuthUpdate from "@/components/AuthUpdate.vue";
import AuthService from "@/services/auth.service.js";

export default {
  name: "auth-page",
  components: {AuthUpdate, AuthInfo},
  async mounted() {
    document.title='Thông tin cá nhân'
    const response = await AuthService.profile();
    this.profile = response.data
  },
  data() {
    return {
      profile: ''
    }
  },
  methods: {
    updateProfile(updatedProfile) {
      this.profile = updatedProfile;
    }
  },
}
</script>
