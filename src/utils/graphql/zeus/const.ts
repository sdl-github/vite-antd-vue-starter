/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	CreatePointInputInput:{

	},
	Direction: "enum" as const,
	FileProviderEnum: "enum" as const,
	FileQueryPageParamInput:{
		provider:"FileProviderEnum"
	},
	GenderEnum: "enum" as const,
	LocalDateTime: `scalar.LocalDateTime` as const,
	LoginInputInput:{

	},
	Long: `scalar.Long` as const,
	MenuCreateInputInput:{
		type:"MenuTypeEnum"
	},
	MenuQueryPageParamInput:{

	},
	MenuQueryParamInput:{
		type:"MenuTypeEnum"
	},
	MenuTypeEnum: "enum" as const,
	MenuUpdateInputInput:{
		type:"MenuTypeEnum"
	},
	Mutation:{
		deleteMenu:{

		},
		createMenu:{
			input:"MenuCreateInputInput"
		},
		updateRole:{
			input:"RoleUpdateInputInput"
		},
		deletePoint:{

		},
		revoke:{

		},
		createRole:{
			input:"RoleCreateInputInput"
		},
		updateUser:{
			input:"UserUpdateInputInput"
		},
		createPoint:{
			input:"CreatePointInputInput"
		},
		deleteRole:{

		},
		updateMenu:{
			input:"MenuUpdateInputInput"
		},
		registerUser:{
			input:"UserRegisterInputInput"
		},
		loginByAccount:{
			input:"LoginInputInput"
		},
		deleteUser:{

		},
		createUser:{
			input:"UserCreateInputInput"
		},
		updatePoint:{
			input:"UpdatePointInputInput"
		},
		deleteFileById:{

		}
	},
	NullHandling: "enum" as const,
	Query:{
		queryMenuList:{
			param:"MenuQueryParamInput"
		},
		queryRole:{

		},
		queryUserPage:{
			param:"UserQueryParamInput"
		},
		queryPointPage:{
			param:"QueryPointPageParamInput"
		},
		queryFilePage:{
			param:"FileQueryPageParamInput"
		},
		queryMenuTree:{
			param:"MenuQueryPageParamInput"
		},
		queryUser:{

		},
		queryRolePage:{
			param:"RoleQueryParamInput"
		}
	},
	QueryPointPageParamInput:{

	},
	RoleCreateInputInput:{

	},
	RoleQueryParamInput:{

	},
	RoleUpdateInputInput:{

	},
	UpdatePointInputInput:{

	},
	UserCreateInputInput:{
		gender:"GenderEnum"
	},
	UserQueryParamInput:{

	},
	UserRegisterInputInput:{

	},
	UserUpdateInputInput:{
		gender:"GenderEnum"
	}
}

