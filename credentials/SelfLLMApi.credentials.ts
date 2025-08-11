import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class SelfLLMApi implements ICredentialType {
	name = 'selfLLMApi';

	displayName = 'Self LLM API';

	icon: Icon = { light: 'file:llm.svg', dark: 'file:llm.svg' };

	documentationUrl = 'https://llm.local.cn/ai';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		}
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}'
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'http://llm.local.cn/ai', // https://api.deepseek.com
			url: '',
			method: 'POST',
			body: {
				api_name: 'wd_a_desc',
				token: '={{$credentials.apiKey}}',
				params: {
                    offset: 0,
					limit: 10
				},
				fields: 'code,trade_code,name,compname,compnameeng,isincode,exchmarket,listboard,list_date,delist_date,crncy_code,pinyin,listboardname,is_shsc,compcode',
			},
		},
	};
}
