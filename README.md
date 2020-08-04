# 多人在线实时 TodoList

这是一个基于腾讯云云开发数据库<a href="https://cloud.tencent.com/document/product/876/41801">实时推送</a>能力开发的，web 端实时更新的 todolist 案例。
<br>
整个案例使用<a href="https://github.com/TencentCloudBase/cloudbase-framework"> CloudBase Framework 前后端一体化部署工具</a>，一站式完成项目的创建、开发以及部署。

<br>

# 效果展示

![image](https://7368-shryzhang-test-13eb29-1258821855.tcb.qcloud.la/CloudBase-Framework/watch-todolist.gif?sign=e34acbd082e71817573eb0de168dd9c7&t=1596523227)

示例访问地址：http://cloud.qinmudi.cn/watch-todolist

<br>

# 技术背景

## 1.腾讯云 CloudBase 数据库支持实时推送能力

[实时推送](https://cloud.tencent.com/document/product/876/41801)

## 2.CloudBase Framework

云开发官方出品的前后端一体化部署工具。

可以一键创建并部署 vue、react、node、koa 等各类应用。

目前已在 github [开源](https://github.com/TencentCloudBase/cloudbase-framework) 。

<br>

# 本地预览我们的示例

## 1.git clone

```shell
git clone https://github.com/oteam-sources/watch-todolist.git
```

## 2.配置 cloudbaserc.json

配置自己的 envId。注意要使用**按量计费**环境。

## 3.部署 database

```shell
yarn deploy:database
```

## 4.本地启动

```shell
yarn dev
```

or

```shell
npm run dev
```

## 5.本地预览

浏览器访问：http://localhost:8080/watch-todolist/

<br>

# 一键部署我们的示例

## 1.配置 cloudbaserc.json

配置自己的 envId。注意要使用**按量计费**环境。

## 2.执行部署

```shell
yarn deploy
```

or

```shell
npm run deploy
```

## 3.线上预览

浏览器访问

![image](https://7368-shryzhang-test-13eb29-1258821855.tcb.qcloud.la/CloudBase-Framework/deploy-success.jpg?sign=e1d530f57726a68f89e874b429e6b41c&t=1596529607)

预览部署后的示例~
