<template>
	<view class="article">
		<article-header :article="article"></article-header>
		<rich-text class="content" :nodes="article.rich_content"></rich-text>
		<ArticleFooter :article="article"></ArticleFooter>
	</view>
</template>

<script>
	import ArticleHeader from './components/ArticleHeader.vue'
	import ArticleFooter from './components/ArticleFooter.vue'
	export default {
		components: {
			ArticleHeader: ArticleHeader,
			ArticleFooter: ArticleFooter
		},
		props: {
			article_id: {
				type: Number,
				default: function() {
					return undefined
				}
			}
		},
		data() {
			return {
				article:{}
			}
		},
		onLoad(options) {
			const {
				article_id
			} = options
			this.article_id = article_id
			// 获取文章数据
			this.getArticleDetail()
		},
		methods: {
			getArticleDetail() {
				this.$uRequest.get({
					url: '/mini/article/detail',
					data: {
						article_id:this.article_id
					},
					success: (res) => {
						if (res.code === 0) {
							this.article = res.data
							this.plusRead()
						} else {

						}
					},
					fail: (err) => {
						console.log(JSON.stringify(err))
					}
				})
			},
			plusRead(){
				this.$uRequest.put({
					url: '/mini/article/read/'+ this.article_id,
					success: (res) => {
						if (res.code === 0) {
							this.article = res.data
							// uni.setNavigationBarTitle({
							// 	title: this.article.title
							// })
						} else {
				
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
	.article {
		padding: 30rpx 30rpx;
		padding-bottom:100rpx;
	}
</style>
