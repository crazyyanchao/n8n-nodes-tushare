import { TushareTool } from '../../nodes/ToolTushare/TushareTool';
import { executeTool } from './executeTool';

// 测试命令：npx ts-node test_tooldata.ts
// 测试配置
const testConfig = {
    name: 'stock_company',
    desc: '获取基金基本信息数据',
    token: '<TOKEN>',
    timeout: 30000
};

// 模拟输入数据
const mockInput = {
    code: '000001.SZ',
    limit: 10,
    offset: 0
};

// 创建 dataTool 实例
const dataTool = new TushareTool({
    name: testConfig.name,
    description: testConfig.desc,
    token: testConfig.token,
    timeout: testConfig.timeout,
    inputFields: [
        {
            fieldName: 'code',
            description: '基金代码',
            type: 'string',
            required: true,
        }
    ]
});

// 测试函数
async function testToolDataCall() {
    try {
        console.log('开始测试 ToolData...');
        console.log('测试配置:', testConfig);
        console.log('输入参数:', mockInput);

        // 测试 _call 方法
        console.log('\n测试 _call 方法...');
        const result = await dataTool.invoke(mockInput);

        console.log('\n测试结果:');
        console.log('输出:', JSON.stringify(result, null, 2));

    } catch (error) {
        console.error('测试过程中发生错误:', error);
    }
}

// 运行测试
if (require.main === module) {
    // testToolDataCall().then(() => {
    //     console.log('\n测试完成');
    // }).catch((error) => {
    //     console.error('测试执行失败:', error);
    // });
    const query = '{"code": "000001.SZ"}'
    executeTool(dataTool, query).then(() => {
        console.log('\n测试完成');
    }).catch((error) => {
        console.error('测试执行失败:', error);
    });
}

export { testToolDataCall, testConfig, mockInput };
