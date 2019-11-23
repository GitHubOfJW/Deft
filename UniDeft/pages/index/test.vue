<template>
	<view>
		<auto-menu :menus="menus"></auto-menu>
	</view>
</template>

<script>
	import AutoMenu from '@/components/common/AutoMenu.vue'
	export default {
		components:{
			AutoMenu: AutoMenu
		},
		data(){
			return {
				menus: ['菜单','菜单','菜单','菜单','菜单','菜单','菜单','菜单','菜单','菜单','菜单','菜单']
			}
		}
	}
</script>

<style>
</style>
