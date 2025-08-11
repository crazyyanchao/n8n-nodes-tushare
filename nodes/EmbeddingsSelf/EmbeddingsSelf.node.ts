import { SelfEmbeddings } from './SelfEmbeddings';
import {
	NodeConnectionTypes,
	type INodeType,
	type INodeTypeDescription,
	type SupplyData,
	type ISupplyDataFunctions,
	type INodeProperties,
} from 'n8n-workflow';

const modelParameter: INodeProperties = {
	displayName: 'Model',
	name: 'model',
	type: 'options',
	description:
		'The model which will generate the embeddings. <a href="https://llm.local.cn/ai">Learn more</a>.',
	options: [
		{
			name: 'Bge Large En',
			value: 'bge-large-en',
		},
		{
			name: 'Bge Large Zh',
			value: 'bge-large-zh',
		},
		{
			name: 'Conan V1',
			value: 'conan-v1',
		},
		{
			name: 'M3e Base',
			value: 'm3e-base',
		},
		{
			name: 'M3e Batch',
			value: 'm3e-batch',
		},
		{
			name: 'Text Embedding 3 Large',
			value: 'text-embedding-3-large',
		},
		{
			name: 'Text Embedding 3 Small',
			value: 'text-embedding-3-small',
		},
		{
			name: 'Text Embedding Ada 002',
			value: 'text-embedding-ada-002',
		},
	],
	routing: {
		send: {
			type: 'body',
			property: 'model',
		},
	},
	default: 'm3e-base',
};

export class EmbeddingsSelf implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Embeddings Self',
		name: 'embeddingsSelf',
		icon: { light: 'file:llm.svg', dark: 'file:llm.svg' },
		documentationUrl: 'https://llm.local.cn/ai',
		credentials: [
			{
				name: 'selfLLMApi',
				required: true,
			},
		],
		group: ['transform'],
		version: [1, 1.1, 1.2],
		description: '使用 Self 统一向量服务接口，支持多种模型',
		defaults: {
			name: 'Embeddings Self',
		},

		codex: {
			categories: ['AI'],
			subcategories: {
				AI: ['Embeddings'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://llm.local.cn/ai',
					},
				],
			},
		},

		inputs: [],

		outputs: [NodeConnectionTypes.AiEmbedding],
		outputNames: ['Embeddings'],
		requestDefaults: {
			ignoreHttpStatusErrors: true,
			baseURL:
				'={{ $parameter.options?.baseURL?.split("/").slice(0,-1).join("/") || $credentials.url?.split("/").slice(0,-1).join("/") || "http://llm.local.cn/ai" }}',
		},
		properties: [
			{
				displayName: 'Connection Hint',
				name: 'connectionHint',
				type: 'notice',
				default: 'This node can be connected to a Vector Store node.',
				displayOptions: {
					show: {
						'@version': [1, 1.1, 1.2],
					},
				},
			},
			{
				...modelParameter,
				default: 'text-embedding-ada-002',
				displayOptions: {
					show: {
						'@version': [1],
					},
				},
			},
			{
				...modelParameter,
				default: 'm3e-base',
				displayOptions: {
					hide: {
						'@version': [1],
					},
				},
			},
			{
				displayName: 'Options',
				name: 'options',
				placeholder: 'Add Option',
				description: 'Additional options to add',
				type: 'collection',
				default: {},
				options: [
					{
						displayName: 'Base URL',
						name: 'baseURL',
						default: 'http://llm.local.cn/ai',
						description: 'Override the default base URL for the API',
						type: 'string',
						displayOptions: {
							hide: {
								'@version': [{ _cnd: { gte: 1.2 } }],
							},
						},
					},
					{
						displayName: 'Batch Size',
						name: 'batchSize',
						default: 512,
						typeOptions: { maxValue: 2048 },
						description: 'Maximum number of documents to send in each request',
						type: 'number',
					},
					{
						displayName: 'Dimensions',
						name: 'dimensions',
						default: 1024,
						description:
							'The number of dimensions the resulting output embeddings should have. Only supported in text-embedding-3 and later models.',
						type: 'options',
						options: [
							{
								name: '256',
								value: 256,
							},
							{
								name: '512',
								value: 512,
							},
							{
								name: '1024',
								value: 1024,
							},
							{
								name: '1536',
								value: 1536,
							},
							{
								name: '3072',
								value: 3072,
							},
						],
					},
					{
						displayName: 'Strip New Lines',
						name: 'stripNewLines',
						default: true,
						description: 'Whether to strip new lines from the input text',
						type: 'boolean',
					},
					{
						displayName: 'Timeout',
						name: 'timeout',
						default: -1,
						description:
							'Maximum amount of time a request is allowed to take in seconds. Set to -1 for no timeout.',
						type: 'number',
					},
				],
			},
		],
	};

	async supplyData(this: ISupplyDataFunctions, itemIndex: number): Promise<SupplyData> {
		this.logger.debug('Supply data for embeddings');
		const credentials = await this.getCredentials('selfLLMApi');

		const options = this.getNodeParameter('options', itemIndex, {}) as {
			baseURL?: string;
			batchSize?: number;
			stripNewLines?: boolean;
			timeout?: number;
			dimensions?: number | undefined;
		};

		if (options.timeout === -1) {
			options.timeout = undefined;
		}

		const configuration: any = {};
		if (options.baseURL) {
			configuration.baseURL = options.baseURL;
		} else if (credentials.url) {
			configuration.baseURL = credentials.url as string;
		} else {
			// 如果没有设置baseURL，使用默认的URL
			configuration.baseURL = 'http://llm.local.cn/ai';
		}
		const embeddings = new SelfEmbeddings({
			model: this.getNodeParameter('model', itemIndex, 'm3e-base') as string,
			apiKey: credentials.apiKey as string,
			baseURL: configuration.baseURL,
			timeout: options.timeout,
			stripNewLines: options.stripNewLines,
			dimensions: options.dimensions,
			batchSize: options.batchSize,
		});
		return {
			response: embeddings,
		};
	}
}

