import type {
	INodeType,
	INodeTypeDescription,
	ISupplyDataFunctions,
	SupplyData,
} from 'n8n-workflow';
import {
	NodeConnectionTypes,
	NodeOperationError,
	tryToParseAlphanumericString,
} from 'n8n-workflow';
import { TushareTool } from './TushareTool';


const PLACEHOLDER = `获取基金基本信息数据。

此工具用于从 fund_info 获取基金基本信息数据，包含基金代码、基金名称、基金类型等。

输入字段：
- code（可选）: 基金代码，.OF结尾的代码，如：000001.OF
- name（可选）: 基金名称
- type（可选）: 基金类型
- start_date（可选）: 开始日期，格式：YYYY-MM-DD
- end_date（可选）: 结束日期，格式：YYYY-MM-DD
- limit（可选）: 返回记录数量限制，默认10
- offset（可选）: 偏移量，用于分页，默认0

输出字段：
- code: 基金代码
- name: 基金名称
- type: 基金类型

应用场景：基金信息查询、基金报表制作等

参数填充指导：
1. 根据具体需求选择合适的参数组合
2. 日期格式使用 YYYY-MM-DD
3. 代码字段通常以 .OF 结尾（如：000001.OF）
4. limit 和 offset 用于分页控制

调用示例：
查询平安银行基本信息，工具的查询入参为：
{"cname_srch": "%平安银行%"}`

