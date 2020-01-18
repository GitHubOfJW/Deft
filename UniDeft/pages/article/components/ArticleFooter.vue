<template>
	<view class="article_footer">
		<view class="item">
			<label>👍</label>
			<label>({{article.support_count}})</label>
		</view>
		<view class="item">
			<label>👎</label>
			<label>({{article.unsupport_count}})</label>
		</view>
		<view class="item">
			<label>💗</label>
			<label>({{article.collect_count}})</label>
		</view>
		<view class="item">
			<label>分享</label>
			<label>({{article.share_count}})</label>
		</view>
	</view>
</template>

<script>
	import moment from 'moment'
	export default {
		props: {
			article: {
				type: Object,
				default: function() {
					return {}
				}
			}
		},
		computed: {
			time() {
				if (this.article.publish_time) {
					return moment.utc(this.article.publish_time).format('YYYY/MM/DD')
				}
				return ''
			}
		}
	}
</script>

<style lang="scss" scoped>
	.article_footer {
		background-color: #FFFFFF;
		width: 100%;
		height: 80rpx;
		box-shadow: 0px -5px 5px #F1F1F1;
		position: fixed;
		bottom: 0rpx;
		left: 0rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.item {
			flex:1;
			display: flex;
			justify-content: center;
			align-items: center;
			@include font-size(25);
			color: #888888;
			text-overflow: ellipsis;
			overflow: hidden;
		}
	}
</style>
