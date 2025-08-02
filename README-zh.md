# n8n-nodes-tushare

[![English](https://img.shields.io/badge/English-Click-yellow)](README.md)
[![中文文档](https://img.shields.io/badge/中文文档-点击查看-orange)](README-zh.md)

这是一个n8n社区节点，让您可以在n8n工作流中使用Tushare API。

Tushare是一个专业的金融数据平台，提供股票、基金、期货、外汇等金融数据的API服务。通过这个节点，您可以轻松获取股票行情、公司信息、财务数据等金融数据，并将其集成到您的自动化工作流中。

[n8n](https://n8n.io/) 是一个[公平代码许可](https://docs.n8n.io/reference/license/)的工作流自动化平台。

[安装](#安装)  
[操作](#操作)  
[凭据](#凭据)  
[兼容性](#兼容性)  
[使用说明](#使用说明)  
[资源](#资源)  
[版本历史](#版本历史)  

## 安装

按照n8n社区节点文档中的[安装指南](https://docs.n8n.io/integrations/community-nodes/installation/)进行安装。

另外，你也可以参考使用这些[n8n工作流模板](https://github.com/crazyyanchao/n8n-workflow-template)。

## 操作

此节点支持以下操作：

- **API调用**: 调用Tushare API获取金融数据
- **参数配置**: 支持JSON格式和单独参数两种输入方式
- **数据转换**: 自动处理API响应数据

## 凭据

要使用此节点，您需要：

1. **注册Tushare账户**: 访问 [Tushare官网](https://tushare.pro/) 注册账户
2. **获取API Token**: 登录后在个人中心获取您的API Token
3. **配置凭据**: 在n8n中配置Tushare API凭据，输入您的Token

### 认证方法
- **API Token认证**: 使用您在Tushare平台获取的Token进行API调用

## 兼容性

- **最低n8n版本**: 1.0.0
- **Node.js版本**: >=22.16
- **测试版本**: n8n 1.0.0+

## 使用说明

### 基本配置

1. **添加Tushare节点**到您的工作流中
2. **配置凭据**: 选择或创建Tushare API凭据
3. **设置API名称**: 输入要调用的Tushare API名称（如：stock_company, daily等）
4. **配置参数**: 选择参数输入方式（JSON或单独参数）

### 参数配置

**JSON模式**:
```json
{
  "offset": 0,
  "limit": 10,
  "ts_code": "000001.SZ"
}
```

**单独参数模式**:
- 逐个添加参数键值对
- 支持动态值输入

### 常用API示例

- **股票基本信息**: `stock_company`
- **日线行情**: `daily`
- **财务指标**: `income`
- **公司公告**: `anns`

### 数据输出

节点将返回Tushare API的原始响应数据，您可以在后续节点中进行进一步处理。

## 资源

* [n8n社区节点文档](https://docs.n8n.io/integrations/#community-nodes)
* [Tushare官方文档](https://tushare.pro/document/1)
* [Tushare API参考](https://tushare.pro/document/2)

## 版本历史

### v0.1.x (当前版本)
- 初始版本发布
- 支持Tushare API基本调用
- 支持JSON和单独参数两种输入模式
- 完整的凭据认证系统

### 计划功能
- 支持更多Tushare API端点
- 添加数据缓存功能
- 优化错误处理机制
- 增加批量数据处理能力

---

**注意**: 使用此节点需要有效的Tushare账户和API Token。请确保遵守Tushare的使用条款和API调用限制。


