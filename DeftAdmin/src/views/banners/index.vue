<template>
  <div class="tab-container">
    <el-tabs v-model="active_key" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in platforms" :key="item.key" :label="item.name" :name="item.key">
        <banner :platform="item.id" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { platforms } from '@/api/meta'
import Banner from './banner'
export default {
  name: 'Banners',
  components: { Banner },
  data() {
    return {
      platforms: [],
      active_key: undefined
    }
  },
  created() {
    this.getPlatform()
  },
  methods: {
    getPlatform() {
      platforms().then(response => {
        if (response.code === 20000 && response.data.length > 0) {
          this.active_key = response.data[0].key
          console.log(this.active_key)
          this.platforms.splice(1, this.platforms.length, ...response.data)
          this.$forceUpdate()
        }
      })
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
