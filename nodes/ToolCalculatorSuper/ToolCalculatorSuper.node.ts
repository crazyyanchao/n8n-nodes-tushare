import { Calculator } from '@langchain/community/tools/calculator';
import {
	NodeConnectionTypes,
	type INodeType,
	type INodeTypeDescription,
	type ISupplyDataFunctions,
	type SupplyData,
} from 'n8n-workflow';

export class ToolCalculatorSuper implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'CalculatorSuper',
		name: 'toolCalculatorSuper',
		icon: 'fa:calculator',
		iconColor: 'black',
		group: ['transform'],
		version: 1,
		description: 'Make it easier for AI agents to perform arithmetic',
		defaults: {
			name: 'CalculatorSuper',
		},
		codex: {
			categories: ['AI'],
			subcategories: {
				AI: ['Tools'],
				Tools: ['Other Tools'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolcalculator/',
					},
				],
			},
		},

		inputs: [],

		outputs: [NodeConnectionTypes.AiTool],
		outputNames: ['Tool'],
		properties: [
			{
				displayName: 'Connection Hint',
				name: 'connectionHint',
				type: 'notice',
				default: 'This tool can be connected to an AI Agent node.',
			},
		],
	};

	async supplyData(this: ISupplyDataFunctions): Promise<SupplyData> {
		return {
			response: new Calculator(),
		};
	}
}
