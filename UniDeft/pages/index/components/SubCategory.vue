<template>
	<view class="menus">
		<view class="menu" v-for="(menu,index) in categories" :key="index">
			<image :src="menu.icon.url" mode="aspectFit"></image>
			<label>{{menu.name}}</label>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			categories: {
				type: Array,
				default: function(){
					return []
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.menus {
		margin-left: 20upx;
		margin-right: 20upx;
		// width: 100%;
		padding: 40upx 0upx;
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		
		.menu {
			width:20%;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: center;	
			
			image {
				width: 80rpx;
				height: 80rpx;
			}
			
			label {
				margin-top: 10px;
				text-align: center;
				@include  font-size(26);
			}
		}
	}
</style>
