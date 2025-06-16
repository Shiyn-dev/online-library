"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string, params?: Record<string, string>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Добавить эту строку для экспорта контекста
export { LanguageContext }

const translations = {
  en: {
    // App
    appName: "Online Library",

    // Navigation
    home: "Home",
    cart: "Cart",
    profile: "Profile",
    signIn: "Sign In",
    signOut: "Sign Out",
    signUp: "Sign Up",

    // Hero
    heroTitle: "Discover Your Next Great Read",
    heroDescription:
      "Explore thousands of books, build your personal library, and download detailed information about your favorite titles.",
    startExploring: "Start Exploring",

    // Search & Filters
    searchPlaceholder: "Search for books, authors, or topics...",
    search: "Search",
    searchResults: "Search results for",
    noSearchResults: "No books found for your search",
    tryDifferentSearch: "Try searching for different keywords",
    selectCategory: "Select Category",
    allCategories: "All Categories",
    sortBy: "Sort By",
    relevance: "Relevance",
    newest: "Newest",
    oldest: "Oldest",
    title: "Title",
    clearFilters: "Clear Filters",

    // Books
    addToCart: "Add to Cart",
    inCart: "In Cart",
    addToFavorites: "Add to Favorites",
    removeFromFavorites: "Remove from Favorites",
    downloadPDF: "Download PDF",
    loadMore: "Load More",
    noBooksFound: "No books found",
    errorLoadingBooks: "Error loading books",
    noImage: "No Image Available",
    by: "by",
    ratings: "ratings",

    // Book Details
    description: "Description",
    bookDetails: "Book Details",
    publisher: "Publisher",
    publishedDate: "Published Date",
    pages: "Pages",
    language: "Language",
    goBack: "Go Back",
    bookNotFound: "Book not found",

    // Cart
    myCart: "My Cart",
    book: "book",
    books: "books",
    downloadAllPDFs: "Download All PDFs",
    clearCart: "Clear Cart",
    emptyCart: "Your cart is empty",
    emptyCartDescription: "Add some books to your cart to get started",
    continueBrowsing: "Continue Browsing",
    remove: "Remove",
    downloading: "Downloading...",

    // Profile
    myProfile: "My Profile",
    memberSince: "Member since",
    booksInCart: "Books in Cart",
    favoriteBooks: "Favorite Books",
    booksReadyToDownload: "books ready to download",
    booksInFavorites: "books in favorites",
    recentActivity: "Recent Activity",
    recentlyAdded: "Recently Added",
    viewAllInCart: "View All in Cart",
    noRecentActivity: "No recent activity",
    preferences: "Preferences",
    theme: "Theme",
    system: "System",
    notifications: "Notifications",
    enabled: "Enabled",

    // Auth - Sign In
    welcomeBack: "Welcome Back",
    signInDescription: "Sign in to access your personal library and saved books",
    signInWithGoogle: "Sign in with Google",
    signInWithEmail: "Sign in with Email",
    signInAgreement: "By signing in, you agree to our Terms of Service and Privacy Policy",
    signInRequired: "Sign In Required",
    signInToViewCart: "Please sign in to view your cart",
    signInToViewProfile: "Please sign in to view your profile",
    signInToViewFavorites: "Please sign in to view your favorites",
    signingIn: "Signing in...",
    signInToAddToCart: "Please sign in to add books to your cart",
    signInToAddToFavorites: "Please sign in to add books to your favorites",
    signInToDownload: "Please sign in to download books",
    orContinueWith: "or continue with",
    email: "Email",
    password: "Password",
    enterEmail: "Enter your email",
    enterPassword: "Enter your password",
    forgotPassword: "Forgot your password?",
    dontHaveAccount: "Don't have an account?",

    // Auth - Sign Up
    createAccount: "Create Account",
    signUpDescription: "Create an account to start building your personal library",
    signUpWithGoogle: "Sign up with Google",
    signUpAgreement: "By creating an account, you agree to our Terms of Service and Privacy Policy",
    signingUp: "Creating account...",
    fullName: "Full Name",
    enterFullName: "Enter your full name",
    confirmPassword: "Confirm Password",
    alreadyHaveAccount: "Already have an account?",

    // Auth - Reset Password
    resetPassword: "Reset Password",
    resetPasswordDescription: "Enter your email address and we'll send you a link to reset your password",
    resetPasswordSuccessDescription: "We've sent you a password reset link",
    sendResetEmail: "Send Reset Email",
    sendingResetEmail: "Sending...",
    resetPasswordEmailSent: "Password reset email sent successfully!",
    checkEmailInstructions: "Check your email for instructions on how to reset your password",
    backToSignIn: "Back to Sign In",

    // Form Validation
    fillAllFields: "Please fill in all fields",
    passwordsDoNotMatch: "Passwords do not match",
    passwordTooShort: "Password must be at least 6 characters",

    // Error Messages
    userNotFound: "No account found with this email address",
    wrongPassword: "Incorrect password",
    invalidEmail: "Invalid email address",
    userDisabled: "This account has been disabled",
    tooManyRequests: "Too many failed attempts. Please try again later",
    networkError: "Network error. Please check your connection",
    signInError: "Failed to sign in. Please try again",
    emailAlreadyInUse: "An account with this email already exists",
    weakPassword: "Password is too weak",
    signUpError: "Failed to create account. Please try again",
    resetPasswordError: "Failed to send reset email. Please try again",

    // Toast Messages
    addedToCart: "Added to Cart",
    bookAddedToCart: "{{title}} has been added to your cart",
    removedFromCart: "Removed from Cart",
    bookRemovedFromCart: "{{title}} has been removed from your cart",
    addedToFavorites: "Added to Favorites",
    bookAddedToFavorites: "{{title}} has been added to your favorites",
    removedFromFavorites: "Removed from Favorites",
    bookRemovedFromFavorites: "{{title}} has been removed from your favorites",
    cartCleared: "Cart Cleared",
    allBooksRemovedFromCart: "All books have been removed from your cart",
    downloadStarted: "Download Started",
    pdfDownloadStarted: "PDF download has started",
    allDownloadsStarted: "All Downloads Started",
    allPDFsDownloadStarted: "All PDF downloads have started",
    error: "Error",
    errorLoadingBook: "Failed to load book details",
    errorDownloadingPDF: "Failed to download PDF",
    errorDownloadingAllPDFs: "Failed to download all PDFs",

    // Favorites
    favorites: "Favorites",
    myFavorites: "My Favorites",
    emptyFavorites: "Your favorites are empty",
    emptyFavoritesDescription: "Add some books to your favorites to get started",
    clearFavorites: "Clear Favorites",
    favoritesCleared: "Favorites Cleared",
    allBooksRemovedFromFavorites: "All books have been removed from your favorites",

    // Purchase & Cart
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    tax: "Tax",
    total: "Total",
    purchaseNow: "Purchase Now",
    processing: "Processing...",
    purchaseAgreement: "By purchasing, you agree to our terms and conditions",
    purchaseSuccessful: "Purchase Successful!",
    purchaseConfirmationSent: "Confirmation email sent to your address",
    purchaseError: "Failed to process purchase. Please try again",

    // Comments & Reviews
    reviewsAndComments: "Reviews & Comments",
    review: "review",
    reviews: "reviews",
    selectRating: "Select rating",
    writeComment: "Write your comment...",
    postComment: "Post Comment",
    posting: "Posting...",
    commentAdded: "Comment Added",
    commentAddedSuccessfully: "Your comment has been posted successfully",
    errorAddingComment: "Failed to add comment. Please try again",
    commentRequired: "Comment is required",
    signInToComment: "Sign in to leave a comment",
    noCommentsYet: "No comments yet",
    beFirstToComment: "Be the first to leave a comment!",
  },

  ru: {
    // App
    appName: "Онлайн Библиотека",

    // Navigation
    home: "Главная",
    cart: "Корзина",
    profile: "Профиль",
    signIn: "Войти",
    signOut: "Выйти",
    signUp: "Регистрация",

    // Hero
    heroTitle: "Откройте для себя следующую великую книгу",
    heroDescription:
      "Исследуйте тысячи книг, создайте свою личную библиотеку и скачайте подробную информацию о ваших любимых произведениях.",
    startExploring: "Начать изучение",

    // Search & Filters
    searchPlaceholder: "Поиск книг, авторов или тем...",
    search: "Поиск",
    searchResults: "Результаты поиска для",
    noSearchResults: "Книги не найдены по вашему запросу",
    tryDifferentSearch: "Попробуйте поискать по другим ключевым словам",
    selectCategory: "Выберите категорию",
    allCategories: "Все категории",
    sortBy: "Сортировать по",
    relevance: "Релевантности",
    newest: "Новые",
    oldest: "Старые",
    title: "Названию",
    clearFilters: "Очистить фильтры",

    // Books
    addToCart: "Добавить в корзину",
    inCart: "В корзине",
    addToFavorites: "Добавить в избранное",
    removeFromFavorites: "Удалить из избранного",
    downloadPDF: "Скачать PDF",
    loadMore: "Загрузить еще",
    noBooksFound: "Книги не найдены",
    errorLoadingBooks: "Ошибка загрузки книг",
    noImage: "Изображение недоступно",
    by: "автор",
    ratings: "оценок",

    // Book Details
    description: "Описание",
    bookDetails: "Детали книги",
    publisher: "Издатель",
    publishedDate: "Дата публикации",
    pages: "Страниц",
    language: "Язык",
    goBack: "Назад",
    bookNotFound: "Книга не найдена",

    // Cart
    myCart: "Моя корзина",
    book: "книга",
    books: "книг",
    downloadAllPDFs: "Скачать все PDF",
    clearCart: "Очистить корзину",
    emptyCart: "Ваша корзина пуста",
    emptyCartDescription: "Добавьте книги в корзину, чтобы начать",
    continueBrowsing: "Продолжить просмотр",
    remove: "Удалить",
    downloading: "Загрузка...",

    // Profile
    myProfile: "Мой профиль",
    memberSince: "Участник с",
    booksInCart: "Книг в корзине",
    favoriteBooks: "Любимые книги",
    booksReadyToDownload: "книг готовы к скачиванию",
    booksInFavorites: "книг в избранном",
    recentActivity: "Недавняя активность",
    recentlyAdded: "Недавно добавленные",
    viewAllInCart: "Посмотреть все в корзине",
    noRecentActivity: "Нет недавней активности",
    preferences: "Настройки",
    theme: "Тема",
    system: "Системная",
    notifications: "Уведомления",
    enabled: "Включены",

    // Auth - Sign In
    welcomeBack: "Добро пожаловать",
    signInDescription: "Войдите, чтобы получить доступ к вашей личной библиотеке и сохраненным книгам",
    signInWithGoogle: "Войти через Google",
    signInWithEmail: "Войти через Email",
    signInAgreement: "Входя в систему, вы соглашаетесь с нашими Условиями обслуживания и Политикой конфиденциальности",
    signInRequired: "Требуется вход",
    signInToViewCart: "Пожалуйста, войдите, чтобы просмотреть корзину",
    signInToViewProfile: "Пожалуйста, войдите, чтобы просмотреть профиль",
    signInToViewFavorites: "Пожалуйста, войдите, чтобы просмотреть избранное",
    signingIn: "Вход...",
    signInToAddToCart: "Пожалуйста, войдите, чтобы добавить книги в корзину",
    signInToAddToFavorites: "Пожалуйста, войдите, чтобы добавить книги в избранное",
    signInToDownload: "Пожалуйста, войдите, чтобы скачать книги",
    orContinueWith: "или продолжить с",
    email: "Email",
    password: "Пароль",
    enterEmail: "Введите ваш email",
    enterPassword: "Введите ваш пароль",
    forgotPassword: "Забыли пароль?",
    dontHaveAccount: "Нет аккаунта?",

    // Auth - Sign Up
    createAccount: "Создать аккаунт",
    signUpDescription: "Создайте аккаунт, чтобы начать строить свою личную библиотеку",
    signUpWithGoogle: "Регистрация через Google",
    signUpAgreement: "Создавая аккаунт, вы соглашаетесь с нашими Условиями обслуживания и Политикой конфиденциальности",
    signingUp: "Создание аккаунта...",
    fullName: "Полное имя",
    enterFullName: "Введите ваше полное имя",
    confirmPassword: "Подтвердите пароль",
    alreadyHaveAccount: "Уже есть аккаунт?",

    // Auth - Reset Password
    resetPassword: "Сброс пароля",
    resetPasswordDescription: "Введите ваш email адрес и мы отправим вам ссылку для сброса пароля",
    resetPasswordSuccessDescription: "Мы отправили вам ссылку для сброса пароля",
    sendResetEmail: "Отправить письмо для сброса",
    sendingResetEmail: "Отправка...",
    resetPasswordEmailSent: "Письмо для сброса пароля успешно отправлено!",
    checkEmailInstructions: "Проверьте вашу почту для инструкций по сбросу пароля",
    backToSignIn: "Вернуться к входу",

    // Form Validation
    fillAllFields: "Пожалуйста, заполните все поля",
    passwordsDoNotMatch: "Пароли не совпадают",
    passwordTooShort: "Пароль должен содержать минимум 6 символов",

    // Error Messages
    userNotFound: "Аккаунт с таким email не найден",
    wrongPassword: "Неверный пароль",
    invalidEmail: "Неверный email адрес",
    userDisabled: "Этот аккаунт был отключен",
    tooManyRequests: "Слишком много неудачных попыток. Попробуйте позже",
    networkError: "Ошибка сети. Проверьте подключение",
    signInError: "Не удалось войти. Попробуйте еще раз",
    emailAlreadyInUse: "Аккаунт с таким email уже существует",
    weakPassword: "Пароль слишком слабый",
    signUpError: "Не удалось создать аккаунт. Попробуйте еще раз",
    resetPasswordError: "Не удалось отправить письмо для сброса. Попробуйте еще раз",

    // Toast Messages
    addedToCart: "Добавлено в корзину",
    bookAddedToCart: "{{title}} добавлена в вашу корзину",
    removedFromCart: "Удалено из корзины",
    bookRemovedFromCart: "{{title}} удалена из вашей корзины",
    addedToFavorites: "Добавлено в избранное",
    bookAddedToFavorites: "{{title}} добавлена в ваше избранное",
    removedFromFavorites: "Удалено из избранного",
    bookRemovedFromFavorites: "{{title}} удалена из вашего избранного",
    cartCleared: "Корзина очищена",
    allBooksRemovedFromCart: "Все книги удалены из корзины",
    downloadStarted: "Загрузка началась",
    pdfDownloadStarted: "Загрузка PDF началась",
    allDownloadsStarted: "Все загрузки начались",
    allPDFsDownloadStarted: "Загрузка всех PDF началась",
    error: "Ошибка",
    errorLoadingBook: "Не удалось загрузить детали книги",
    errorDownloadingPDF: "Не удалось скачать PDF",
    errorDownloadingAllPDFs: "Не удалось скачать все PDF",

    // Favorites
    favorites: "Избранное",
    myFavorites: "Мое избранное",
    emptyFavorites: "Ваше избранное пусто",
    emptyFavoritesDescription: "Добавьте книги в избранное, чтобы начать",
    clearFavorites: "Очистить избранное",
    favoritesCleared: "Избранное очищено",
    allBooksRemovedFromFavorites: "Все книги удалены из избранного",

    // Purchase & Cart
    orderSummary: "Сводка заказа",
    subtotal: "Промежуточный итог",
    tax: "Налог",
    total: "Итого",
    purchaseNow: "Купить сейчас",
    processing: "Обработка...",
    purchaseAgreement: "Покупая, вы соглашаетесь с нашими условиями",
    purchaseSuccessful: "Покупка успешна!",
    purchaseConfirmationSent: "Подтверждение отправлено на вашу почту",
    purchaseError: "Не удалось обработать покупку. Попробуйте еще раз",

    // Comments & Reviews
    reviewsAndComments: "Отзывы и комментарии",
    review: "отзыв",
    reviews: "отзывов",
    selectRating: "Выберите оценку",
    writeComment: "Напишите ваш комментарий...",
    postComment: "Опубликовать комментарий",
    posting: "Публикация...",
    commentAdded: "Комментарий добавлен",
    commentAddedSuccessfully: "Ваш комментарий успешно опубликован",
    errorAddingComment: "Не удалось добавить комментарий. Попробуйте еще раз",
    commentRequired: "Комментарий обязателен",
    signInToComment: "Войдите, чтобы оставить комментарий",
    noCommentsYet: "Пока нет комментариев",
    beFirstToComment: "Будьте первым, кто оставит комментарий!",
  },

  kz: {
    // App
    appName: "Онлайн Кітапхана",

    // Navigation
    home: "Басты бет",
    cart: "Себет",
    profile: "Профиль",
    signIn: "Кіру",
    signOut: "Шығу",
    signUp: "Тіркелу",

    // Hero
    heroTitle: "Келесі керемет кітабыңызды табыңыз",
    heroDescription:
      "Мыңдаған кітаптарды зерттеңіз, жеке кітапханаңызды құрыңыз және сүйікті кітаптарыңыз туралы толық ақпаратты жүктеп алыңыз.",
    startExploring: "Зерттеуді бастау",

    // Search & Filters
    searchPlaceholder: "Кітаптар, авторлар немесе тақырыптарды іздеу...",
    search: "Іздеу",
    searchResults: "Іздеу нәтижелері",
    noSearchResults: "Сіздің сұранысыңыз бойынша кітаптар табылмады",
    tryDifferentSearch: "Басқа кілт сөздер бойынша іздеп көріңіз",
    selectCategory: "Санатты таңдау",
    allCategories: "Барлық санаттар",
    sortBy: "Сұрыптау",
    relevance: "Сәйкестік",
    newest: "Жаңа",
    oldest: "Ескі",
    title: "Атауы",
    clearFilters: "Сүзгілерді тазалау",

    // Books
    addToCart: "Себетке қосу",
    inCart: "Себетте",
    addToFavorites: "Таңдаулыларға қосу",
    removeFromFavorites: "Таңдаулылардан алып тастау",
    downloadPDF: "PDF жүктеу",
    loadMore: "Көбірек жүктеу",
    noBooksFound: "Кітаптар табылмады",
    errorLoadingBooks: "Кітаптарды жүктеу қатесі",
    noImage: "Сурет жоқ",
    by: "автор",
    ratings: "бағалау",

    // Book Details
    description: "Сипаттама",
    bookDetails: "Кітап мәліметтері",
    publisher: "Баспагер",
    publishedDate: "Жарияланған күні",
    pages: "Беттер",
    language: "Тіл",
    goBack: "Артқа",
    bookNotFound: "Кітап табылмады",

    // Cart
    myCart: "Менің себетім",
    book: "кітап",
    books: "кітап",
    downloadAllPDFs: "Барлық PDF жүктеу",
    clearCart: "Себетті тазалау",
    emptyCart: "Себетіңіз бос",
    emptyCartDescription: "Бастау үшін себетке кітаптар қосыңыз",
    continueBrowsing: "Қарауды жалғастыру",
    remove: "Алып тастау",
    downloading: "Жүктелуде...",

    // Profile
    myProfile: "Менің профилім",
    memberSince: "Мүше болған уақыт",
    booksInCart: "Себеттегі кітаптар",
    favoriteBooks: "Сүйікті кітаптар",
    booksReadyToDownload: "кітап жүктеуге дайын",
    booksInFavorites: "кітап таңдаулыларда",
    recentActivity: "Соңғы белсенділік",
    recentlyAdded: "Жақында қосылған",
    viewAllInCart: "Себеттегі барлығын көру",
    noRecentActivity: "Соңғы белсенділік жоқ",
    preferences: "Баптаулар",
    theme: "Тақырып",
    system: "Жүйелік",
    notifications: "Хабарландырулар",
    enabled: "Қосылған",

    // Auth - Sign In
    welcomeBack: "Қайта келуіңізбен",
    signInDescription: "Жеке кітапханаңыз бен сақталған кітаптарыңызға қол жеткізу үшін кіріңіз",
    signInWithGoogle: "Google арқылы кіру",
    signInWithEmail: "Email арқылы кіру",
    signInAgreement: "Кіру арқылы сіз біздің Қызмет шарттары мен Құпиялылық саясатымызбен келісесіз",
    signInRequired: "Кіру қажет",
    signInToViewCart: "Себетті көру үшін кіріңіз",
    signInToViewProfile: "Профильді көру үшін кіріңіз",
    signInToViewFavorites: "Таңдаулыларды көру үшін кіріңіз",
    signingIn: "Кіруде...",
    signInToAddToCart: "Кітаптарды себетке қосу үшін кіріңіз",
    signInToAddToFavorites: "Кітаптарды таңдаулыларға қосу үшін кіріңіз",
    signInToDownload: "Кітаптарды жүктеу үшін кіріңіз",
    orContinueWith: "немесе жалғастыру",
    email: "Email",
    password: "Құпия сөз",
    enterEmail: "Email енгізіңіз",
    enterPassword: "Құпия сөзді енгізіңіз",
    forgotPassword: "Құпия сөзді ұмыттыңыз ба?",
    dontHaveAccount: "Аккаунтыңыз жоқ па?",

    // Auth - Sign Up
    createAccount: "Аккаунт жасау",
    signUpDescription: "Жеке кітапханаңызды құруды бастау үшін аккаунт жасаңыз",
    signUpWithGoogle: "Google арқылы тіркелу",
    signUpAgreement: "Аккаунт жасау арқылы сіз біздің Қызмет шарттары мен Құпиялылық саясатымызбен келісесіз",
    signingUp: "Аккаунт жасалуда...",
    fullName: "Толық аты",
    enterFullName: "Толық атыңызды енгізіңіз",
    confirmPassword: "Құпия сөзді растау",
    alreadyHaveAccount: "Аккаунтыңыз бар ма?",

    // Auth - Reset Password
    resetPassword: "Құпия сөзді қалпына келтіру",
    resetPasswordDescription:
      "Email мекенжайыңызды енгізіңіз, біз сізге құпия сөзді қалпына келтіру сілтемесін жібереміз",
    resetPasswordSuccessDescription: "Біз сізге құпия сөзді қалпына келтіру сілтемесін жібердік",
    sendResetEmail: "Қалпына келтіру хатын жіберу",
    sendingResetEmail: "Жіберілуде...",
    resetPasswordEmailSent: "Құпия сөзді қалпына келтіру хаты сәтті жіберілді!",
    checkEmailInstructions: "Құпия сөзді қалпына келтіру нұсқаулары үшін электрондық поштаңызды тексеріңіз",
    backToSignIn: "Кіруге оралу",

    // Form Validation
    fillAllFields: "Барлық өрістерді толтырыңыз",
    passwordsDoNotMatch: "Құпия сөздер сәйкес келмейді",
    passwordTooShort: "Құпия сөз кемінде 6 таңбадан тұруы керек",

    // Error Messages
    userNotFound: "Бұл email мекенжайымен аккаунт табылмады",
    wrongPassword: "Қате құпия сөз",
    invalidEmail: "Жарамсыз email мекенжайы",
    userDisabled: "Бұл аккаунт өшірілген",
    tooManyRequests: "Тым көп сәтсіз әрекет. Кейінірек қайталаңыз",
    networkError: "Желі қатесі. Байланысты тексеріңіз",
    signInError: "Кіру сәтсіз. Қайталап көріңіз",
    emailAlreadyInUse: "Бұл email мекенжайымен аккаунт бұрыннан бар",
    weakPassword: "Құпия сөз тым әлсіз",
    signUpError: "Аккаунт жасау сәтсіз. Қайталап көріңіз",
    resetPasswordError: "Қалпына келтіру хатын жіберу сәтсіз. Қайталап көріңіз",

    // Toast Messages
    addedToCart: "Себетке қосылды",
    bookAddedToCart: "{{title}} себетіңізге қосылды",
    removedFromCart: "Себеттен алынды",
    bookRemovedFromCart: "{{title}} себетіңізден алынды",
    addedToFavorites: "Таңдаулыларға қосылды",
    bookAddedToFavorites: "{{title}} таңдаулыларыңызға қосылды",
    removedFromFavorites: "Таңдаулылардан алынды",
    bookRemovedFromFavorites: "{{title}} таңдаулыларыңыздан алынды",
    cartCleared: "Себет тазаланды",
    allBooksRemovedFromCart: "Барлық кітаптар себеттен алынды",
    downloadStarted: "Жүктеу басталды",
    pdfDownloadStarted: "PDF жүктеу басталды",
    allDownloadsStarted: "Барлық жүктеулер басталды",
    allPDFsDownloadStarted: "Барлық PDF жүктеулер басталды",
    error: "Қате",
    errorLoadingBook: "Кітап мәліметтерін жүктеу сәтсіз",
    errorDownloadingPDF: "PDF жүктеу сәтсіз",
    errorDownloadingAllPDFs: "Барлық PDF жүктеу сәтсіз",

    // Favorites
    favorites: "Таңдаулылар",
    myFavorites: "Менің таңдаулыларым",
    emptyFavorites: "Таңдаулыларыңыз бос",
    emptyFavoritesDescription: "Бастау үшін таңдаулыларға кітаптар қосыңыз",
    clearFavorites: "Таңдаулыларды тазалау",
    favoritesCleared: "Таңдаулылар тазаланды",
    allBooksRemovedFromFavorites: "Барлық кітаптар таңдаулылардан алынды",

    // Purchase & Cart
    orderSummary: "Тапсырыс қорытындысы",
    subtotal: "Аралық қосынды",
    tax: "Салық",
    total: "Барлығы",
    purchaseNow: "Қазір сатып алу",
    processing: "Өңделуде...",
    purchaseAgreement: "Сатып алу арқылы сіз біздің шарттармен келісесіз",
    purchaseSuccessful: "Сатып алу сәтті!",
    purchaseConfirmationSent: "Растау хаты поштаңызға жіберілді",
    purchaseError: "Сатып алуды өңдеу сәтсіз. Қайталап көріңіз",

    // Comments & Reviews
    reviewsAndComments: "Пікірлер мен комментарийлер",
    review: "пікір",
    reviews: "пікірлер",
    selectRating: "Бағалауды таңдаңыз",
    writeComment: "Комментарийіңізді жазыңыз...",
    postComment: "Комментарий жариялау",
    posting: "Жариялануда...",
    commentAdded: "Комментарий қосылды",
    commentAddedSuccessfully: "Сіздің комментарийіңіз сәтті жарияланды",
    errorAddingComment: "Комментарий қосу сәтсіз. Қайталап көріңіз",
    commentRequired: "Комментарий міндетті",
    signInToComment: "Комментарий қалдыру үшін кіріңіз",
    noCommentsYet: "Әлі комментарийлер жоқ",
    beFirstToComment: "Комментарий қалдыратын бірінші адам болыңыз!",
  },
}

interface LanguageProviderProps {
  children: React.ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage && translations[savedLanguage as keyof typeof translations]) {
      setLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (lang: string) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string, params?: Record<string, string>) => {
    const translation = translations[language as keyof typeof translations]
    let text = translation[key as keyof typeof translation] || key

    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{{${param}}}`, value)
      })
    }

    return text
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
