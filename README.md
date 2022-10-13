# wakuwaku

<img src='./wakuwaku.png' width='50%'/>

## 项目研发

### 本地研发

:sparkles: 切换到 `dev` 分支开发

1. 配置淘宝镜像源

```bash
npm config set registry https://registry.npm.taobao.org
```

2. 初始化项目

```bash
git clone https://github.com/regaliastar/wakuwaku.git
cd wakuwaku
npm install
```

3. 运行
```bash
npm run start
```

4. 监听文件修改，持续编译
```bash
npm run watch
```

### 目录结构

- scripts --> 工程化支撑脚本，包括 webpack 配置等
- shell --> 构建脚本
- src --> 项目源码目录
  - entry 项目的入口，包括整体布局、路由和页面菜单
  - page 具体的页面模块
  - common 公共组件
    - interface 接口类型统一放在这个目录下
    - component 业务组件
    - less 全局统一的样式
    - util 全局的工具类
    - store 存储