export class ToolJsdata implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Tool Tushare',
		name: 'toolTushare',
		icon: { light: 'file:tushare.svg', dark: 'file:tushare.svg' },
		documentationUrl: 'https://api.tushare.pro',
		group: ['output'],
		version: [1, 1.1],
		description: '使用 Tool 方式实现 Tushare 功能',
		subtitle: '获取 Tushare API 数据',
		defaults: {
			name: 'Tool Tushare',
		},
		credentials: [
			{
				name: 'tushareApi',
				required: true,
			},
		],
		codex: {
			categories: ['AI'],
			subcategories: {
				AI: ['Tools'],
				Tools: ['Recommended Tools'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://api.tushare.pro',
					},
				],
			},
		},
		inputs: [],
		outputs: [NodeConnectionTypes.AiTool],
		outputNames: ['Tool'],
		properties: [
			{
				displayName: 'API Name',
				name: 'apiName',
				type: 'string',
				default: '',
				placeholder: 'e.g., stock_company',
				description: '要调用的 API 名称',
				required: true,
			},
			{
				displayName: 'Tool Description',
				name: 'toolDescription',
				type: 'options',
				description: '选择工具描述的方式：从模板生成或直接填入自定义字符串',
				options: [
					{
						name: 'Generate From Template',
						value: 'template',
					},
					{
						name: 'Custom String',
						value: 'custom',
					},
				],
				default: 'template',
			},

			{
				displayName: 'Main Function',
				name: 'mainFunction',
				type: 'string',
				description: '当前工具主要功能（一句话描述，必填）',
				displayOptions: {
					show: {
						toolDescription: ['template'],
					},
				},
				placeholder: '获取当前接口数据',
				default: '',
				required: true,
			},
			{
				displayName: 'Detailed Description',
				name: 'detailedDescription',
				type: 'string',
				description: '功能的详细说明（选填）',
				displayOptions: {
					show: {
						toolDescription: ['template'],
					},
				},
				placeholder: '当前接口的详细说明',
				default: '',
				typeOptions: {
					rows: 3,
				},
			},
			{
				displayName: 'Input Fields',
				name: 'inputFields',
				type: 'fixedCollection',
				description: '输入字段的描述（字段名和描述为必填）',
				displayOptions: {
					show: {
						toolDescription: ['template'],
					},
				},
				typeOptions: {
					multipleValues: true,
				},
				default: {
					values: [],
				},
				options: [
					{
						name: 'values',
						displayName: '字段',
						values: [
							{
								displayName: 'Field Name',
								name: 'fieldName',
								type: 'string',
								default: '',
								placeholder: 'e.g., param1',
								required: true,
							},

							{
								displayName: 'Field Description',
								name: 'description',
								type: 'string',
								default: '',
								placeholder: '字段的详细描述',
								required: true,
								typeOptions: {
									rows: 2,
								},
							},
							{
								displayName: 'Field Type',
								name: 'fieldType',
								type: 'options',
								description: '字段的数据类型',
								options: [
									{
										name: 'String',
										value: 'string',
									},
									{
										name: 'Number',
										value: 'number',
									},
									{
										name: 'Boolean',
										value: 'boolean',
									},
									{
										name: 'Date (YYYY-MM-DD)',
										value: 'date',
									},
								],
								default: 'string',
							},
							{
								displayName: 'Required',
								name: 'required',
								type: 'boolean',
								description: 'Whether the field is required',
								default: false,
							},
						],
					},
				],
			},
			{
				displayName: 'Output Fields',
				name: 'outputFields',
				type: 'fixedCollection',
				description: '输出字段的描述（字段名和描述为必填）',
				displayOptions: {
					show: {
						toolDescription: ['template'],
					},
				},
				typeOptions: {
					multipleValues: true,
				},
				default: {
					values: [],
				},
				options: [
					{
						name: 'values',
						displayName: 'Field',
						values: [
							{
								displayName: 'Field Name',
								name: 'fieldName',
								type: 'string',
								default: '',
								placeholder: 'e.g., data',
								required: true,
							},
							{
								displayName: 'Field Description',
								name: 'description',
								type: 'string',
								default: '',
								placeholder: '返回字段的详细描述',
								required: true,
								typeOptions: {
									rows: 2,
								},
							},
						],
					},
				],
			},
			{
				displayName: 'Use Cases',
				name: 'useCases',
				type: 'string',
				description: '应用场景（选填）',
				displayOptions: {
					show: {
						toolDescription: ['template'],
					},
				},
				placeholder: '股票数据分析、基金信息查询、金融数据报表生成等',
				default: '',
				typeOptions: {
					rows: 2,
				},
			},
			{
				displayName: 'Parameter Filling Guide',
				name: 'parameterFillingGuide',
				type: 'string',
				description: '参数填充指导（选填）',
				displayOptions: {
					show: {
						toolDescription: ['template'],
					},
				},
				placeholder: '1. 根据具体需求选择合适的参数组合\n2. 日期格式使用 YYYY-MM-DD\n3. 代码字段通常以 .OF 结尾（如：000001.OF）\n4. limit 和 offset 用于分页控制',
				default: '',
				typeOptions: {
					rows: 4,
				},
			},
			{
				displayName: 'Call Example',
				name: 'callExample',
				type: 'string',
				description: '调用示例（选填）',
				displayOptions: {
					show: {
						toolDescription: ['template'],
					},
				},
				placeholder: `{
    "code": "000001",
    "start_date": "2024-01-01",
    "end_date": "2024-12-31"
}`,
				default:'',
				typeOptions: {
					rows: 8,
				},
			},
			{
				displayName: 'Custom Description',
				name: 'customDescription',
				type: 'string',
				description: '直接输入自定义的工具描述',
				displayOptions: {
					show: {
						toolDescription: ['custom'],
					},
				},
				placeholder: PLACEHOLDER,
				default: '',
				typeOptions: {
					rows: 10,
				},
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 30000,
				description: '请求超时时间（毫秒）',
			},
		],
	};

	async supplyData(this: ISupplyDataFunctions, itemIndex: number): Promise<SupplyData> {
		const name = this.getNode().name.replace(/ /g, '_');
		try {
			tryToParseAlphanumericString(name);
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				'The name of this tool is not a valid alphanumeric string',
				{
					itemIndex,
					description:
						"Only alphanumeric characters and underscores are allowed in the tool's name, and the name cannot start with a number",
				},
			);
		}

		const toolDescriptionType = this.getNodeParameter('toolDescription', itemIndex) as string;

		// 根据选择的方式生成工具描述
		let toolDescription = '';
		if (toolDescriptionType === 'template') {
			const mainFunction = this.getNodeParameter('mainFunction', itemIndex) as string;
			const detailedDescription = this.getNodeParameter('detailedDescription', itemIndex) as string;
			const inputFields = this.getNodeParameter('inputFields', itemIndex) as any;
			const outputFields = this.getNodeParameter('outputFields', itemIndex) as any;
			const useCases = this.getNodeParameter('useCases', itemIndex) as string;
			const parameterFillingGuide = this.getNodeParameter('parameterFillingGuide', itemIndex) as string;
			const usageExample = this.getNodeParameter('callExample', itemIndex) as string;

			// 构建模板化的描述
			toolDescription = `${mainFunction}`;

			if (detailedDescription) {
				toolDescription += `\n\n${detailedDescription}`;
			}

			// 添加参数使用说明
			if (inputFields && inputFields.values && inputFields.values.length > 0) {
				// 过滤掉字段名为空的项
				const validInputFields = inputFields.values.filter((field: any) => field.fieldName && field.fieldName.trim() !== '');
				if (validInputFields.length > 0) {
					toolDescription += '\n\n输入字段：';
					validInputFields.forEach((field: any) => {
						toolDescription += `\n- ${field.fieldName}: ${field.description}`;
					});
				}
			}

			if (outputFields && outputFields.values && outputFields.values.length > 0) {
				// 过滤掉字段名为空的项
				const validOutputFields = outputFields.values.filter((field: any) => field.fieldName && field.fieldName.trim() !== '');
				if (validOutputFields.length > 0) {
					toolDescription += '\n\n输出字段：';
					validOutputFields.forEach((field: any) => {
						toolDescription += `\n- ${field.fieldName}: ${field.description}`;
					});
				}
			}

			if (useCases) {
				toolDescription += `\n\n应用场景：${useCases}`;
			}

			if (parameterFillingGuide) {
				toolDescription += '\n\n参数填充指导：';
				toolDescription += `\n${parameterFillingGuide}`;
			}

			if (usageExample) {
				toolDescription += '\n\n使用示例：';
				toolDescription += `\n${usageExample}`;
			}
		} else {
			toolDescription = this.getNodeParameter('customDescription', itemIndex) as string;
		}

		// console.log('生成的工具描述: ', toolDescription);

		// 获取必要的参数
		const apiName = this.getNodeParameter('apiName', itemIndex, '') as string;
		const timeout = this.getNodeParameter('timeout', itemIndex, 30000) as number;
		const credentials = await this.getCredentials('tushareApi');
		const token = credentials.token as string;

		// 创建工具描述
		const description = toolDescription || 'Tushare data fetching tool';

		// 获取用户配置的输入字段
		let inputFields: any[] = [];
		if (toolDescriptionType === 'template') {
			const inputFieldsConfig = this.getNodeParameter('inputFields', itemIndex) as any;
			if (inputFieldsConfig && inputFieldsConfig.values && inputFieldsConfig.values.length > 0) {
				// 过滤掉字段名为空的项，并添加类型信息
				inputFields = inputFieldsConfig.values
					.filter((field: any) => field.fieldName && field.fieldName.trim() !== '')
					.map((field: any) => ({
						fieldName: field.fieldName.trim(),
						description: field.description || '',
						type: field.fieldType || 'string',
						required: field.required || false,
					}));
			}
		}

		// 创建 TushareTool 实例
		const tool = new TushareTool({
			name: apiName,
			description,
			token,
			timeout,
			inputFields,
		});

		return {
			response: tool,
		};
	}
}
