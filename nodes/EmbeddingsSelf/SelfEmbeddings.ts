import { Embeddings } from '@langchain/core/embeddings';

export interface SelfEmbeddingsFields {
	apiKey?: string;
	baseURL?: string;
	model?: string;
	timeout?: number;
	stripNewLines?: boolean;
	dimensions?: number;
	batchSize?: number;
}

export class SelfEmbeddings extends Embeddings {
	apiKey: string;

	baseURL: string;

	model: string;

	timeout?: number;

	stripNewLines: boolean;

	dimensions?: number;

	batchSize: number;

	constructor(fields: SelfEmbeddingsFields) {
		super({ maxConcurrency: 1, ...fields });

		this.apiKey = fields.apiKey ?? '';
		this.baseURL = fields.baseURL ?? 'http://llm.local.cn/ai';
		this.model = fields.model ?? 'm3e-base';
		this.timeout = fields.timeout;
		this.stripNewLines = fields.stripNewLines ?? true;
		this.dimensions = fields.dimensions;
		this.batchSize = fields.batchSize ?? 1000;
	}

	/**
	 * 嵌入单个查询文本
	 */
	async embedQuery(text: string): Promise<number[]> {
		const embeddings = await this.embedDocuments([text]);
		return embeddings[0];
	}

	/**
	 * 嵌入多个文档
	 */
	async embedDocuments(texts: string[]): Promise<number[][]> {
		const results: number[][] = [];

		// 按批次处理文本
		for (let i = 0; i < texts.length; i += this.batchSize) {
			const batch = texts.slice(i, i + this.batchSize);
			const batchResults = await this.embedBatch(batch);
			results.push(...batchResults);
		}
		return results;
	}

	/**
	 * 嵌入单个批次
	 */
	private async embedBatch(texts: string[]): Promise<number[][]> {
		// 预处理文本
		const processedTexts = texts.map(text =>
			this.stripNewLines ? text.replace(/\n/g, ' ') : text
		);
		// console.log('processedTexts', processedTexts);
		try {
			const response = await fetch(`${this.baseURL}/embeddings`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${this.apiKey}`,
				},
				body: JSON.stringify({
					input: processedTexts,
					texts: processedTexts,
					model: this.model,
					...(this.dimensions && { dimensions: this.dimensions }),
				}),
				...(this.timeout && { signal: AbortSignal.timeout(this.timeout * 1000) }),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json() as any;
			// console.log('response', data);

			// 处理响应数据
			if (data.data && Array.isArray(data.data)) {
				return data.data.map((item: any) => item.embedding);
			} else if (data.embeddings && Array.isArray(data.embeddings)) {
				return data.embeddings;
			} else {
				throw new Error('Invalid response format from Self API');
			}
		} catch (error) {
			throw new Error(`Failed to embed documents: ${error instanceof Error ? error.message : String(error)}`);
		}
	}

}
