<template>
	<view class="content">
		<auto-menu :menus="cateMenus" :initIndex="current" @menuTap="menuTap" ref="menu"></auto-menu>
		<swiper class="contents" :current="current" @animationfinish="animationfinish" @change="swiperChange">
			<swiper-item class="contents_item" v-for="(menu,content_index) in cateMenus" :key="content_index">
				<category-page :pageIndex="content_index" :cateId="content_index > 0 ? menus[content_index-1].id :0" @init="initMescrolls"></category-page>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import AutoMenu from '@/components/common/AutoMenu.vue'
	import CategoryPage from './components/CategoryPage.vue'
	export default {
		components: {
			AutoMenu: AutoMenu,
			CategoryPage: CategoryPage
		},
		onLoad(option) {
			const {
				cate_id
			} = option
			this.cate_id = cate_id
			// 获取子分类
			this.getMenus()
		},
		data() {
			return {
				cate_id: 0,
				menus: [],
				mescrolls: {},
				current: 0,
				pageShow: false,
				autoMenu: undefined
			}
		},
		onShow() {
			this.pageShow = true
			this.triggerJumpToIndex()
		},
		computed: {
			cateMenus() {
				return ['全部', ...this.menus.map(cate => cate.name)]
			}
		},
		methods: {
			// 点击顶部的菜单
			menuTap(index) {
				this.current = index
			},
			swiperChange(e) {
				this.current = e.detail.current
			},
			animationfinish() {
				const timer = setTimeout(() => {
					clearTimeout(timer)
					this.triggerDownScroll(this.current)
				}, 200)
			},
			// 触发下拉刷新
			triggerDownScroll(index) {
				const mescoll = this.mescrolls[index]
				if (!mescoll.num) {
					this.mescrolls[index].triggerDownScroll()
				}
			},
			// 触发下拉刷新
			triggerUpScroll(index) {
				this.mescrolls[index].triggerUpScroll()
			},
			// 初始化mescroll
			initMescrolls({
				mescroll,
				pageIndex
			}) {
				this.mescrolls[pageIndex] = mescroll
			},
			triggerJumpToIndex() {
				if (this.menus.length <= 0 || !this.pageShow) {
					return
				}
				setTimeout(() => {
					// 加载完成后
					let index = 0
					for (let menu of this.menus) {
						if (menu.id == this.cate_id) {
							this.current = index + 1
							this.triggerDownScroll(this.current)
							this.$refs.menu.scrollToIndex(this.current)
							break
						}
						index++
					}
					// 说明点了全部
					if (index >= this.menus.length) {
						this.triggerDownScroll(this.current)
						this.$refs.menu.scrollToIndex(this.current)
					}
				}, 200)

			},
			// 获取子菜单
			getMenus() {
				this.$uRequest.get({
					url: '/mini/home/subCates',
					data: {
						cate_id: this.cate_id
					},
					success: (res) => {
						if (res.code === 0) {
							this.menus.splice(0, this.menus.length, ...res.data.items)
							this.triggerJumpToIndex()
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
	.content {
		position: absolute;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;

		.contents {
			display: flex;
			flex-direction: column;
			flex: 1;

			.contents_item {
				flex: 1;
				display: flex;
				flex-direction: column;
			}
		}

	}
</style>
