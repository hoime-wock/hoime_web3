<template>
  <el-aside>
    <el-menu default-active="0" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" style="height: 100%">
      <el-menu-item index="2">
        <el-icon><icon-menu /></el-icon>
        <span>Token Launch Pad</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Sidebar",
  components: {

  }
}
</script>

<style scoped>

</style>