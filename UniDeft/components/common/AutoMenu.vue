<template>
<!-- scroll-view -->
  <scroll-view class="menus" :style="{width:containerWidth+'rpx'}" scroll-x="true" :scroll-left="scrollLeft" :scroll-with-animation="true" @scroll="scroll">
      <block v-for="(menu,index) in showMenus" :key="index">
        <label :style="{width:menu.width+'rpx',height: menu.height}" :class="{bottom: orientation &&  selectedIndex == index }" @click="menuClick(menu,index)">{{menu.name}}</label>
    </block>
  </scroll-view>
</template>

<script>
export default {
  props: {
    menus: {
      type: Array,
      default:function(){
        return []
      }
    },
    containerWidth: {
      type: Number,
      default: function(){
        return 750
      }
    },
    orientation: {
      type: Boolean,
      default: function(){
        return true
      }
    },
	initIndex: {
		type: Number,
		default:function(){
			return 0
		}
	}
  },
  data(){
    return {
      scrollLeft:0,
	  selectedIndex: this.initIndex
    }
  },
  computed: {
    showMenus(){
      // 计算 
      const  showMenus = []
      // 遍历
      let currentPos = 0
      const systemInfo = wx.getSystemInfoSync();
      const oneRpx =  systemInfo.windowWidth / 750
      console.log(oneRpx)
      if(this.orientation){
        for(let menu of this.menus) {
          // 获取到字数 算出宽度
          const width = (menu.length > 3 ? menu.length : 3) * 30 + 30
          // 计算offset
          let offset = currentPos + width * 0.5
          if(offset < this.containerWidth * 0.5){
            offset = 0
          }else{
			offset =  offset - this.containerWidth * 0.5
		  }
          // 累计位置
          currentPos = currentPos + width

          showMenus.push({
            name: menu,
            offset: offset * oneRpx,
            width: width,
            height: '100%'
          })
        }
      }

      return showMenus
        
    }
  },
  methods: {
    scroll(e){
	  if(this.orientation){
		  this.scrollLeft = e.detail.scrollLeft
	  }
    },
    menuClick(menu,index){
      console.log(menu)
      this.scrollLeft = menu.offset
	  this.selectedIndex = index
    }
  } 
}
</script>

<style lang="scss"  scoped>
  .menus {
    height: 80rpx;
	background-color: #FFFFFF;
	z-index: 1;
	box-shadow: 0px 5px 5px #f5f5f5;
    white-space: nowrap;
    label {
      display: inline-block;
      @include font_size(27);
      text-align: center;
      line-height: 80rpx;
	  box-sizing: border-box;
    }
	
	.bottom {
		position: relative;
		color: red !important;
		@include font_size(29);
		&:after {
			content: ' ';
			display: block;
			visibility: visible;
			position: absolute;
			left: 50%;
			width: 50%;
			height: 2px;
			bottom: 0px;
			z-index: 10;
			transform: translateX(-50%);
			background-color: red;
		}
	}
  }
</style>