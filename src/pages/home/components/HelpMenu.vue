<template>
  <div style="padding:40px;box-sizing:border-box;font-szie:14px;height:100vh;overflow:fidden">
    <div style="overflow-y:scroll;height:100%;">
        自动化平台帮助
      <br />
      <br /> 
      <br />   API 调试
      <br />1. 当前url > 环境url > 配置rul：
      <br />示例：/api/longin
      <br />自动补全请求地址后:www.baidu.com/api/longin
      <br />2. 可配置：
      <br />全局变量》环境变量》配置变量
      <br />3. Header：
      <br />一行一行添加
      <br />4. Requesr：
      <br />变量参数化 "userName": "$name"，必须为"$name"
      <br />可："$name123$pass" name与pass均为变量
      <br />如果变量不存在，直接失败报错
      <br />5. Extract:
      <br />抽取接口返回值 变量：userKey 提取式：content.data.userKey 下个接口直接调用"$userKey"
      <br />6. Validate:
      <br />校验 extract 提取,示例：eq content.code integer 200
      <br />7. Variables:
      <br />     后续补充
      <br />8. Hooks:
      <br />后续补充
      <br />9. Save保存选择已有的api库分组进行保存，Send运行直接运行
      <br /> 
      <br />
      <br />   API库
      <br />1. 分组,参照现有模块进行分组，根节点与子节点
      <br />2. 每个api后面有：编辑，运行，复制，删除按钮
      <br />3. 复制直接复制相同内容，但是需要新增名字
      <br /> 
      <br />
      <br />   测试用例
      <br />1. 分为冒烟，集成，监控用例
      <br />2. 模式：分组，添加用例，用例添加接口组合，组成业务逻辑
      <br />3. 添加用例，需要从api库中api从左边移动到右边用例框，然后新增名字保存
      <br />业务逻辑自行移动，上下移动代表执行顺序
      <br />保存用例的时候可以选择配置变量，进行保存
      <br />4. 如果api库中api更新，需要更新用例api,可点击用例后面同步按钮
      <br />5. 用例可以进行运行，可以选择同步执行或者异步执行
      <br />
      <br />
      <br />   配置管理-全局变量-域名环境
      <br />1. 均有地址设置，可以开关
      <br />2. 变量名称，选择类型，变量值，备注
      <br /> 
      <br /> 
      <br />   历史报告
      <br />1. 可以查看，下载，删除
      <br /> 
      <br /> 
      <br />   异步回执
      <br />1. 显示执行状态，成功，失败，与结束时间
      <br />2. 失败的异步，可以鼠标移动到traceback上面查看报错
      <br /> 
      <br /> 
      <br />    其他注意点：
      <br />- 后台日志未分页
      <br />- 测试数据模块未调通
      <br/>- 文件数据未调通
      <br/>- 给用户发邮件未调通
      <br />
      <br />
    </div>
  </div>
</template>

<script>
export default {
  name: "HelpMenu",
};
</script>

<style  scoped>
</style>