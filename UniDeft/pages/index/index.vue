<template>
	<view class="content">
		<!-- 顶部滚动条 -->
		<auto-menu :menus="cateMenus"></auto-menu>
		<mescroll-uni class="contents" top="80" :up="upOptions" :down="downOptions" @down="downCallback" @up="upCallback">
			<block v-for="(flexItem,index) of flexDatas" :key="index">
				<!-- swiper -->
				<swiper class="swiper" v-if="flexItem.type == 'banner'" :indicator-dots="true">
					<swiper-item class="swiper-item" v-for="(banner) in flexItem.data" :key="banner.id">
						<image :src="banner.banner.url" mode="aspectFill"></image>
					</swiper-item>
				</swiper>
				<!-- 最新上线 -->
				<panel v-if="flexItem.type == 'latest'" :title="flexItem.title" :pLeft="0" :pRight="0">
					<scroll-view class="latest" :scroll-x="true">
						<block v-for="article in flexItem.data" :key="article.id">
							<article-item :article="article"></article-item>
						</block>
					</scroll-view>
				</panel>
			</block>
			<!-- 下面是下一页 -->
		</mescroll-uni>
	</view>
</template>

<script>
	import MescrollUni  from 'mescroll-uni'
	import AutoMenu from '@/components/common/AutoMenu.vue'
	import Panel from '@/components/common/Panel.vue'
	import ArticleItem from './components/ArticleItem.vue'
	export default {
		components: {
			AutoMenu: AutoMenu,
			MescrollUni: MescrollUni,
			Panel: Panel,
			ArticleItem: ArticleItem
		},
		data() {
			return {
				menus: [],
				flexDatas: [],
				downOptions: {
					auto:true
				},
				upOptions: {
					auto: false
				}
			}
		},
		onLoad() {
			// 获取菜单
			this.getMenus()
		},
		computed:{
			cateMenus(){
				return this.menus.map(cate => cate.name)
			}
		},
		methods: {
			// 下拉刷新
			downCallback(mescroll){
				this.$uRequest.get({
					url: '/mini/home/index',
					success: (res) => {
						if(res.code === 0){
							this.flexDatas.splice(0,this.flexDatas.length,...res.data)
							mescroll.endSuccess(this.flexDatas.length,true)
						}else{
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
			upCallback(mescroll){
			},
			// 获取大菜单
			getMenus(){
				this.$uRequest.get({
					url: '/mini/home/mainCates',
					success: (res) => {
						if(res.code === 0){
							this.menus.splice(0,this.menus.length,...res.data.items)
						}else{
							
						}
					},
					fail: (err) => {
						console.log(JSON.stringify(err))
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		position: absolute;
		display: flex;
		// flex-direction: column;
		// align-items: center;
		// justify-content: center;
		width: 100%;
		height: 100%;
		
		.contents {
			flex: 1;
		}
		
		// swiper 轮播
		.swiper {
			margin-top: 30rpx;
			margin-left: 20rpx;
			margin-right: 20rpx;
			height: 300rpx;
			width:710rpx;
			border-radius: 10rpx;
			overflow: hidden;
			
			.swiper-item {
				width: 100%;
				height: 100%;
				
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
		
		//  最新
		.latest {
			white-space: nowrap;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			flex-wrap: nowrap;
			width: 100%;
			padding: 40rpx 0rpx;
			background-color: #fbfbfb;
		}
	}
</style>
