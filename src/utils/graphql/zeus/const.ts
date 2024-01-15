/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	BigDecimal: `scalar.BigDecimal` as const,
	CreatePointInputInput:{
		x:"BigDecimal",
		y:"BigDecimal",
		z:"BigDecimal"
	},
	CreateWarnEventInputInput:{
		warnTime:"LocalDateTime"
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
		revoke:{

		},
		updateUser:{
			input:"UserUpdateInputInput"
		},
		createRole:{
			input:"RoleCreateInputInput"
		},
		deleteWarnEvent:{

		},
		deletePoint:{

		},
		createPoint:{
			input:"CreatePointInputInput"
		},
		deleteRole:{

		},
		updateWarnEvent:{
			input:"UpdateWarnEventInputInput"
		},
		updateMenu:{
			input:"MenuUpdateInputInput"
		},
		updateUserProfile:{
			input:"UpdateUserProfileInputInput"
		},
		createWarnEvent:{
			input:"CreateWarnEventInputInput"
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
		deleteFileById:{

		},
		updatePoint:{
			input:"UpdatePointInputInput"
		}
	},
	NullHandling: "enum" as const,
	Query:{
		queryMenuList:{
			param:"MenuQueryParamInput"
		},
		queryUserPage:{
			param:"UserQueryParamInput"
		},
		queryPointPage:{
			param:"QueryPointPageParamInput"
		},
		queryMenuTree:{
			param:"MenuQueryPageParamInput"
		},
		queryRolePage:{
			param:"RoleQueryParamInput"
		},
		queryWarnEventPage:{
			param:"QueryWarnEventParamInput"
		},
		queryRole:{

		},
		queryFilePage:{
			param:"FileQueryPageParamInput"
		},
		queryUser:{

		}
	},
	QueryPointPageParamInput:{

	},
	QueryWarnEventParamInput:{

	},
	RoleCreateInputInput:{

	},
	RoleQueryParamInput:{

	},
	RoleUpdateInputInput:{

	},
	UpdatePointInputInput:{

	},
	UpdateUserProfileInputInput:{

	},
	UpdateWarnEventInputInput:{
		warnTime:"LocalDateTime"
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
		"...on WarnEvent": "WarnEvent",
		createdAt:"LocalDateTime",
		createdBy:"String",
		id:"String",
		updatedAt:"LocalDateTime",
		updatedBy:"String"
	},
	BigDecimal: `scalar.BigDecimal` as const,
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
		revoke:"Boolean",
		updateUser:"User",
		createRole:"Role",
		deleteWarnEvent:"Boolean",
		deletePoint:"Boolean",
		createPoint:"Point",
		deleteRole:"Boolean",
		updateWarnEvent:"WarnEvent",
		updateMenu:"Menu",
		logout:"Boolean",
		updateUserProfile:"Boolean",
		createWarnEvent:"WarnEvent",
		registerUser:"Boolean",
		loginByAccount:"String",
		deleteUser:"Boolean",
		createUser:"User",
		deleteFileById:"Boolean",
		updatePoint:"Point"
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
	Page_WarnEvent:{
		content:"WarnEvent",
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
		x:"BigDecimal",
		y:"BigDecimal",
		z:"BigDecimal"
	},
	Query:{
		app:"String",
		userInfo:"UserInfoResult",
		queryMenuList:"Menu",
		queryUserPage:"Page_User",
		queryPointPage:"Page_Point",
		queryMenuTree:"Menu",
		queryRolePage:"Page_Role",
		queryLoginSessionList:"LoginSessionResult",
		queryWarnEventPage:"Page_WarnEvent",
		queryRole:"Role",
		queryAllRoleList:"Role",
		queryAllUserList:"User",
		queryFilePage:"Page_File",
		queryUser:"User"
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
		job:"String",
		nickName:"String",
		note:"String",
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
		passwordEnable:"Boolean",
		permissions:"String",
		phone:"String",
		roles:"Role",
		superAdmin:"Boolean",
		userName:"String"
	},
	WarnEvent:{
		code:"String",
		createdAt:"LocalDateTime",
		createdBy:"String",
		fileUrl:"String",
		id:"String",
		level:"String",
		location:"String",
		name:"String",
		title:"String",
		updatedAt:"LocalDateTime",
		updatedBy:"String",
		warnTime:"LocalDateTime"
	}
}

export const Ops = {
query: "Query" as const,
	mutation: "Mutation" as const
}