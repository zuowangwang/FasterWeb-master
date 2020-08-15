<template>
  <div style="padding:40px;font-szie:14px">
    <p style="color:#236aeb"># 自动化平台帮助</p>
    <h3 style="color:#236aeb">## API 调试</h3>
    <p>1. 当前url > 环境url > 配置rul：</p>
    <p>示例：/api/longin</p>
    <p>自动补全请求地址后:<span style="color:#236aeb">www.baidu.com/api/longin</span></p>
    <p>2. 可配置：</p>
    <p>全局变量》环境变量》配置变量</p>
    <p>3. Header：</p>
    <p>一行一行添加</p>
    <p>4. Requesr：</p>
    <p>变量参数化 "userName": "$name"，必须为"$name"</p>
    <p>可："$name123$pass" name与pass均为变量</p>
    <p>如果变量不存在，直接失败报错</p>
    <p>5. Extract:</p>
    <p>后续补充</p>
    <p>6. Validate:</p>
    <p>后续补充</p>
    <p>7. Variables:</p>
    <p>后续补充</p>
    <p>8. Hooks:</p>
    <p>后续补充</p>
    <h3  style="color:#236aeb">## API库</h3>
    <p>1. 分组,参照现有模块进行分组，根节点与子节点</p>
    <p>2. 每个api后面有：编辑，运行，复制，删除按钮</p>
    <p>3. 复制直接复制相同内容，但是需要新增名字</p>
    <h3  style="color:#236aeb">## 测试用例</h3>
    <p>1. 分为冒烟，集成，监控用例</p>
    <p>2. 模式：分组，添加用例，用例添加接口组合，组成业务逻辑</p>
    <p>3. 添加用例，需要从api库中api从左边移动到右边用例框，然后新增名字保存</p>
    <p>业务逻辑自行移动，上下移动代表执行顺序</p>
    <p>保存用例的时候可以选择配置变量，进行保存</p>
    <p>4. 如果api库中api更新，需要更新用例api,可点击用例后面同步按钮</p>
    <p>5. 用例可以进行运行，可以选择同步执行或者异步执行</p>
    <h4  style="color:#236aeb">## 配置管理-全局变量-域名环境</h4>
    <p>1. 均有地址设置，可以开关</p>
    <p>2. 变量名称，选择类型，变量值，备注</p>
    <h4  style="color:#236aeb">## 历史报告</h4>
    <p>1. 可以查看，下载，删除</p>
    <h4  style="color:#236aeb">## 异步回执</h4>
    <p>1. 显示执行状态，成功，失败，与结束时间</p>
    <p>2. 失败的异步，可以鼠标移动到traceback上面查看报错</p>
    <h3  style="color:#236aeb">### 其他注意点：</h3>
    <p>- 后台日志未分页</p>
    <p>- 测试数据模块未调通</p>
  </div>
</template>

<script>
export default {
  name: "HelpMenu",
};
</script>

<style  scoped>
</style>