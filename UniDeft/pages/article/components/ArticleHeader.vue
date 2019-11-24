<template>
	<view class="article_header">
		<!-- 标题 -->
		<view class="title">{{article.title}}</view>
		<view class="info"><label>作者：夏季</label><label>分类：{{cate_name}}</label><label>阅读：{{article.view_count}}</label><label>{{time}}</label></view>
	</view>
</template>

<script>
	import moment from  'moment'
	export default {
		props:{
			article: {
				type: Object,
				default: function(){
					return {}
				}
			}
		},
		computed: {
			time(){
				console.log(this.article)
				if(this.article.publish_time){
					return moment.utc(this.article.publish_time).format('YYYY/MM/DD')
				}
				return ''
			},
			cate_name(){
				if(this.article.articlecates && this.article.articlecates.length){
					return this.article.articlecates[0].name
				}else{
					return '未知'
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.article_header {
		width: 100%;
		
		.title {
			height: 40rpx;
			@include  font-size(30);
			color:#333;
			font-weight: bold;
		}
		
		.info {
			height: 40rpx;
			margin-top: 15rpx;
			@include font-size(27);
			color: #888888;
			
			label {
				display: inline-block;
				max-width: 30%;
				margin-right: 20rpx;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
			}
		}
	}
</style>
