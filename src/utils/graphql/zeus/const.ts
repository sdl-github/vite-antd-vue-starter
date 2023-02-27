/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	DateTime: `scalar.DateTime` as const,
	UserGenderEnum: "enum" as const,
	CreateMenuInput:{

	},
	EditMenuInput:{

	},
	CreateRoleInput:{

	},
	EditRoleInput:{

	},
	CreateUserInput:{
		gender:"UserGenderEnum"
	},
	EditUserInput:{
		gender:"UserGenderEnum"
	},
	Query:{
		getOnLineLoginUserList:{

		},
		getOauthUrl:{

		},
		hello:{

		},
		getMenuTree:{

		},
		getMenuList:{

		},
		queryRolePage:{

		},
		queryUserPage:{

		}
	},
	JSONObject: `scalar.JSONObject` as const,
	Mutation:{
		login:{

		},
		forceUserLogout:{

		},
		createMenu:{
			input:"CreateMenuInput"
		},
		editMenu:{
			input:"EditMenuInput"
		},
		removeMenus:{

		},
		createRole:{
			input:"CreateRoleInput"
		},
		editRole:{
			input:"EditRoleInput"
		},
		removeRoles:{

		},
		createUser:{
			input:"CreateUserInput"
		},
		editUser:{
			input:"EditUserInput"
		},
		removeUsers:{

		},
		resetUserPassword:{

		}
	}
}

export const ReturnTypes: Record<string,any> = {
	Menu:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		name:"String",
		title:"String",
		icon:"String",
		pId:"String",
		orderBy:"Float",
		path:"String",
		component:"String",
		visible:"Boolean",
		permission:"String",
		type:"String",
		children:"Menu"
	},
	DateTime: `scalar.DateTime` as const,
	Role:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		name:"String",
		level:"Float",
		key:"String",
		isDefault:"Boolean",
		menus:"Menu"
	},
	User:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		username:"String",
		avatar:"String",
		gender:"UserGenderEnum",
		email:"String",
		nickname:"String",
		phone:"String",
		note:"String",
		roles:"Role"
	},
	LoginUser:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		username:"String",
		avatar:"String",
		gender:"UserGenderEnum",
		email:"String",
		nickname:"String",
		phone:"String",
		note:"String",
		roles:"Role",
		loginTime:"DateTime",
		menus:"Menu",
		permissions:"String",
		isSuperAdmin:"Boolean"
	},
	OnLineUser:{
		username:"String",
		loginBrowser:"String",
		loginIp:"String",
		loginTime:"String",
		loginAddr:"String",
		token:"String"
	},
	BaseResponse:{
		code:"Float",
		msg:"String"
	},
	LoginResult:{
		accessToken:"String"
	},
	RolePageResult:{
		data:"Role",
		totalCount:"Float",
		hasNextPage:"Boolean"
	},
	UserPageResult:{
		data:"User",
		totalCount:"Float",
		hasNextPage:"Boolean"
	},
	MenuPageResult:{
		data:"Menu",
		totalCount:"Float",
		hasNextPage:"Boolean"
	},
	BaseResult:{
		"...on BaseResponse": "BaseResponse",
		code:"Float",
		msg:"String"
	},
	Query:{
		userInfo:"LoginUser",
		getOnLineLoginUserList:"OnLineUser",
		getOauthUrl:"String",
		hello:"String",
		allMenuList:"Menu",
		getMenuTree:"JSONObject",
		getMenuList:"MenuPageResult",
		queryRolePage:"RolePageResult",
		queryUserPage:"UserPageResult"
	},
	JSONObject: `scalar.JSONObject` as const,
	Mutation:{
		login:"LoginResult",
		logout:"BaseResponse",
		forceUserLogout:"BaseResponse",
		createMenu:"BaseResponse",
		editMenu:"BaseResponse",
		removeMenus:"BaseResponse",
		createRole:"BaseResponse",
		editRole:"BaseResponse",
		removeRoles:"BaseResponse",
		createUser:"BaseResponse",
		editUser:"BaseResponse",
		removeUsers:"BaseResponse",
		resetUserPassword:"BaseResponse"
	}
}

export const Ops = {
query: "Query" as const,
	mutation: "Mutation" as const
}