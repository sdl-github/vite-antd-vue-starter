/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	ArticleStatusEnum: "enum" as const,
	CreateArticleCategoryInput:{

	},
	CreateArticleInput:{

	},
	CreateCommentInput:{

	},
	CreateMenuInput:{
		type:"MenuTypeEnum"
	},
	CreateRoleInput:{

	},
	CreateUserInput:{
		gender:"GenderEnum"
	},
	DefaultRoleEnum: "enum" as const,
	Direction: "enum" as const,
	FileProviderEnum: "enum" as const,
	GenderEnum: "enum" as const,
	LocalDateTime: `scalar.LocalDateTime` as const,
	Long: `scalar.Long` as const,
	MenuTypeEnum: "enum" as const,
	Mutation:{
		deleteMenu:{

		},
		unpublishArticle:{

		},
		updateArticle:{
			input:"UpdateArticleInput"
		},
		updateArticleCategory:{
			input:"UpdateArticleCategoryInput"
		},
		createArticleCategory:{
			input:"CreateArticleCategoryInput"
		},
		updateRole:{
			input:"UpdateRoleInput"
		},
		createRole:{
			input:"CreateRoleInput"
		},
		revoke:{

		},
		updateMenuVisible:{
			input:"UpdateMenuVisibleInput"
		},
		createComment:{
			input:"CreateCommentInput"
		},
		updateMenu:{
			input:"UpdateMenuInput"
		},
		createMenu:{
			input:"CreateMenuInput"
		},
		deleteArticleCategory:{

		},
		createArticle:{
			input:"CreateArticleInput"
		},
		updateRoleMenu:{
			input:"UpdateRoleMenuInput"
		},
		publishArticle:{

		},
		updateUser:{
			input:"UpdateUserInput"
		},
		deleteRole:{

		},
		deleteArticle:{

		},
		updateUserProfile:{
			input:"UpdateUserProfileInput"
		},
		deleteUser:{

		},
		registerUser:{
			input:"UserRegisterInput"
		},
		loginByAccount:{
			input:"UserLoginInput"
		},
		createUser:{
			input:"CreateUserInput"
		},
		deleteFileById:{

		}
	},
	NullHandling: "enum" as const,
	Query:{
		queryMenuList:{
			spec:"QueryMenuSpecInput"
		},
		queryUserPage:{
			specification:"QueryUserPageSpecificationInput"
		},
		queryArticle:{

		},
		queryMenuTree:{
			spec:"QueryMenuSpecInput"
		},
		queryRolePage:{
			specification:"QueryRolePageSpecificationInput"
		},
		queryRole:{

		},
		queryUserList:{
			specification:"QueryUserSpecificationInput"
		},
		queryArticlePage:{
			specification:"QueryArticlePageSpecificationInput"
		},
		queryFilePage:{
			spec:"QueryFilePageSpecInput"
		},
		queryUser:{

		},
		queryArticleCategory:{
			specification:"QueryArticleCategorySpecificationInput"
		}
	},
	QueryArticleCategorySpecificationInput:{

	},
	QueryArticlePageSpecificationInput:{

	},
	QueryFilePageSpecInput:{
		provider:"FileProviderEnum"
	},
	QueryMenuSpecInput:{
		type:"MenuTypeEnum"
	},
	QueryRolePageSpecificationInput:{

	},
	QueryUserPageSpecificationInput:{

	},
	QueryUserSpecificationInput:{

	},
	UpdateArticleCategoryInput:{

	},
	UpdateArticleInput:{

	},
	UpdateMenuInput:{
		type:"MenuTypeEnum"
	},
	UpdateMenuVisibleInput:{

	},
	UpdateRoleInput:{

	},
	UpdateRoleMenuInput:{

	},
	UpdateUserInput:{
		gender:"GenderEnum"
	},
	UpdateUserProfileInput:{

	},
	UserLoginInput:{

	},
	UserRegisterInput:{

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
		createRole:"Role",
		revoke:"Boolean",
		updateMenuVisible:"Menu",
		createComment:"Boolean",
		updateMenu:"Menu",
		logout:"Boolean",
		createMenu:"Menu",
		deleteArticleCategory:"Boolean",
		createArticle:"Article",
		updateRoleMenu:"Boolean",
		publishArticle:"Boolean",
		updateUser:"User",
		deleteRole:"Boolean",
		deleteArticle:"Boolean",
		updateUserProfile:"Boolean",
		deleteUser:"Boolean",
		registerUser:"Boolean",
		loginByAccount:"String",
		createUser:"User",
		deleteFileById:"Boolean"
	},
	Order:{
		direction:"Direction",
		ignoreCase:"Boolean",
		nullHandlingHint:"NullHandling",
		property:"String"
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
		queryUserList:"User",
		queryAllRoleList:"Role",
		queryDefaultRole:"DefaultRoleEnum",
		queryArticlePage:"Page_Article",
		queryFilePage:"Page_File",
		queryUser:"User",
		queryArticleCategory:"ArticleCategory"
	},
	Role:{
		createdAt:"LocalDateTime",
		createdBy:"String",
		default:"Int",
		id:"String",
		key:"String",
		level:"Int",
		menuIds:"String",
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
		note:"String",
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