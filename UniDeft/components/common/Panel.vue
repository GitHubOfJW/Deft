<style lang="scss" scoped>
  panel {
    width: 100%;
  }
  .panel {
    // width: 100%;
    margin-top: 20rpx;
    text-align: left;
    font-size: 30rpx;
    padding-top: 20rpx;
    padding-bottom: 20rpx;

    .header {
      padding-bottom: 20rpx;
      font-size:30rpx;
      color:#666;
    }

    .info {
      padding: 15rpx;
    }
    .testcounter {
      margin-top: 15rpx;
      position: absolute;
    }
    .counterview {
      margin-left: 120rpx;
    }
  }
</style>
<template>
  <div class="panel">
    <view class="header">
      <view :style="{'padding-left': titleOffset +'rpx'}">{{title}}</view>
    </view>
	<view :style="{'padding-left': pLeft + 'rpx','padding-right': pRight + 'rpx'}">
		<slot>
		</slot>
	</view>
  </div>
</template>
<script>
export default {
  props:{
    title: {
      type: String,
      default: function(){
        return 'title prop'
      }
    },
	titleOffset: {
		type: Number,
		default: function(){
			return 20
		}
	},
	pLeft: {
		type: Number,
		default:function(){
			return 20
		}
	},
	pRight: {
		type: Number,
		default:function(){
			return 20
		}
	}
  }
}
</script>
