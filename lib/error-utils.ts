// Централизованная обработка ошибок аутентификации
export function getAuthErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    "auth/user-not-found": "userNotFound",
    "auth/wrong-password": "wrongPassword",
    "auth/invalid-email": "invalidEmail",
    "auth/user-disabled": "userDisabled",
    "auth/too-many-requests": "tooManyRequests",
    "auth/network-request-failed": "networkError",
    "auth/email-already-in-use": "emailAlreadyInUse",
    "auth/weak-password": "weakPassword",
  }

  return errorMessages[errorCode] || "signInError"
}

// Валидация форм
export function validateSignUpForm(data: {
  displayName: string
  email: string
  password: string
  confirmPassword: string
}): string | null {
  if (!data.displayName || !data.email || !data.password || !data.confirmPassword) {
    return "fillAllFields"
  }

  if (data.password !== data.confirmPassword) {
    return "passwordsDoNotMatch"
  }

  if (data.password.length < 6) {
    return "passwordTooShort"
  }

  return null
}

export function validateSignInForm(data: { email: string; password: string }): string | null {
  if (!data.email || !data.password) {
    return "fillAllFields"
  }

  return null
}
