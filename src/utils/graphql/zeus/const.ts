/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	Query:{
		hello:{

		},
		getOnLineLoginUserList:{

		},
		getMenuTree:{

		},
		getMenuList:{

		},
		getRoleList:{

		},
		getUserList:{

		},
		getPostTagList:{

		}
	},
	DateTime: `scalar.DateTime` as const,
	UserGenderEnum: "enum" as const,
	JSONObject: `scalar.JSONObject` as const,
	Mutation:{
		login:{

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

		},
		makeBucket:{

		},
		createPostTag:{
			input:"CreatePostTagInput"
		},
		editPostTag:{
			input:"EditPostTagInput"
		},
		removePostTags:{

		}
	},
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
	CreatePostTagInput:{

	},
	EditPostTagInput:{

	}
}

export const ReturnTypes: Record<string,any> = {
	Query:{
		hello:"String",
		me:"LoginUser",
		getOnLineLoginUserList:"OnLineUser",
		allMenuList:"Menu",
		getMenuTree:"JSONObject",
		getMenuList:"MenuPageResult",
		getRoleList:"RolePageResult",
		getUserList:"UserPageResult",
		listBuckets:"BucketInfo",
		getPostTagList:"PostTagPageResult"
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
	Menu:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		name:"String",
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
	OnLineUser:{
		username:"String",
		loginBrowser:"String",
		loginIp:"String",
		loginTime:"String",
		loginAddr:"String",
		token:"String"
	},
	JSONObject: `scalar.JSONObject` as const,
	MenuPageResult:{
		data:"Menu",
		totalCount:"Float",
		hasNextPage:"Boolean"
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
	BucketInfo:{
		name:"String",
		creationDate:"String"
	},
	PostTagPageResult:{
		data:"PostTag",
		totalCount:"Float",
		hasNextPage:"Boolean"
	},
	PostTag:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		name:"String",
		icon:"String",
		thumbnail:"String"
	},
	Mutation:{
		login:"LoginResult",
		logout:"BaseResponse",
		createMenu:"BaseResponse",
		editMenu:"BaseResponse",
		removeMenus:"BaseResponse",
		createRole:"BaseResponse",
		editRole:"BaseResponse",
		removeRoles:"BaseResponse",
		createUser:"BaseResponse",
		editUser:"BaseResponse",
		removeUsers:"BaseResponse",
		resetUserPassword:"BaseResponse",
		makeBucket:"BaseResponse",
		createPostTag:"BaseResponse",
		editPostTag:"BaseResponse",
		removePostTags:"BaseResponse"
	},
	LoginResult:{
		code:"Float",
		msg:"String",
		data:"LoginType"
	},
	LoginType:{
		accessToken:"String"
	},
	BaseResponse:{
		code:"Float",
		msg:"String"
	},
	BaseResult:{
		"...on BaseResponse": "BaseResponse",
		code:"Float",
		msg:"String"
	}
}

export const Ops = {
query: "Query" as const,
	mutation: "Mutation" as const
}