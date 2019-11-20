<template>
	<view class="article">
		<image :src="article.pic.url"></image>
		<label>{{article.title}}</label>
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
		}
	}
</script>

<style lang="scss" scoped>
	.article {
		display: inline-block;
		width: 170rpx;
		padding: 10px 5px;
		background-color:#FFFFFF;
		border-radius: 5px;
		margin: 0px 5px;
		text-align: center;
		// box-shadow: 5px 5px 5px #f5f5f5,5px -5px 5px #f5f5f5,-5px 5px 5px #f5f5f5,-5px -5px 5px #f5f5f5;
		
		image {
			display: block;
			margin-left: 10rpx;
			width: 150rpx;
			height: 150rpx;
			border-radius: 3px;
		}
		
		label {
			margin-top:10px;
			display: block;
			width: 100%;
			@include  font-size(25);
			text-overflow: ellipsis;
			overflow: hidden;
		}
	}
</style>
