import { ChatOpenAI, type ClientOptions } from '@langchain/openai';
import {
	NodeConnectionTypes,
	type INodeType,
	type INodeTypeDescription,
	type ISupplyDataFunctions,
	type SupplyData,
} from 'n8n-workflow';


// 定义Self LLM API凭证接口
interface SelfLLMCredential {
	apiKey: string;
}

export class SelfChatLlm implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Self LLM Chat Model',

		name: 'selfChatLlm',
		icon: 'file:llm.svg',
		documentationUrl: 'https://llm.local.cn/ai',
		group: ['transform'],
		version: [1],
		description: 'For advanced usage with an AI chain using Self LLM API',
		defaults: {
			name: 'Self LLM Chat Model',
		},
		codex: {
			categories: ['AI'],
			subcategories: {
				AI: ['Language Models', 'Root Nodes'],
				'Language Models': ['Chat Models (Recommended)'],
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

		outputs: [NodeConnectionTypes.AiLanguageModel],
		outputNames: ['Model'],
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
				displayName:
					'If using JSON response format, you must include word "json" in the prompt in your chain or agent. Also, make sure to select latest models released post November 2023.',
				name: 'notice',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {
						'/options.responseFormat': ['json_object'],
					},
				},
			},
			{
				displayName: 'Model',
				name: 'model',
				type: 'options',
				description:
					'The model which will generate the completion. <a href="https://llm.local.cn/ai">Learn more</a>.',
				options: [
					{ name: 'Anthropic Claude 3 Haiku 20240307 V1:0', value: 'anthropic.claude-3-haiku-20240307-v1:0' },
					{ name: 'Anthropic Claude 3 Opus 20240229 V1:0', value: 'anthropic.claude-3-opus-20240229-v1:0' },
					{ name: 'Anthropic Claude 3 Sonnet 20240229 V1:0', value: 'anthropic.claude-3-sonnet-20240229-v1:0' },
					{ name: 'Anthropic Claude 3.5 Sonnet 20241022 V2:0', value: 'anthropic.claude-3-5-sonnet-20241022-v2:0' },
					{ name: 'Deepseek Chat', value: 'deepseek-chat' },
					{ name: 'Deepseek Coder', value: 'deepseek-coder' },
					{ name: 'Deepseek R1', value: 'deepseek-r1' },
					{ name: 'Doubao Lite 128k', value: 'doubao-lite-128k' },
					{ name: 'Doubao Lite 32k', value: 'doubao-lite-32k' },
					{ name: 'Doubao Pro 128k', value: 'doubao-pro-128k' },
					{ name: 'Doubao Pro 32k Functioncall', value: 'doubao-pro-32k-functioncall' },
					{ name: 'GLM 3 Turbo', value: 'glm-3-turbo' },
					{ name: 'GLM 4 0520', value: 'glm-4-0520' },
					{ name: 'GLM 4 Air', value: 'glm-4-air' },
					{ name: 'GLM 4 Flash', value: 'glm-4-flash' },
					{ name: 'GLM 4 Plus', value: 'glm-4-plus' },
					{ name: 'GLM 4V', value: 'glm-4v' },
					{ name: 'GPT 3.5 Turbo', value: 'gpt-3.5-turbo' },
					{ name: 'GPT 3.5 Turbo 1106', value: 'gpt-3.5-turbo-1106' },
					{ name: 'GPT 3.5 Turbo 16k', value: 'gpt-3.5-turbo-16k' },
					{ name: 'GPT 4', value: 'gpt-4' },
					{ name: 'GPT 4 1106 Preview', value: 'gpt-4-1106-preview' },
					{ name: 'GPT 4 32k', value: 'gpt-4-32k' },
					{ name: 'GPT 4O', value: 'gpt-4o' },
					{ name: 'GPT 4O Mini', value: 'gpt-4o-mini' },
					{ name: 'Kimi K2 0711 Preview', value: 'kimi-k2-0711-preview' },
					{ name: 'Meta Llama Lite', value: 'Meta-Llama-Lite' },
					{ name: 'Meta Llama Plus', value: 'Meta-Llama-Plus' },
					{ name: 'Meta Llama Turbo', value: 'Meta-Llama-Turbo' },
					{ name: 'Mistral Large', value: 'Mistral-Large' },
					{ name: 'Moonshot V1 128k', value: 'moonshot-v1-128k' },
					{ name: 'Moonshot V1 32k', value: 'moonshot-v1-32k' },
					{ name: 'Moonshot V1 8k', value: 'moonshot-v1-8k' },
					{ name: 'O1', value: 'o1' },
					{ name: 'O1 Mini', value: 'o1-mini' },
					{ name: 'O3 Mini', value: 'o3-mini' },
					{ name: 'O3 Pro', value: 'o3-pro' },
					{ name: 'Step 1 128k', value: 'step-1-128k' },
					{ name: 'Step 1 256k', value: 'step-1-256k' },
					{ name: 'Step 1 32k', value: 'step-1-32k' },
					{ name: 'Step 1 8k', value: 'step-1-8k' },
					{ name: 'Step 1V 32k', value: 'step-1v-32k' },
					{ name: 'Step 1V 8k', value: 'step-1v-8k' }
				],
				routing: {
					send: {
						type: 'body',
						property: 'model',
					},
				},
				default: 'step-1-128k',
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
						displayName: 'Frequency Penalty',
						name: 'frequencyPenalty',
						default: 0,
						typeOptions: { maxValue: 2, minValue: -2, numberPrecision: 1 },
						description:
							"Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim",
						type: 'number',
					},
					{
						displayName: 'Max Retries',
						name: 'maxRetries',
						default: 2,
						description: 'Maximum number of retries to attempt',
						type: 'number',
					},
					{
						displayName: 'Maximum Number of Tokens',
						name: 'maxTokens',
						default: -1,
						description:
							'The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 32,768).',
						type: 'number',
						typeOptions: {
							maxValue: 32768,
						},
					},
					{
						displayName: 'Presence Penalty',
						name: 'presencePenalty',
						default: 0,
						typeOptions: { maxValue: 2, minValue: -2, numberPrecision: 1 },
						description:
							"Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics",
						type: 'number',
					},
					{
						displayName: 'Response Format',
						name: 'responseFormat',
						default: 'text',
						type: 'options',
						options: [
							{
								name: 'Text',
								value: 'text',
								description: 'Regular text response',
							},
							{
								name: 'JSON',
								value: 'json_object',
								description:
									'Enables JSON mode, which should guarantee the message the model generates is valid JSON',
							},
						],
					},
					{
						displayName: 'Sampling Temperature',
						name: 'temperature',
						default: 0.7,
						typeOptions: { maxValue: 2, minValue: 0, numberPrecision: 1 },
						description:
							'Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive.',
						type: 'number',
					},
					{
						displayName: 'Timeout',
						name: 'timeout',
						default: 360000,
						description: 'Maximum amount of time a request is allowed to take in milliseconds',
						type: 'number',
					},
					{
						displayName: 'Top P',
						name: 'topP',
						default: 1,
						typeOptions: { maxValue: 1, minValue: 0, numberPrecision: 1 },
						description:
							'Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered. We generally recommend altering this or temperature but not both.',
						type: 'number',
					},
				],
			},
		],
	};

	async supplyData(this: ISupplyDataFunctions, itemIndex: number): Promise<SupplyData> {
		const credentials = await this.getCredentials<SelfLLMCredential>('selfLLMApi');

		const modelName = this.getNodeParameter('model', itemIndex) as string;

		const options = this.getNodeParameter('options', itemIndex, {}) as {
			frequencyPenalty?: number;
			maxTokens?: number;
			maxRetries: number;
			timeout: number;
			presencePenalty?: number;
			temperature?: number;
			topP?: number;
			responseFormat?: 'text' | 'json_object';
		};

		const configuration: ClientOptions = {
			baseURL: 'http://llm.local.cn/ai',
		};

		const model = new ChatOpenAI({
			openAIApiKey: credentials.apiKey,
			model: modelName,
			...options,
			timeout: options.timeout ?? 60000,
			maxRetries: options.maxRetries ?? 2,
			configuration,

			modelKwargs: options.responseFormat
				? {
						response_format: { type: options.responseFormat },
					}
				: undefined,

		});

		return {
			response: model,
		};
	}
}
