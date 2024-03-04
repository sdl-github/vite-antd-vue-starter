/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	ArticleStatusEnum: "enum" as const,
	CreateArticleCategoryInputInput:{

	},
	CreateArticleInputInput:{

	},
	CreateOrgInputInput:{
		orgType:"OrgTypeEnum"
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
		unpublishArticle:{

		},
		updateArticle:{
			input:"UpdateArticleInputInput"
		},
		updateArticleCategory:{
			input:"UpdateArticleCategoryInputInput"
		},
		createArticleCategory:{
			input:"CreateArticleCategoryInputInput"
		},
		updateRole:{
			input:"RoleUpdateInputInput"
		},
		revoke:{

		},
		createRole:{
			input:"RoleCreateInputInput"
		},
		updateOrg:{
			input:"UpdateOrgInputInput"
		},
		updateMenu:{
			input:"MenuUpdateInputInput"
		},
		createMenu:{
			input:"MenuCreateInputInput"
		},
		createOrg:{
			input:"CreateOrgInputInput"
		},
		deleteArticleCategory:{

		},
		createArticle:{
			input:"CreateArticleInputInput"
		},
		deleteOrg:{

		},
		publishArticle:{

		},
		updateUser:{
			input:"UserUpdateInputInput"
		},
		deleteRole:{

		},
		deleteArticle:{

		},
		updateUserProfile:{
			input:"UpdateUserProfileInputInput"
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

		}
	},
	NullHandling: "enum" as const,
	OrgTypeEnum: "enum" as const,
	Query:{
		queryMenuList:{
			param:"MenuQueryParamInput"
		},
		queryUserPage:{
			param:"UserQueryParamInput"
		},
		queryArticle:{

		},
		queryMenuTree:{
			param:"MenuQueryPageParamInput"
		},
		queryRolePage:{
			param:"RoleQueryParamInput"
		},
		queryRole:{

		},
		queryArticlePage:{
			specification:"QueryArticlePageSpecificationInput"
		},
		queryOrgPage:{
			specification:"QueryOrgPageSpecificationInput"
		},
		queryFilePage:{
			param:"FileQueryPageParamInput"
		},
		queryArticleCategory:{
			specification:"QueryArticleCategorySpecificationInput"
		},
		queryUser:{

		}
	},
	QueryArticleCategorySpecificationInput:{

	},
	QueryArticlePageSpecificationInput:{

	},
	QueryOrgPageSpecificationInput:{
		orgType:"OrgTypeEnum"
	},
	RoleCreateInputInput:{

	},
	RoleQueryParamInput:{

	},
	RoleUpdateInputInput:{

	},
	UpdateArticleCategoryInputInput:{

	},
	UpdateArticleInputInput:{

	},
	UpdateOrgInputInput:{
		orgType:"OrgTypeEnum"
	},
	UpdateUserProfileInputInput:{

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
	Article:{
		author:"User",
		authorId:"String",
		category:"ArticleCategory",
		categoryId:"String",
		createdAt:"LocalDateTime",
		createdBy:"String",
		html:"String",
		id:"String",
		image:"String",
		markdown:"String",
		metaDescription:"String",
		metaTitle:"String",
		publishedAt:"LocalDateTime",
		publishedBy:"String",
		status:"ArticleStatusEnum",
		title:"String",
		updatedAt:"LocalDateTime",
		updatedBy:"String"
	},
	ArticleCategory:{
		articles:"Article",
		children:"ArticleCategory",
		createdAt:"LocalDateTime",
		createdBy:"String",
		icon:"String",
		id:"String",
		name:"String",
		parent:"ArticleCategory",
		parentId:"String",
		sort:"Int",
		updatedAt:"LocalDateTime",
		updatedBy:"String"
	},
	BaseEntity:{
		"...on Article": "Article",
		"...on ArticleCategory": "ArticleCategory",
		"...on File": "File",
		"...on Menu": "Menu",
		"...on Org": "Org",
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
		unpublishArticle:"Boolean",
		updateArticle:"Article",
		updateArticleCategory:"ArticleCategory",
		createArticleCategory:"ArticleCategory",
		updateRole:"Role",
		revoke:"Boolean",
		createRole:"Role",
		updateOrg:"Org",
		updateMenu:"Menu",
		logout:"Boolean",
		createMenu:"Menu",
		createOrg:"Org",
		deleteArticleCategory:"Boolean",
		createArticle:"Article",
		deleteOrg:"Boolean",
		publishArticle:"Boolean",
		updateUser:"User",
		deleteRole:"Boolean",
		deleteArticle:"Boolean",
		updateUserProfile:"Boolean",
		registerUser:"Boolean",
		loginByAccount:"String",
		deleteUser:"Boolean",
		createUser:"User",
		deleteFileById:"Boolean"
	},
	Order:{
		direction:"Direction",
		ignoreCase:"Boolean",
		nullHandlingHint:"NullHandling",
		property:"String"
	},
	Org:{
		address:"String",
		createdAt:"LocalDateTime",
		createdBy:"String",
		id:"String",
		latitude:"Float",
		lead:"User",
		leadId:"String",
		longitude:"Float",
		name:"String",
		openTime:"String",
		orgType:"OrgTypeEnum",
		updatedAt:"LocalDateTime",
		updatedBy:"String"
	},
	Page_Article:{
		content:"Article",
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
	Page_Org:{
		content:"Org",
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
	Query:{
		app:"String",
		userInfo:"UserInfoResult",
		queryMenuList:"Menu",
		queryArticleCategoryTree:"ArticleCategory",
		queryUserPage:"Page_User",
		queryArticle:"Article",
		queryMenuTree:"Menu",
		queryRolePage:"Page_Role",
		queryLoginSessionList:"LoginSessionResult",
		queryRole:"Role",
		queryAllRoleList:"Role",
		queryAllUserList:"User",
		queryArticlePage:"Page_Article",
		queryOrgPage:"Page_Org",
		queryFilePage:"Page_File",
		queryArticleCategory:"ArticleCategory",
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
	}
}

export const Ops = {
query: "Query" as const,
	mutation: "Mutation" as const
}