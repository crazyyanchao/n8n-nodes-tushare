import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ExampleCredentialsApi implements ICredentialType {
	name = 'exampleCredentialsApi';
	displayName = 'Example Credentials API';

	documentationUrl = 'https://your-docs-url';

	properties: INodeProperties[] = [
		// 从用户获取并加密保存的凭据
		// 属性可以以与节点属性完全相同的方式定义
		{
			displayName: 'User Name',
			name: 'username',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];

	// 此凭据目前没有被任何节点直接使用
	// 但 HTTP Request 节点可以使用它来发出请求
	// 由于下面的 `test` 属性，此凭据也是可测试的
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				username: '={{ $credentials.username }}',
				password: '={{ $credentials.password }}',
			},
			qs: {
				// 作为查询字符串的一部分发送
				n8n: 'rocks',
			},
		},
	};

	// 下面的块告诉如何测试此凭据
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://example.com/',
			url: '',
		},
	};
}
