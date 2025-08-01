import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

export class Tushare implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Tushare',
		name: 'tushare',
		icon: { light: 'file:tushare.svg', dark: 'file:tushare.svg' },
		group: ['transform'],
		version: 1,
		description: 'Interact with Tushare API',
		defaults: {
			name: 'Tushare',
		},
		credentials: [
			{
				name: 'tushareApi',
				required: true,
			},
		],
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: 'API Name',
				name: 'apiName',
				type: 'string',
				default: '',
				placeholder: 'e.g., stock_company',
				description: 'The API name to call',
				required: true,
			},
			{
				displayName: 'Input Params',
				name: 'params',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: false,
				},
				default: {},
				description: 'Parameters to pass to the API',
				options: [
					{
						displayName: 'Parameters',
						name: 'parameters',
						values: [
							{
								displayName: 'Input Mode',
								name: 'inputMode',
								type: 'options',
								options: [
									{
										name: 'JSON Dictionary',
										value: 'json',
									},
									{
										name: 'Individual Parameters',
										value: 'individual',
									},
								],
								default: 'individual',
								description: 'Choose how to input parameters',
							},
							{
								displayName: 'JSON Parameters',
								name: 'jsonParams',
								type: 'json',
								default: '{}',
								description: 'Parameters as JSON object',
								displayOptions: {
									show: {
										inputMode: ['json'],
									},
								},
							},
							{
								displayName: 'Parameters',
								name: 'individualParams',
								type: 'fixedCollection',
								typeOptions: {
									multipleValues: true,
								},
								default: {},
								description: 'Add parameters one by one',
								displayOptions: {
									show: {
										inputMode: ['individual'],
									},
								},
								options: [
									{
										displayName: 'Parameter',
										name: 'parameter',
										values: [
											{
												displayName: 'Key',
												name: 'key',
												type: 'string',
												default: '',
												description: 'Parameter name',
											},
											{
												displayName: 'Value',
												name: 'value',
												type: 'string',
												default: '',
												description: 'Parameter value',
											},
										],
									},
								],
							},
						],
					},
				],
			},
			{
				displayName: 'Return Fields',
				name: 'fields',
				type: 'string',
				default: '',
				placeholder: 'e.g., ts_code,name,area,industry...',
				description: 'Comma-separated list of fields to return (leave empty for all fields)',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				options: [
					{
						displayName: 'Timeout',
						name: 'timeout',
						type: 'number',
						default: 30000,
						description: 'Request timeout in milliseconds',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const apiName = this.getNodeParameter('apiName', itemIndex, '') as string;
				const fields = this.getNodeParameter('fields', itemIndex, '') as string;
				const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as {
					timeout?: number;
				};
				const paramsCollection = this.getNodeParameter('params', itemIndex, {}) as {
					parameters?: {
						inputMode?: string;
						jsonParams?: string;
						individualParams?: {
							parameter?: Array<{ key: string; value: string }>;
						};
					};
				};

				// Build parameters object
				const params: Record<string, any> = {};
				if (paramsCollection.parameters) {
					const { inputMode, jsonParams, individualParams } = paramsCollection.parameters;
					
					if (inputMode === 'json' && jsonParams) {
						try {
							const jsonParamsObj = JSON.parse(jsonParams);
							Object.assign(params, jsonParamsObj);
						} catch (error) {
							throw new NodeOperationError(this.getNode(), 'Invalid JSON parameters', {
								itemIndex,
							});
						}
					} else if (inputMode === 'individual' && individualParams?.parameter) {
						for (const param of individualParams.parameter) {
							if (param.key && param.value !== undefined) {
								params[param.key] = param.value;
							}
						}
					}
				}

				// Prepare request body
				const requestBody = {
					api_name: apiName,
					token: (await this.getCredentials('tushareApi')).token,
					params,
					fields: fields || '',
				};

				// Make API request
				const response = await this.helpers.httpRequest({
					method: 'POST',
					url: 'http://api.tushare.pro',
					headers: {
						'Content-Type': 'application/json',
					},
					body: requestBody,
					timeout: additionalFields.timeout || 30000,
				});

				// Add response to return data
				const newItem: INodeExecutionData = {
					json: response,
					pairedItem: itemIndex,
				};

				returnData.push(newItem);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: this.getInputData(itemIndex)[0].json,
						error,
						pairedItem: itemIndex,
					});
				} else {
					if (error.context) {
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return [returnData];
	}
} 