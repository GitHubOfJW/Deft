<template>
	<view class="content">
		<!-- 顶部滚动条 -->
		<auto-menu :menus="cateMenus" :initIndex="current" @menuTap="menuTap"></auto-menu>
		<swiper class="contents" :current="current" @animationfinish="animationfinish" @change="swiperChange">
			<swiper-item class="contents_item" v-for="(menu,content_index) in cateMenus" :key="content_index">
				<home-page :pageIndex="content_index" :cateId="content_index > 0 ? menus[content_index-1].id :0" @init="initMescrolls"></home-page>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import AutoMenu from '@/components/common/AutoMenu.vue'
	import HomePage from './components/HomePage'
	export default {
		components: {
			AutoMenu: AutoMenu,
			HomePage: HomePage
		},
		data() {
			return {
				menus: [],
				mescrolls: {},
				current: 0
			}
		},
		onLoad() {
			// 获取菜单
			this.getMenus()
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
			swiperChange(e){
				this.current =  e.detail.current
			},
			animationfinish(){
				const timer = setTimeout(()=>{
					clearTimeout(timer)
					this.triggerDownScroll(this.current)
				},200)
			},
			// 触发下拉刷新
			triggerDownScroll(index) {
				const mescoll = this.mescrolls[index]
				if(!mescoll.num){
					this.mescrolls[index].triggerDownScroll()
				}
			},
			// 触发下拉刷新
			triggerUpScroll(index) {
				console.log(this.mescrolls)
				this.mescrolls[index].triggerUpScroll()
			},
			// 初始化mescroll
			initMescrolls({
				mescroll,
				pageIndex
			}) {
				this.mescrolls[pageIndex] = mescroll
			},
			// 获取大菜单
			getMenus() {
				this.$uRequest.get({
					url: '/mini/home/mainCates',
					success: (res) => {
						if (res.code === 0) {
							this.menus.splice(0, this.menus.length, ...res.data.items)
							// 菜单获取完毕后，触发第一个
							if(this.current == 0){
								this.triggerDownScroll(0)
							}
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
