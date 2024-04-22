<template>
  <div  class="container">
    <Nav/>
    <router-view/>
  </div>

</template>
<script>
import Nav from "@/components/NavbarComponent.vue";
export default {
  components: {Nav}
}
</script>