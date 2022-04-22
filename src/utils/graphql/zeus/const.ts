/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	Query:{
		hello:{

		},
		getMenuList:{

		},
		getRoleList:{

		},
		getUserList:{

		}
	},
	DateTime: "String",
	UserGenderEnum: true,
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
	}
}

export const ReturnTypes: Record<string,any> = {
	Query:{
		hello:"String",
		me:"LoginUser",
		getMenuTree:"Menu",
		getMenuList:"MenuPageResult",
		getRoleList:"RolePageResult",
		getUserList:"UserPageResult"
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
		removeUsers:"BaseResponse"
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