# Ruff check

## Installation

```
npm i
npm run rebuild
```

## Usage

```
npm run start
```

## Description

Ruff check 是一个 Ruff 开发辅助工具。使用 Electron 框架。

#### 原理：
使用 serialport 模块调用串口命令,然后把返回的消息显示出来。

#### 平台支持
支持 Windows, Mac平台

#### 主要功能
1. 获取当前板卡系统信息，WiFi 地址，Ethernet 地址。
2. 对板卡进行重置，等效于长按10秒 RESET 按钮。
3. 当板卡无法正常工作的时候，获取板卡运行日志，便于 Ruff 程序员调试。

---

![](demo.png)