export const ReturnTypes: Record<string,any> = {
	BaseEntity:{
		"...on File": "File",
		"...on Menu": "Menu",
		"...on Point": "Point",
		"...on Role": "Role",
		"...on User": "User",
		createdAt:"LocalDateTime",
		createdBy:"String",
		id:"String",
		updatedAt:"LocalDateTime",
		updatedBy:"String"
	},
	File:{
		bucket:"String",
		category:"String",
		createdAt:"LocalDateTime",
		createdBy:"String",
		fileHash:"String",
		fileName:"String",
		fileSize:"Int",
		id:"String",
		mimeType:"String",
		originName:"String",
		provider:"FileProviderEnum",
		updatedAt:"LocalDateTime",
		updatedBy:"String",
		url:"String"
	},
	LocalDateTime: `scalar.LocalDateTime` as const,
	LoginSessionResult:{
		createdAt:"LocalDateTime",
		current:"Boolean",
		expired:"Boolean",
		id:"String",
		ip:"String"
	},
	Long: `scalar.Long` as const,
	Menu:{
		children:"Menu",
		component:"String",
		createdAt:"LocalDateTime",
		createdBy:"String",
		frame:"Boolean",
		icon:"String",
		id:"String",
		name:"String",
		parent:"Menu",
		parentId:"String",
		path:"String",
		permission:"String",
		roles:"Role",
		sort:"Int",
		title:"String",
		type:"MenuTypeEnum",
		updatedAt:"LocalDateTime",
		updatedBy:"String",
		visible:"Boolean"
	},
	Mutation:{
		deleteMenu:"Boolean",
		createMenu:"Menu",
		updateRole:"Role",
		deletePoint:"Boolean",
		revoke:"Boolean",
		createRole:"Role",
		updateUser:"User",
		createPoint:"Point",
		deleteRole:"Boolean",
		updateMenu:"Menu",
		logout:"Boolean",
		registerUser:"Boolean",
		loginByAccount:"String",
		deleteUser:"Boolean",
		createUser:"User",
		updatePoint:"Point",
		deleteFileById:"Boolean"
	},
	Order:{
		direction:"Direction",
		ignoreCase:"Boolean",
		nullHandlingHint:"NullHandling",
		property:"String"
	},
	Page_File:{
		content:"File",
		first:"Boolean",
		hasContent:"Boolean",
		hasNext:"Boolean",
		hasPrevious:"Boolean",
		last:"Boolean",
		nextOrLastPageable:"Pagination",
		nextPageable:"Pagination",
		number:"Int",
		numberOfElements:"Int",
		pageable:"Pagination",
		previousOrFirstPageable:"Pagination",
		previousPageable:"Pagination",
		size:"Int",
		sort:"Sorting",
		totalElements:"Long",
		totalPages:"Int"
	},
	Page_Point:{
		content:"Point",
		first:"Boolean",
		hasContent:"Boolean",
		hasNext:"Boolean",
		hasPrevious:"Boolean",
		last:"Boolean",
		nextOrLastPageable:"Pagination",
		nextPageable:"Pagination",
		number:"Int",
		numberOfElements:"Int",
		pageable:"Pagination",
		previousOrFirstPageable:"Pagination",
		previousPageable:"Pagination",
		size:"Int",
		sort:"Sorting",
		totalElements:"Long",
		totalPages:"Int"
	},
	Page_Role:{
		content:"Role",
		first:"Boolean",
		hasContent:"Boolean",
		hasNext:"Boolean",
		hasPrevious:"Boolean",
		last:"Boolean",
		nextOrLastPageable:"Pagination",
		nextPageable:"Pagination",
		number:"Int",
		numberOfElements:"Int",
		pageable:"Pagination",
		previousOrFirstPageable:"Pagination",
		previousPageable:"Pagination",
		size:"Int",
		sort:"Sorting",
		totalElements:"Long",
		totalPages:"Int"
	},
	Page_User:{
		content:"User",
		first:"Boolean",
		hasContent:"Boolean",
		hasNext:"Boolean",
		hasPrevious:"Boolean",
		last:"Boolean",
		nextOrLastPageable:"Pagination",
		nextPageable:"Pagination",
		number:"Int",
		numberOfElements:"Int",
		pageable:"Pagination",
		previousOrFirstPageable:"Pagination",
		previousPageable:"Pagination",
		size:"Int",
		sort:"Sorting",
		totalElements:"Long",
		totalPages:"Int"
	},
	Pagination:{
		pageNumber:"Int",
		pageSize:"Int",
		sort:"Sort"
	},
	Point:{
		createdAt:"LocalDateTime",
		createdBy:"String",
		file:"File",
		fileId:"String",
		id:"String",
		level:"Int",
		type:"Int",
		updatedAt:"LocalDateTime",
		updatedBy:"String",
		user:"User",
		userId:"String",
		x:"Int",
		y:"Int",
		z:"Int"
	},
	Query:{
		app:"String",
		queryLoginSessionList:"LoginSessionResult",
		userInfo:"UserInfoResult",
		queryMenuList:"Menu",
		queryRole:"Role",
		queryAllRoleList:"Role",
		queryUserPage:"Page_User",
		queryAllUserList:"User",
		queryPointPage:"Page_Point",
		queryFilePage:"Page_File",
		queryMenuTree:"Menu",
		queryUser:"User",
		queryRolePage:"Page_Role"
	},
	Role:{
		createdAt:"LocalDateTime",
		createdBy:"String",
		default:"Int",
		id:"String",
		key:"String",
		level:"Int",
		menus:"Menu",
		name:"String",
		updatedAt:"LocalDateTime",
		updatedBy:"String",
		users:"User"
	},
	Sort:{
		orders:"Order"
	},
	Sorting:{
		orders:"Order"
	},
	User:{
		avatar:"String",
		createdAt:"LocalDateTime",
		createdBy:"String",
		email:"String",
		gender:"GenderEnum",
		id:"String",
		nickName:"String",
		phone:"String",
		roles:"Role",
		updatedAt:"LocalDateTime",
		updatedBy:"String",
		userName:"String"
	},
	UserInfoResult:{
		avatar:"String",
		email:"String",
		gender:"GenderEnum",
		id:"String",
		menus:"Menu",
		nickName:"String",
		permissions:"String",
		phone:"String",
		roles:"Role",
		superAdmin:"Boolean",
		userName:"String"
	}
}

export const Ops = {
query: "Query" as const,
	mutation: "Mutation" as const
}