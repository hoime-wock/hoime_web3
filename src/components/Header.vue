<template>
  <el-header>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false" @select="handleSelect">
      <el-menu-item>
        <img style="width: 130px" src="../assets/logos.png" alt="Element logo" />
      </el-menu-item>
      <div class="flex-grow" />
<!--      <el-menu-item>-->
<!--        <w3m-network-button />-->
<!--      </el-menu-item>-->
      <el-menu-item>
        <w3m-button />
      </el-menu-item>
    </el-menu>
  </el-header>
</template>

<script>

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Header",
  components: {
  },
  mounted() {
  },
  data(){
    return {
      initWalletSuccess: false
    }
  },
  methods: {
    test(){
    }
  }
}
</script>


<style scoped>
.flex-grow {
  flex-grow: 1;
}
</style>