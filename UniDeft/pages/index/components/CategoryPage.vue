<template>
	<view class="content_page">
		<!-- 列表 -->
		<mescroll-uni :up="upOptions" :down="downOptions" @down="downCallback" @up="upCallback" @init="initMescrolls">
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
	import SubCategory from './SubCategory.vue'

	export default {
		components: {
			MescrollUni: MescrollUni,
			Panel: Panel,
			ArticleItem: ArticleItem,
			ArticleCell: ArticleCell,
			SubCategory: SubCategory
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
				mescroll.resetUpScroll()
			},
			// 上拉刷新
			upCallback(mescroll) {
				this.$uRequest.get({
					url: '/mini/home/articles',
					data: {
						page: mescroll.num,
						limit: mescroll.size,
						cate_id: this.cateId
					},
					success: (res) => {
						if (res.code === 0) {
							if(mescroll.num == 1){
								this.articles.splice(0,this.articles.length)
							}
							this.articles.splice(this.articles.length, 0, ...res.data.items)
							this.$nextTick(()=>{
								mescroll.endBySize(res.data.items.length, res.data.total)
							})
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
			// 点击了分类
			menuTap(index){
				// 全部
				if(index == -1){
					const url = `/pages/index/category?cate_id=${this.cateId}`
					console.log(url,'kanakn');
					uni.navigateTo({
						url: url
					}) 
				}else{ // 具体分类
					// 点解了别的分类
					for(let flexData in this.flexDatas){
						if(flexData.type == 'category'){
							const url  =`/pages/index/category?cate_id=${flexData.data[index]}`
							console.log(url,'kanakn');
							uni.navigateTo({
								url: url
							})
							break
						}
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content_page {
		width: 100%;
		display: flex;
		flex-direction: column;
		// 列表
		.list {
			padding: 20rpx 30rpx;
		}
	}
</style>
