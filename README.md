# FasterWeb

## Docker 部署nginx模式
``` 
1. 修改default.conf配置文件 server_name的ip(宿主机IP), 端口默认8080
2. 修改/src/restful/api.js baseUrl地址, 即为fastrunner容器运行的宿主机地址
3. 执行npm install, npm run build # 生成生产环境包
3. docker build -t fastweb:latest .    # 构建docker镜像
4. docker run -d --name fastweb -p8888:8888 --restart always fastweb:latest  # 后台运行docker容器
5. open url: http://宿主机ip:8888/fastrunner/login
``` 

## 本地开发环境部署

``` bash
1. 修改FasterWeb/src/restful/api.js的baseUrl配置为FasterRunner启动的ip:port
2. npm install 安装依赖包
3. npm run dev 开发环境启动服务
4. open url: http://localhost:8080/fastrunner/login
```

### 其他注意点：
- npm 安装太慢时参考：http://npm.taobao.org/
- 安装指定版本node: 
    1.  wget https://nodejs.org/dist/v8.11.4/node-v8.11.4-linux-x64.tar.xz
    2. tar xf  node-v8.11.4-linux-x64.tar.xz
    3. sudo ln -s /home/ebao/node-v8.11.4-linux-x64/bin/npm /usr/bin/npm 
    4. sudo ln -s /home/ebao/node-v8.11.4-linux-x64/bin/node /usr/bin/node
- 安装指定版本npm: sudo npm install -g npm@5.6.0 
