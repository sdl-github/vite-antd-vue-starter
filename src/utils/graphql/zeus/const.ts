/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	Query:{
		getOnLineLoginUserList:{

		},
		getOauthUrl:{

		},
		hello:{

		},
		queryMenuList:{

		},
		queryMenuTree:{

		},
		queryRolePage:{

		},
		queryUserPage:{

		},
		querySpaceMenu:{

		},
		queryPost:{

		}
	},
	DateTime: `scalar.DateTime` as const,
	UserGenderEnum: "enum" as const,
	JSONObject: `scalar.JSONObject` as const,
	Mutation:{
		login:{

		},
		forceUserLogout:{

		},
		createMenu:{
			input:"CreateMenuInput"
		},
		updateMenu:{
			input:"EditMenuInput"
		},
		deleteMenus:{

		},
		createRole:{
			input:"CreateRoleInput"
		},
		updateRole:{
			input:"EditRoleInput"
		},
		deleteRoles:{

		},
		createUser:{
			input:"CreateUserInput"
		},
		updateUser:{
			input:"EditUserInput"
		},
		deleteUsers:{

		},
		resetUserPassword:{

		},
		initSpace:{

		},
		createSpace:{

		},
		createSpaceMenu:{
			input:"CreateSpaceMenuInput"
		},
		moveSpaceMenuToRecycleBin:{

		},
		delSpaceMenu:{

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
	CreateSpaceMenuInput:{

	}
}

export const ReturnTypes: Record<string,any> = {
	Query:{
		userInfo:"LoginUser",
		getOnLineLoginUserList:"OnLineUser",
		getOauthUrl:"String",
		hello:"String",
		queryMenuList:"Menu",
		queryMenuTree:"JSONObject",
		queryRolePage:"RolePageResult",
		queryUserPage:"UserPageResult",
		querySpace:"Space",
		querySpaceMenu:"SpaceMenu",
		queryPost:"Post"
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
	OnLineUser:{
		username:"String",
		loginBrowser:"String",
		loginIp:"String",
		loginTime:"String",
		loginAddr:"String",
		token:"String"
	},
	JSONObject: `scalar.JSONObject` as const,
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
	Space:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		name:"String",
		spaceMenus:"SpaceMenu"
	},
	SpaceMenu:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		title:"String",
		icon:"String",
		iconType:"String",
		pId:"String",
		order:"Float",
		post:"Post"
	},
	Post:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		title:"String",
		currentVersionId:"String",
		lock:"Boolean",
		lockPwd:"String",
		postVersions:"PostVersion",
		currentContent:"String"
	},
	PostVersion:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		content:"String",
		version:"String"
	},
	Mutation:{
		login:"LoginResult",
		logout:"BaseResponse",
		forceUserLogout:"BaseResponse",
		createMenu:"BaseResponse",
		updateMenu:"BaseResponse",
		deleteMenus:"BaseResponse",
		createRole:"BaseResponse",
		updateRole:"BaseResponse",
		deleteRoles:"BaseResponse",
		createUser:"BaseResponse",
		updateUser:"BaseResponse",
		deleteUsers:"BaseResponse",
		resetUserPassword:"BaseResponse",
		initSpace:"Space",
		createSpace:"Space",
		createSpaceMenu:"SpaceMenu",
		moveSpaceMenuToRecycleBin:"Boolean",
		delSpaceMenu:"Boolean"
	},
	LoginResult:{
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