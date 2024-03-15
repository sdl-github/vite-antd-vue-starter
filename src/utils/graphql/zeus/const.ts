/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	ArticleStatusEnum: "enum" as const,
	CreateArticleCategoryInputInput:{

	},
	CreateArticleInputInput:{

	},
	CreateCommentInputInput:{

	},
	CreateMenuInputInput:{
		type:"MenuTypeEnum"
	},
	CreateOrgInputInput:{
		orgType:"OrgTypeEnum"
	},
	CreateRoleInputInput:{

	},
	CreateUserInputInput:{
		gender:"GenderEnum"
	},
	DefaultRoleEnum: "enum" as const,
	Direction: "enum" as const,
	FileProviderEnum: "enum" as const,
	FileQueryPageParamInput:{
		provider:"FileProviderEnum"
	},
	GenderEnum: "enum" as const,
	LocalDate: `scalar.LocalDate` as const,
	LocalDateTime: `scalar.LocalDateTime` as const,
	Long: `scalar.Long` as const,
	MenuQueryPageParamInput:{

	},
	MenuQueryParamInput:{
		type:"MenuTypeEnum"
	},
	MenuTypeEnum: "enum" as const,
	Mutation:{
		deleteMenu:{

		},
		unpublishArticle:{

		},
		updateArticle:{
			input:"UpdateArticleInputInput"
		},
		updateRole:{
			input:"UpdateRoleInputInput"
		},
		updateArticleCategory:{
			input:"UpdateArticleCategoryInputInput"
		},
		createArticleCategory:{
			input:"CreateArticleCategoryInputInput"
		},
		deleteComment:{

		},
		createRole:{
			input:"CreateRoleInputInput"
		},
		revoke:{

		},
		updateOrg:{
			input:"UpdateOrgInputInput"
		},
		createComment:{
			input:"CreateCommentInputInput"
		},
		updateMenu:{
			input:"UpdateMenuInputInput"
		},
		createOrg:{
			input:"CreateOrgInputInput"
		},
		createMenu:{
			input:"CreateMenuInputInput"
		},
		deleteArticleCategory:{

		},
		createArticle:{
			input:"CreateArticleInputInput"
		},
		deleteOrg:{

		},
		updateRoleMenu:{
			input:"UpdateRoleMenuInputInput"
		},
		publishArticle:{

		},
		updateUser:{
			input:"UpdateUserInputInput"
		},
		deleteRole:{

		},
		updateComment:{
			input:"UpdateCommentInputInput"
		},
		deleteArticle:{

		},
		updateUserProfile:{
			input:"UpdateUserProfileInputInput"
		},
		deleteUser:{

		},
		registerUser:{
			input:"UserRegisterInputInput"
		},
		loginByAccount:{
			input:"UserLoginInputInput"
		},
		createUser:{
			input:"CreateUserInputInput"
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
		queryCommentPage:{
			specification:"QueryCommentPageSpecificationInput"
		},
		queryUserPage:{
			specification:"QueryUserPageSpecificationInput"
		},
		queryStudyPlanPage:{
			specification:"QueryStudyPlanPageSpecificationInput"
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
		queryUserList:{
			specification:"QueryUserSpecificationInput"
		},
		queryArticlePage:{
			specification:"QueryArticlePageSpecificationInput"
		},
		queryWordRecordPage:{
			specification:"QueryWordRecordPageSpecificationInput"
		},
		queryOrgPage:{
			specification:"QueryOrgPageSpecificationInput"
		},
		queryFilePage:{
			param:"FileQueryPageParamInput"
		},
		queryUser:{

		},
		queryArticleCategory:{
			specification:"QueryArticleCategorySpecificationInput"
		},
		setDayPlanAndName:{
			input:"SetPlanAndNickNameInputInput"
		}
	},
	QueryArticleCategorySpecificationInput:{

	},
	QueryArticlePageSpecificationInput:{

	},
	QueryCommentPageSpecificationInput:{

	},
	QueryOrgPageSpecificationInput:{
		orgType:"OrgTypeEnum"
	},
	QueryStudyPlanPageSpecificationInput:{

	},
	QueryUserPageSpecificationInput:{

	},
	QueryUserSpecificationInput:{

	},
	QueryWordRecordPageSpecificationInput:{

	},
	RoleQueryParamInput:{

	},
	SetPlanAndNickNameInputInput:{

	},
	UpdateArticleCategoryInputInput:{

	},
	UpdateArticleInputInput:{

	},
	UpdateCommentInputInput:{

	},
	UpdateMenuInputInput:{
		type:"MenuTypeEnum"
	},
	UpdateOrgInputInput:{
		orgType:"OrgTypeEnum"
	},
	UpdateRoleInputInput:{

	},
	UpdateRoleMenuInputInput:{

	},
	UpdateUserInputInput:{
		gender:"GenderEnum"
	},
	UpdateUserProfileInputInput:{

	},
	UserLoginInputInput:{

	},
	UserRegisterInputInput:{

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
		"...on Comment": "Comment",
		"...on File": "File",
		"...on Menu": "Menu",
		"...on Org": "Org",
		"...on Role": "Role",
		"...on StudyPlan": "StudyPlan",
		"...on User": "User",
		"...on WordRecord": "WordRecord",
		createdAt:"LocalDateTime",
		createdBy:"String",
		id:"String",
		updatedAt:"LocalDateTime",
		updatedBy:"String"
	},
	Comment:{
		content:"String",
		createdAt:"LocalDateTime",
		createdBy:"String",
		id:"String",
		ip:"String",
		location:"String",
		org:"Org",
		orgId:"String",
		type:"String",
		updatedAt:"LocalDateTime",
		updatedBy:"String",
		user:"User",
		userId:"String"
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
	LocalDate: `scalar.LocalDate` as const,
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
		deleteComment:"Boolean",
		createRole:"Role",
		revoke:"Boolean",
		updateOrg:"Org",
		createComment:"Comment",
		updateMenu:"Menu",
		logout:"Boolean",
		createOrg:"Org",
		createMenu:"Menu",
		deleteArticleCategory:"Boolean",
		createArticle:"Article",
		deleteOrg:"Boolean",
		updateRoleMenu:"Boolean",
		publishArticle:"Boolean",
		updateUser:"User",
		deleteRole:"Boolean",
		updateComment:"Comment",
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
	Page_StudyPlan:{
		content:"StudyPlan",
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
	Page_WordRecord:{
		content:"WordRecord",
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
		queryCommentPage:"Page_Comment",
		queryArticleCategoryTree:"ArticleCategory",
		queryUserPage:"Page_User",
		queryStudyPlanPage:"Page_StudyPlan",
		queryArticle:"Article",
		queryMenuTree:"Menu",
		queryRolePage:"Page_Role",
		queryLoginSessionList:"LoginSessionResult",
		queryRole:"Role",
		queryUserList:"User",
		queryAllRoleList:"Role",
		queryDefaultRole:"DefaultRoleEnum",
		queryArticlePage:"Page_Article",
		queryWordRecordPage:"Page_WordRecord",
		queryOrgPage:"Page_Org",
		queryFilePage:"Page_File",
		queryUser:"User",
		queryArticleCategory:"ArticleCategory",
		setDayPlanAndName:"Boolean"
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
	StudyPlan:{
		createdAt:"LocalDateTime",
		createdBy:"String",
		date:"LocalDate",
		dayCount:"Int",
		id:"String",
		planCount:"Int",
		updatedAt:"LocalDateTime",
		updatedBy:"String",
		user:"User",
		userId:"String"
	},
	User:{
		avatar:"String",
		createdAt:"LocalDateTime",
		createdBy:"String",
		dayCount:"Int",
		email:"String",
		gender:"GenderEnum",
		id:"String",
		job:"String",
		nickName:"String",
		note:"String",
		org:"Org",
		orgId:"String",
		phone:"String",
		roles:"Role",
		totalCount:"Int",
		updatedAt:"LocalDateTime",
		updatedBy:"String",
		userName:"String"
	},
	UserInfoResult:{
		avatar:"String",
		dayCount:"Int",
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
		totalCount:"Int",
		userName:"String"
	},
	WordRecord:{
		createdAt:"LocalDateTime",
		createdBy:"String",
		detail:"String",
		id:"String",
		image:"String",
		type:"String",
		updatedAt:"LocalDateTime",
		updatedBy:"String",
		user:"User",
		userId:"String",
		word:"String"
	}
}

export const Ops = {
query: "Query" as const,
	mutation: "Mutation" as const
}