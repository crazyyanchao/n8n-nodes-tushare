import type { DynamicStructuredTool} from '@langchain/core/tools';
import { type IDataObject, type INodeExecutionData } from 'n8n-workflow';

import { convertObjectBySchema } from './convertToSchema';

export async function executeTool(tool: DynamicStructuredTool, query: string | object): Promise<INodeExecutionData> {
	let convertedQuery: string | object = query;
	if ('schema' in tool && tool.schema) {
		convertedQuery = convertObjectBySchema(query, tool.schema);
	}
	console.log('tool', tool);
	console.log('query', query);
	console.log('convertedQuery', convertedQuery);
	const result = await tool.invoke(convertedQuery);

	const data = {
		json: result as IDataObject,
	};
	return data;
}
