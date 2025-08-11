import { TushareTool } from '../../nodes/ToolTushare/TushareTool';

// 测试动态 schema 生成
function testDynamicSchema() {
	console.log('=== 测试动态 Schema 生成 ===\n');

	// 测试用例 1: 没有输入字段配置
	console.log('测试用例 1: 没有输入字段配置');
	const tool1 = new TushareTool({
		name: 'test_api_1',
		description: '测试 API 1',
		token: 'test_token',
	});

	console.log('Schema:', tool1.getSchema().shape);
	console.log('Schema 描述:', tool1.getSchema().description);
	console.log('');

	// 测试用例 2: 有输入字段配置
	console.log('测试用例 2: 有输入字段配置');
	const tool2 = new TushareTool({
		name: 'test_api_2',
		description: '测试 API 2',
		token: 'test_token',
		inputFields: [
			{
				fieldName: 'code',
				description: '基金代码',
				type: 'string',
				required: true,
			},
			{
				fieldName: 'start_date',
				description: '开始日期',
				type: 'date',
				required: false,
			},
			{
				fieldName: 'limit',
				description: '返回记录数量',
				type: 'number',
				required: false,
			},
			{
				fieldName: 'active',
				description: '是否激活',
				type: 'boolean',
				required: false,
			},
		],
	});

	console.log('Schema:', tool2.getSchema().shape);
	console.log('Schema 描述:', tool2.getSchema().description);
	console.log('');

	// 测试用例 3: 验证 schema 验证功能
	console.log('测试用例 3: 验证 schema 验证功能');
	try {
		const validInput = {
			code: '000001.OF',
			start_date: '2024-01-01',
			limit: 20,
			active: true,
		};

		const result = tool2.getSchema().parse(validInput);
		console.log('✅ 有效输入验证通过:', result);
	} catch (error) {
		console.log('❌ 有效输入验证失败:', error);
	}

	try {
		const invalidInput = {
			code: '000001.OF',
			start_date: '2024/01/01', // 错误的日期格式
			limit: '20', // 应该是数字
		};

		const result = tool2.getSchema().parse(invalidInput);
		console.log('✅ 无效输入验证通过:', result);
	} catch (error) {
		console.log('❌ 无效输入验证失败 (预期):', error);
	}
}

// 运行测试
if (require.main === module) {
	testDynamicSchema();
}

export { testDynamicSchema };
