<template>
	<view class="menus">
		<view class="menu" v-for="(menu,index) in categories" :key="index" @tap="menuTap(index)">
			<image :src="menu.icon.url" mode="aspectFit"></image>
			<label>{{menu.name}}</label>
		</view>
		<view class="menu" v-if="total > 9" @tap="menuTap(-1)">
			<image src="/static/icons/all.png" mode="aspectFit"></image>
			<label>查看全部</label>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			categories: {
				type: Array,
				default: function() {
					return []
				}
			},
			total: {
				type: Number,
				default: function(){
					return 0
				}
			}
		},
		methods:{
			menuTap(index){
				this.$emit('menuTap',index)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.menus {
		margin-left: 20upx;
		margin-right: 20upx;
		// width: 100%;
		padding: 40upx 0upx 10upx;
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		flex-wrap: wrap;

		.menu {
			width: 20%;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: center;
			margin-bottom: 30rpx;

			image {
				width: 80rpx;
				height: 80rpx;
			}

			label {
				width: 120rpx;
				margin-top: 10px;
				text-align: center;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				@include font-size(26);
			}
		}
	}
</style>
