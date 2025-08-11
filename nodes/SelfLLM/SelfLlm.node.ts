import type { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { chatFields, chatOperations } from './ChatDescription';
import { NodeConnectionTypes } from 'n8n-workflow';

export class SelfLlm implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SelfLLM',
		name: 'selfLlm',
		// hidden: true,
		icon: { light: 'file:llm.svg', dark: 'file:llm.svg' },
		documentationUrl: 'https://llm.local.cn/ai',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Self LLM',
		defaults: {
			name: 'Self LLM',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'selfLLMApi',
				required: true,
			},
		],
		requestDefaults: {
			ignoreHttpStatusErrors: true,
			baseURL: 'http://llm.local.cn/ai',
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Chat',
						value: 'chat'
					}
				],
				default: 'chat',
			},

			...chatOperations,
			...chatFields,
		],
	};
}
