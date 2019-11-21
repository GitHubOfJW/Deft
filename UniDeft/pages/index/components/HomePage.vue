<template>
	<view class="content_page">
		<!-- 列表 -->
		<mescroll-uni :up="upOptions" :down="downOptions" @down="downCallback" @up="upCallback" @init="initMescrolls">
			<view class="center_content">
				<block v-for="(flexItem,index) of flexDatas" :key="index">
					<!-- swiper -->
					<swiper class="home_swiper" v-if="flexItem.type == 'banner'" :indicator-dots="true">
						<swiper-item class="home_swiper-item" v-for="(banner) in flexItem.data" :key="banner.id">
							<image :src="banner.banner.url" mode="aspectFill"></image>
						</swiper-item>
					</swiper>
					<!-- 最新上线 -->
					<panel v-if="flexItem.type == 'panel'" :title="flexItem.title" :pLeft="0" :pRight="0">
						<scroll-view class="home_pannel" :scroll-x="true">
							<block v-for="article in flexItem.data" :key="article.id">
								<article-item :article="article"></article-item>
							</block>
						</scroll-view>
					</panel>
				</block>
			</view>
			<view class="list">
				<!-- 下面是下一页 -->
				<block v-for="article in articles" :key="article.id">
					<article-cell :article="article"></article-cell>
				</block>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import MescrollUni from 'mescroll-uni'
	import Panel from '@/components/common/Panel.vue'
	import ArticleItem from './ArticleItem.vue'
	import ArticleCell from './ArticleCell.vue'

	export default {
		components: {
			MescrollUni: MescrollUni,
			Panel: Panel,
			ArticleItem: ArticleItem,
			ArticleCell: ArticleCell
		},
		props: {
			pageIndex: {
				type:Number,
				default:function(){
					return 0
				}
			},
			// 类别id
			cateId: {
				type: Number,
				default: function() {
					return 0
				}
			}
		},
		data() {
			return {
				menus: [],
				flexDatas: [],
				mescrolls: [],
				downOptions: {
					auto: false
				},
				upOptions: {
					auto: false,
					textNoMore: '无更多数据'
				},
				articles: []
			}
		},
		methods: {
			// 初始化mescroll
			initMescrolls(mescroll) {
				this.$emit('init', {
					mescroll,
					pageIndex:this.pageIndex
				})
			},
			// 下拉刷新
			downCallback(mescroll) {
				console.log(this.cateId)
				this.$uRequest.get({
					url: '/mini/home/index',
					data: {
						cate_id: this.cateId
					},
					success: (res) => {
						if (res.code === 0) {
							this.flexDatas.splice(0, this.flexDatas.length, ...res.data)
							mescroll.endSuccess(this.flexDatas.length, true)
							// 触发上拉动
							mescroll.triggerUpScroll()
						} else {
							mescroll.endErr()
						}
					},
					fail: (err) => {
						console.log(JSON.stringify(err))
						mescroll.endErr()
					}
				})
			},
			// 上拉刷新
			upCallback(mescroll) {
				console.log('加载更多', mescroll.num)
				this.$uRequest.get({
					url: '/mini/home/articles',
					data: {
						cate_id: this.cateId
					},
					success: (res) => {
						if (res.code === 0) {
							this.articles.splice(this.articles.length, 0, ...res.data.items)
							mescroll.endBySize(res.data.items.length, res.data.total)
						} else {
							mescroll.endErr()
						}
					},
					fail: (err) => {
						console.log(JSON.stringify(err))
						mescroll.endErr()
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content_page {
		width: 100%;
		display: flex;
		flex-direction: column;

		.center_content {
			display: flex;
			flex-direction: column;
			flex: 1;

			// swiper 轮播
			.home_swiper {
				margin-top: 30rpx;
				margin-left: 20rpx;
				margin-right: 20rpx;
				height: 300rpx;
				width: 710rpx;
				border-radius: 10rpx;
				overflow: hidden;

				.home_swiper-item {
					width: 100%;
					height: 100%;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}

			//  最新
			.home_pannel {
				white-space: nowrap;
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				flex-wrap: nowrap;
				width: 100%;
				padding: 20rpx 0rpx;
				background-color: #fbfbfb;
			}

			
		}
		// 列表
		.list {
			padding: 20rpx 30rpx;
		}
	}
</style>
