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
		queryFilePage:{

		},
		querySpaceMenu:{

		},
		queryPostPage:{

		},
		queryPost:{

		},
		queryTagPage:{

		},
		queryTagList:{

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
		delFile:{

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

		},
		updateSpaceMenuTitle:{

		},
		updateSpaceMenu:{
			input:"UpdateSpaceMenuInput"
		},
		updatePostVersion:{

		},
		publishPost:{
			input:"PublishPostInput"
		},
		unPublishPost:{

		},
		starPost:{

		},
		unStarPost:{

		},
		createTag:{
			input:"CreateTagInput"
		},
		updateTag:{
			input:"UpdateTagInput"
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

	},
	UpdateSpaceMenuInput:{

	},
	PublishPostInput:{

	},
	CreateTagInput:{

	},
	UpdateTagInput:{

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
		queryFilePage:"FilePageResult",
		querySpace:"Space",
		querySpaceMenu:"SpaceMenu",
		queryPostPage:"PostPageResult",
		queryPost:"Post",
		queryTagPage:"TagPageResult",
		queryTagList:"Tag"
	},
	LoginUser:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		createdBy:"String",
		updatedBy:"String",
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
		createdBy:"String",
		updatedBy:"String",
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
		createdBy:"String",
		updatedBy:"String",
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
		createdBy:"String",
		updatedBy:"String",
		username:"String",
		avatar:"String",
		gender:"UserGenderEnum",
		email:"String",
		nickname:"String",
		phone:"String",
		note:"String",
		roles:"Role"
	},
	FilePageResult:{
		data:"File",
		totalCount:"Float",
		hasNextPage:"Boolean"
	},
	File:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		createdBy:"String",
		updatedBy:"String",
		fileName:"String",
		originalName:"String",
		hash:"String",
		mimeType:"String",
		encoding:"String",
		size:"Float",
		url:"String",
		bucket:"String",
		provider:"String",
		category:"String"
	},
	Space:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		createdBy:"String",
		updatedBy:"String",
		name:"String",
		spaceMenus:"SpaceMenu"
	},
	SpaceMenu:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		createdBy:"String",
		updatedBy:"String",
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
		createdBy:"String",
		updatedBy:"String",
		title:"String",
		currentVersionId:"String",
		description:"String",
		lock:"Boolean",
		star:"Float",
		see:"Float",
		lockPwd:"Boolean",
		published:"Boolean",
		postVersions:"PostVersion",
		currentContent:"String",
		tags:"Tag",
		user:"User",
		menu:"SpaceMenu",
		postUserStars:"PostUserStar"
	},
	PostVersion:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		createdBy:"String",
		updatedBy:"String",
		content:"String",
		version:"String"
	},
	Tag:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		createdBy:"String",
		updatedBy:"String",
		name:"String",
		icon:"String",
		order:"Float"
	},
	PostUserStar:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		createdBy:"String",
		updatedBy:"String",
		userId:"String",
		postId:"String"
	},
	PostPageResult:{
		data:"Post",
		totalCount:"Float",
		hasNextPage:"Boolean"
	},
	TagPageResult:{
		data:"Tag",
		totalCount:"Float",
		hasNextPage:"Boolean"
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
		delFile:"Boolean",
		initSpace:"Space",
		createSpace:"Space",
		createSpaceMenu:"SpaceMenu",
		moveSpaceMenuToRecycleBin:"Boolean",
		delSpaceMenu:"Boolean",
		updateSpaceMenuTitle:"SpaceMenu",
		updateSpaceMenu:"SpaceMenu",
		updatePostVersion:"PostVersion",
		publishPost:"Post",
		unPublishPost:"Post",
		starPost:"Boolean",
		unStarPost:"Boolean",
		createTag:"Tag",
		updateTag:"Tag"
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