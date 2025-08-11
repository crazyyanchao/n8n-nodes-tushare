import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

export interface TushareToolFields {
	name: string; // 工具名称，也是Tushare API名称
	description: string; // 工具描述
	token: string; // 接口token
	timeout?: number; // 超时时间
	inputFields?: Array<{
		fieldName: string;
		description: string;
		type?: 'string' | 'number' | 'boolean' | 'date';
		required?: boolean;
		defaultValue?: any;
	}>;
}

export class TushareTool extends DynamicStructuredTool<z.ZodObject<any>, any, any, string> {
	name: string;
	description: string;
	token: string;
	timeout: number;
	public schema: z.ZodObject<any>;

	constructor(fields: TushareToolFields) {
		// 动态生成 schema
		const schema = TushareTool.generateSchema(fields.inputFields);

		super({
			name: fields.name,
			description: fields.description,
			schema: schema,
			func: async (input: any) => {
				return await this.processTushareRequest(input);
			}
		});

		this.name = fields.name;
		this.description = fields.description;
		this.token = fields.token;
		this.timeout = fields.timeout || 30000;
		this.schema = schema;
	}

	/**
	 * 根据用户配置的输入字段动态生成 Zod schema
	 */
	private static generateSchema(inputFields?: Array<{
		fieldName: string;
		description: string;
		type?: 'string' | 'number' | 'boolean' | 'date';
		required?: boolean;
		defaultValue?: any;
	}>): z.ZodObject<any> {
		if (!inputFields || inputFields.length === 0) {
			// 如果没有配置输入字段，返回通用的 schema
			return z.object({
				limit: z.number().optional().default(10),
				offset: z.number().optional().default(0),
				// 允许其他任意字段
				additionalFields: z.record(z.any()).optional(),
			});
		}

		const schemaFields: Record<string, z.ZodTypeAny> = {};

		inputFields.forEach(field => {
			if (!field.fieldName || field.fieldName.trim() === '') {
				return; // 跳过空字段名
			}

			let fieldSchema: z.ZodTypeAny;

			// 根据字段类型生成对应的 Zod schema
			switch (field.type) {
				case 'number':
					fieldSchema = z.number();
					break;
				case 'boolean':
					fieldSchema = z.boolean();
					break;
				case 'date':
					fieldSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式应为 YYYY-MM-DD');
					break;
				case 'string':
				default:
					fieldSchema = z.string();
					break;
			}

			// 如果字段有默认值，设置为可选并添加默认值
			if (field.defaultValue !== undefined) {
				fieldSchema = fieldSchema.optional().default(field.defaultValue);
			} else if (!field.required) {
				// 如果字段不是必需的，设置为可选
				fieldSchema = fieldSchema.optional();
			}

			schemaFields[field.fieldName] = fieldSchema;
		});

		// 添加通用的分页字段
		schemaFields.limit = z.number().optional().default(10);
		schemaFields.offset = z.number().optional().default(0);

		// 允许额外的字段（向后兼容）
		schemaFields.additionalFields = z.record(z.any()).optional();

		return z.object(schemaFields);
	}

	/**
	 * 获取当前使用的 schema
	 */
	getSchema(): z.ZodObject<any> {
		return this.schema;
	}

	static lc_name(): string {
		return 'TushareTool';
	}

	get lc_namespace(): string[] {
		return ['tushare', 'tools'];
	}

	/** @ignore */
	protected async _call(arg: Record<string, any>): Promise<string> {
		// console.log('arg', arg);
		return await this.processTushareRequest(arg);
	}

	private async processTushareRequest(params: Record<string, any>): Promise<string> {
		try {
			// 转义百分号字符，避免Python字符串格式化错误
			const escapePercentSigns = (value: any): any => {
				if (typeof value === 'string') {
					return value.replace(/%/g, '%%');
				}
				return value;
			};

			const escapedParams = Object.fromEntries(
				Object.entries(params).map(([key, value]) => [
					key,
					escapePercentSigns(value)
				])
			);

			// 准备请求体
			if (!escapedParams.limit) {
				escapedParams.limit = 10000;
			}
			if (!escapedParams.offset) {
				escapedParams.offset = 0;
			}

			const requestBody = {
				api_name: this.name,
				token: this.token,
				params: escapedParams,
				fields: '',
			};
			// console.log('requestBody', JSON.stringify(requestBody));
			// 发送 API 请求
			const response = await fetch('http://api.tushare.pro', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody),
				signal: AbortSignal.timeout(this.timeout),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			// console.log('data', data);
			return JSON.stringify(data, null, 2);

		} catch (error) {
			const errorMessage = error && typeof error === 'object' && error !== null && 'message' in error
				? error.message
				: String(error || 'Unknown error');
			return `Error: ${errorMessage}`;
		}
	}
}
