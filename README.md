# 简介

本仓库是学习 [《NestJS Fundamentals Course》](https://courses.nestjs.com/#overview) 课程的个人代码实践

# 说明

## 启动

1. 启动docker app
2. 启动docker容器
   ```shell
   // 在后台运行服务
   docker-compose up -d
   ```
3. 启动项目
   ```shell
   yarn start:dev
   ```

### ### 生产环境

#### 打包

yarn build

#### 打包后更新

pm2 reload `<id>`

### 待办

增加日志保存

#### 生成模块

nest g mo `<name>`

#### 生成控制器

nest g co `<name>`

#### 生成服务

nest g s `<name>`

#### log path

~/.logs/nestjs_app

#### db path

~/.sqlite

#### sh path

~/.bin/nestjs_app/
