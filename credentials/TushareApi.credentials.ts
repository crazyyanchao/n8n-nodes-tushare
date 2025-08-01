import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TushareApi implements ICredentialType {
	name = 'tushareApi';
	displayName = 'Tushare API';
	documentationUrl = 'http://api.tushare.pro';
	properties: INodeProperties[] = [
		{
			displayName: 'Token',
			name: 'token',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			},
			description: 'Your Tushare API token',
		},
	];

	// 这允许凭据被 n8n 的其他部分使用
	// 说明此凭据如何作为请求的一部分被注入
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Content-Type': 'application/json',
			},
		},
	};

	// 下面的块告诉如何测试此凭据
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'http://api.tushare.pro',
			url: '',
			method: 'POST',
			body: {
				api_name: 'stock_company',
				token: '={{$credentials.token}}',
				params: {
                    offset: 0,
					limit: 10
				},
				fields: 'ts_code,com_name,com_id,chairman,manager,secretary,reg_capital,setup_date,province,city,introduction,website,email,office,business_scope,employees,main_business,exchange',
			},
		},
	};
} 