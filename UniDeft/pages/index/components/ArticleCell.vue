<template>
	<view class="cell" @tap="articleTap">
		<view class="pic">
			<image :src="article.pic.url" mode="aspectFill"></image>
		</view>
		<view class="info">
			<label class="name">{{article.title}}</label>
			<label class="desc">{{article.title}}</label>
			<label class="other">阅读({{article.view_count}}) 作品({{article.works_count}}) 收藏({{article.collect_count}})</label>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			article: {
				type: Object,
				default: function(){
					return {}
				}
			}
		},
		methods: {
			articleTap(){
				uni.navigateTo({
					url: '/pages/article/article?article_id=' + this.article.id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cell {
		width: 100%;
		// height: 200rpx;
		margin-top: 60rpx;
		position: relative;
		
		.pic {
			position: absolute;
			width: 200rpx;
			height: 200rpx;
			top: -20rpx;
			left: 0px;
			image {
				width: 100%;
				height: 100%;
				border-radius: 3px;
			}
		}
		
		.info {
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-items: flex-start;
			padding: 10px;
			box-shadow: 5px 5px 5px #f5f5f5,5px -5px 5px #f5f5f5,-5px 5px 5px #f5f5f5,-5px -5px 5px #f5f5f5;
			border-radius: 5px;
			padding-top: 20rpx;
			margin-left: 20rpx;
			padding-left: 210rpx;
			height: 180rpx;
			
			.name {
				@include font-size(29);
			}
			
			.desc {
				@include font-size(27);
			}
			
			.other {
				@include font-size(25);
			}
			
		}
	}
</style>
