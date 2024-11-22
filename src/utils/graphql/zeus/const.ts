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
	CreateTodoInput:{
		doneDate:"LocalDateTime",
		planDate:"LocalDateTime",
		warnDate:"LocalDateTime"
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
		updateRole:{
			input:"UpdateRoleInput"
		},
		updateArticleCategory:{
			input:"UpdateArticleCategoryInput"
		},
		createArticleCategory:{
			input:"CreateArticleCategoryInput"
		},
		revoke:{

		},
		createRole:{
			input:"CreateRoleInput"
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
		updateTodo:{
			input:"UpdateTodoInput"
		},
		updateUserProfile:{
			input:"UpdateUserProfileInput"
		},
		registerUser:{
			input:"UserRegisterInput"
		},
		loginByAccount:{
			input:"UserLoginInput"
		},
		deleteUser:{

		},
		createUser:{
			input:"CreateUserInput"
		},
		deleteFileById:{

		},
		deleteTodo:{

		},
		createTodo:{
			input:"CreateTodoInput"
		}
	},
	NullHandling: "enum" as const,
	Query:{
		queryCommentPage:{
			specification:"QueryCommentPageSpecificationInput"
		},
		queryMenuList:{
			spec:"QueryMenuSpecInput"
		},
		queryTodo:{

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
		queryTodoPage:{
			specification:"QueryTodoPageSpecificationInput"
		},
		queryArticlePage:{
			specification:"QueryArticlePageSpecificationInput"
		},
		queryFilePage:{
			spec:"QueryFilePageSpecInput"
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
	QueryCommentPageSpecificationInput:{

	},
	QueryFilePageSpecInput:{
		provider:"FileProviderEnum"
	},
	QueryMenuSpecInput:{
		type:"MenuTypeEnum"
	},
	QueryRolePageSpecificationInput:{

	},
	QueryTodoPageSpecificationInput:{

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
	UpdateTodoInput:{
		doneDate:"LocalDateTime",
		planDate:"LocalDateTime",
		warnDate:"LocalDateTime"
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
	oneOf:{

	},
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
		"...on Comment": "Comment",
		"...on File": "File",
		"...on Menu": "Menu",
		"...on Role": "Role",
		"...on Todo": "Todo",
		"...on User": "User",
		createdAt:"LocalDateTime",
		createdBy:"String",
		id:"String",
		updatedAt:"LocalDateTime",
		updatedBy:"String"
	},
	Comment:{
		author:"Boolean",
		content:"String",
		createdAt:"LocalDateTime",
		createdBy:"String",
		id:"String",
		parent:"Comment",
		parentId:"String",
		relation:"Article",
		relationId:"String",
		replyComment:"Comment",
		replyCommentId:"String",
		replyUser:"User",
		replyUserId:"String",
		type:"String",
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
		updateRole:"Role",
		updateArticleCategory:"ArticleCategory",
		createArticleCategory:"ArticleCategory",
		revoke:"Boolean",
		createRole:"Role",
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
		updateTodo:"Todo",
		updateUserProfile:"Boolean",
		registerUser:"Boolean",
		loginByAccount:"String",
		deleteUser:"Boolean",
		createUser:"User",
		deleteFileById:"Boolean",
		deleteTodo:"Boolean",
		createTodo:"Todo"
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
	Page_Comment:{
		content:"Comment",
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
	Page_Todo:{
		content:"Todo",
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
		queryCommentPage:"Page_Comment",
		queryMenuList:"Menu",
		queryTodo:"Todo",
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
		queryTodoPage:"Page_Todo",
		queryArticlePage:"Page_Article",
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
	Todo:{
		content:"String",
		createdAt:"LocalDateTime",
		createdBy:"String",
		doneDate:"LocalDateTime",
		icon:"String",
		id:"String",
		planDate:"LocalDateTime",
		sort:"Int",
		title:"String",
		updatedAt:"LocalDateTime",
		updatedBy:"String",
		user:"User",
		userId:"String",
		warnDate:"LocalDateTime"
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