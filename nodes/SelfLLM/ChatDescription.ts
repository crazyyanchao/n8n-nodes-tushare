import type { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { sendErrorPostReceive } from './GenericFunctions';

export const chatOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['chat'],
			},
		},
		options: [
			{
				name: 'Complete',
				value: 'complete',
				action: 'Create chat completion',
				description: 'Creates a model response for the given chat conversation',

				routing: {
					request: {
						method: 'POST',
						url: '/chat/completions',
					},
					output: { postReceive: [sendErrorPostReceive] },
				}
			}
		],
		default: 'complete',
	},
];

const completeOperations: INodeProperties[] = [
	{
		displayName: 'Model',
		name: 'model',
		type: 'options',
		description:
			'The model which will generate the completion. <a href="https://llm.local.cn/ai">Learn more</a>.',
		displayOptions: {
			show: {
				resource: ['chat'],
			},
		},
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
	// Prompt
	{
		displayName: 'Prompt',
		name: 'prompt',
		type: 'fixedCollection',
		typeOptions: {
			sortable: true,
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['chat']
			},
		},
		placeholder: 'Add Message',
		default: {},
		options: [
			{
				displayName: 'Messages',
				name: 'messages',
				values: [
					{
						displayName: 'Role',
						name: 'role',
						type: 'options',
						options: [
							{
								name: 'Assistant',
								value: 'assistant',
							},
							{
								name: 'System',
								value: 'system',
							},
							{
								name: 'User',
								value: 'user',
							},
						],
						default: 'user',
					},
					{
						displayName: 'Content',
						name: 'content',
						type: 'string',
						default: '',
					},
				],
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'messages',
				value: '={{ $value.messages }}',
			},
		},
	},
];

const sharedOperations: INodeProperties[] = [
	// Simplify
	{
		displayName: 'Simplify',
		name: 'simplifyOutput',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['chat'],
			},
		},
		routing: {
			output: {
				postReceive: [
					{
						type: 'set',
						enabled: '={{$value}}',
						properties: {
							value: '={{ { "data": $response.body.choices } }}',
						},
					},
					{
						type: 'rootProperty',
						enabled: '={{$value}}',
						properties: {
							property: 'data',
						},
					},
					async function (items: INodeExecutionData[]): Promise<INodeExecutionData[]> {
						if (this.getNode().parameters.simplifyOutput === false) {
							return items;
						}
						return items.map((item) => {
							return {
								json: {
									...item.json,
									message: item.json.message,
								},
							};
						});
					},
				],
			},
		},
		description: 'Whether to return a simplified version of the response instead of the raw data',
	},
	// Options
	{
		displayName: 'Options',
		name: 'options',
		placeholder: 'Add Option',
		description: 'Additional options to add',
		type: 'collection',
		default: {},
		displayOptions: {
			show: {
				resource: ['chat']
			},
		},
		options: [
			{
				displayName: 'Frequency Penalty',
				name: 'frequency_penalty',
				default: 0,
				typeOptions: { maxValue: 2, minValue: -2, numberPrecision: 1 },
				description:
					"Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim",
				type: 'number',
				routing: {
					send: {
						type: 'body',
						property: 'frequency_penalty',
					},
				},
			},
			{
				displayName: 'Logprobs',
				name: 'logprobs',
				type: 'boolean',
				description: 'Whether to return log probabilities of the output tokens or not. If true, returns the log probabilities of each output token returned in the content of message.',
				default: false,
				displayOptions: {
					show: {
						'/operation': ['complete'],
					},
				},
				routing: {
					send: {
						type: 'body',
						property: 'logprobs',
					},
				},
			},
			{
				displayName: 'Maximum Number of Tokens',
				name: 'maxTokens',
				default: 16,
				description:
					'The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 32,768).',
				type: 'number',
				displayOptions: {
					show: {
						'/operation': ['complete'],
					},
				},
				typeOptions: {
					maxValue: 32768,
				},
				routing: {
					send: {
						type: 'body',
						property: 'max_tokens',
					},
				},
			},
			{
				displayName: 'Presence Penalty',
				name: 'presence_penalty',
				default: 0,
				typeOptions: { maxValue: 2, minValue: -2, numberPrecision: 1 },
				description:
					"Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics",
				type: 'number',
				routing: {
					send: {
						type: 'body',
						property: 'presence_penalty',
					},
				},
			},
			{
				displayName: 'Response Format',
				name: 'response_format',
				type: 'json',
				default: '',
				description: 'An object specifying the format that the model must output',
				displayOptions: {
					show: {
						'/operation': ['complete'],
					},
				},
				routing: {
					send: {
						type: 'body',
						property: 'response_format',
					}
				},
			},
			{
				displayName: 'Sampling Temperature',
				name: 'temperature',
				default: 1,
				typeOptions: { maxValue: 1, minValue: 0, numberPrecision: 1 },
				description:
					'Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive.',
				type: 'number',
				routing: {
					send: {
						type: 'body',
						property: 'temperature',
					},
				},
			},
			{
				displayName: 'Top Logprobs',
				name: 'top_logprobs',
				type: 'number',
				default: null,
				typeOptions: { maxValue: 20, minValue: 0, numberPrecision: 1 },
				description: 'An integer between 0 and 20 specifying the number of most likely tokens to return at each token position, each with an associated log probability. logprobs must be set to true if this parameter is used.',
				displayOptions: {
					show: {
						'/operation': ['complete'],
					},
				},
				routing: {
					send: {
						type: 'body',
						property: 'top_logprobs',
					},
				}
			},
			{
				displayName: 'Top P',
				name: 'topP',
				default: 1,
				typeOptions: { maxValue: 1, minValue: 0, numberPrecision: 1 },
				description:
					'Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered. We generally recommend altering this or temperature but not both.',
				type: 'number',
				routing: {
					send: {
						type: 'body',
						property: 'top_p',
					},
				},
			},
		],
	},
];

export const chatFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                               chat:complete                        */
	/* -------------------------------------------------------------------------- */
	...completeOperations,

	/* -------------------------------------------------------------------------- */
	/*                                chat:ALL                                    */
	/* -------------------------------------------------------------------------- */
	...sharedOperations,
];
