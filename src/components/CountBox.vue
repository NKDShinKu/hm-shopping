<template>
  <div class="box">
    <button class="minus" @click="handleSub">-</button>
    <input :value="value" @change="handleChange" class="inp" type="text">
    <button class="add" @click="handleAdd">+</button>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 1
    }
  },
  methods: {
    // 加法
    handleSub () {
      if (this.value < 2) {
        return
      }
      // 提交事件（子传父）
      this.$emit('input', this.value - 1)
    },
    // 减法
    handleAdd () {
      this.$emit('input', this.value + 1)
    },
    // 直接修改数量
    handleChange (e) {
      const num = +e.target.value
      // 不合法直接复原返回
      if (isNaN(num) || num < 1) {
        e.target.value = this.value
        return
      }
      this.$emit('input', num)
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  width: 110px;
  display: flex;
  .add, .minus {
    width: 30px;
    height: 30px;
    outline: none;
    border: none;
    background-color: #efefef;
  }
  .inp {
    width: 40px;
    height: 30px;
    outline: none;
    border: none;
    background-color: #efefef;
    margin: 0 5px;
    text-align: center;
  }
}
</style>
