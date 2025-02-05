/**
 * messages/store/user/auth
 *
 * 사용자 로그인, 가입 관련 텍스트들 모음
 */

export const TEXT = [
  /* LANG.KO */ {
    NO_RESPONSE: "서버로부터 응답을 받을 수 없습니다. 관리자에게 문의해 주세요.",
    INVALID_EMAIL: "유효하지 않은 이메일 주소입니다.",
    EXIST_EMAIL: "이미 등록된 아이디(이메일) 입니다. 다른 이메일 주소를 넣어주세요.",
    AVAILABLE_EMAIL: "사용할 수 있는 아이디입니다.",
    INVALID_PASSWORD:
      "비밀번호는 8글자 이상, 숫자/대문자/특수문자를 각각 하나 이상 포함해야 합니다.",
    INVALID_ID_PW: "아이디 혹은 비밀번호가 올바르지 않습니다.",
    INVALID_NAME: "이름은 2글자 이상 입력해 주세요.",
    EXIST_NAME: "이미 등록된 이름입니다. 다른 이름을 만들어보세요.",
    AVAILABLE_NAME: "사용할 수 있는 이름입니다.",
    SIGNUP_COMPLETE: "회원 가입이 완료되었습니다. 지금 바로 로그인 해보세요.",
    ASKED_RESET_PASSWORD:
      "관리자에게 비밀번호 초기화를 요청 하였습니다. 메일로 결과를 알려드리겠습니다.",
    SENT_RESET_PASSWORD: "비밀번호 초기화 메일을 발송하였습니다.",
    DIFFERENT_PASSWORD: "비밀번호를 서로 다르게 입력하셨습니다.",
    UNABLE_CHANGE_PASSWORD: "비밀번호를 변경하지 못했습니다. 관리자에게 문의해 주세요.",
    SUCCESS_CHANGE_PASSWORD: "비밀번호를 성공적으로 변경하였습니다. 로그인 페이지로 이동합니다.",
    FAILED_ADD_USER: "신규 사용자 등록에 실패하였습니다.",
    WELCOME_USER: "환영합니다",
    GOODBYE_USER: "다음에 다시 뵐께요!",
    MYINFO_SUCCESS: "내 정보를 성공적으로 수정 하였습니다.",
    SENT_VERIFICATION:
      "(으)로 메일을 보내드렸습니다. 인증 메일을 확인해 주시고, 가입 절차를 완료해 보세요!",
    WRONG_VERIFY_TARGET: "인증 대상이 잘못 지정되어 있습니다.",
    WRONG_VERIFICATION_LENGTH: "인증 코드는 6자리여야 합니다.",
    WRONG_VERIFICATION_CODE: "인증 코드가 잘못되었습니다. 대소문자 등 다시 확인해 주세요.",
    VERIFY_EMPTY_EMAIL: "이메일 주소가 기입되어 있지 않습니다. 가입 화면으로 이동합니다.",
    VERIFY_EMPTY_NAME: "이름이 작성되지 않습니다. 가입 화면으로 이동합니다.",
    VERIFY_EMPTY_PASSWORD: "비밀번호가 작성되지 않습니다. 가입 화면으로 이동합니다.",
    FAILED_UPDATE_MYINFO: "내 정보를 수정할 수 없었습니다.",
    FAILED_LOAD_MYINFO: "내 정보를 가져올 수 없었습니다.",
  },
  /* LANG.EN */ {
    NO_RESPONSE: "Unable to receive a response from the server. Please contact the administrator.",
    INVALID_EMAIL: "The email address is invalid.",
    EXIST_EMAIL: "The email address is already registered. Please use a different email address.",
    AVAILABLE_EMAIL: "The email address is available.",
    INVALID_PASSWORD:
      "Password must be at least 8 characters long and include at least one number, one uppercase letter, and one special character.",
    INVALID_ID_PW: "The ID or password is incorrect.",
    INVALID_NAME: "Please enter a name of at least 2 characters.",
    EXIST_NAME: "The name is already registered. Please try a different name.",
    AVAILABLE_NAME: "The name is available.",
    SIGNUP_COMPLETE: "Registration complete. You can now log in.",
    ASKED_RESET_PASSWORD:
      "A password reset request has been sent to the administrator. You will receive an email with the result.",
    SENT_RESET_PASSWORD: "A password reset email has been sent.",
    DIFFERENT_PASSWORD: "The passwords entered do not match.",
    UNABLE_CHANGE_PASSWORD: "Unable to change the password. Please contact the administrator.",
    SUCCESS_CHANGE_PASSWORD: "Password successfully changed. Redirecting to the login page.",
    FAILED_ADD_USER: "Failed to register new user.",
    WELCOME_USER: "Welcome",
    GOODBYE_USER: "See you next time!",
    MYINFO_SUCCESS: "Your information has been successfully updated.",
    SENT_VERIFICATION:
      "A verification email has been sent to you. Please check your email and complete the registration process.",
    WRONG_VERIFY_TARGET: "The verification target is incorrectly specified.",
    WRONG_VERIFICATION_LENGTH: "The verification code must be 6 digits long.",
    WRONG_VERIFICATION_CODE:
      "The verification code is incorrect. Please check for any errors, including case sensitivity.",
    VERIFY_EMPTY_EMAIL:
      "No email address has been entered. Redirecting to the registration screen.",
    VERIFY_EMPTY_NAME: "No name has been entered. Redirecting to the registration screen.",
    VERIFY_EMPTY_PASSWORD: "No password has been entered. Redirecting to the registration screen.",
    FAILED_UPDATE_MYINFO: "Unable to update your information.",
    FAILED_LOAD_MYINFO: "Unable to retrieve your information.",
  },
  /* LANG.CN */ {
    NO_RESPONSE: "无法收到服务器的响应。请联系管理员。",
    INVALID_EMAIL: "电子邮箱地址无效。",
    EXIST_EMAIL: "该电子邮箱地址已被注册。请使用其他邮箱地址。",
    AVAILABLE_EMAIL: "该电子邮箱地址可用。",
    INVALID_PASSWORD: "密码必须至少包含8个字符，并至少包含一个数字、一个大写字母和一个特殊字符。",
    INVALID_ID_PW: "ID或密码不正确。",
    INVALID_NAME: "请至少输入2个字符的名称。",
    EXIST_NAME: "该名称已被注册。请尝试使用其他名称。",
    AVAILABLE_NAME: "该名称可用。",
    SIGNUP_COMPLETE: "注册完成。您现在可以登录了。",
    ASKED_RESET_PASSWORD: "已向管理员发送密码重置请求。您将通过电子邮件收到结果。",
    SENT_RESET_PASSWORD: "已发送密码重置电子邮件。",
    DIFFERENT_PASSWORD: "输入的密码不匹配。",
    UNABLE_CHANGE_PASSWORD: "无法更改密码。请联系管理员。",
    SUCCESS_CHANGE_PASSWORD: "密码成功更改。正在重定向到登录页面。",
    FAILED_ADD_USER: "注册新用户失败。",
    WELCOME_USER: "欢迎",
    GOODBYE_USER: "下次见！",
    MYINFO_SUCCESS: "您的信息已成功更新。",
    SENT_VERIFICATION: "已向您发送验证电子邮件。请检查您的电子邮件并完成注册过程。",
    WRONG_VERIFY_TARGET: "验证目标指定错误。",
    WRONG_VERIFICATION_LENGTH: "验证码必须是6位数。",
    WRONG_VERIFICATION_CODE: "验证码不正确。请检查是否有任何错误，包括大小写敏感。",
    VERIFY_EMPTY_EMAIL: "未输入电子邮箱地址。正在重定向到注册屏幕。",
    VERIFY_EMPTY_NAME: "未输入名称。正在重定向到注册屏幕。",
    VERIFY_EMPTY_PASSWORD: "未输入密码。正在重定向到注册屏幕。",
    FAILED_UPDATE_MYINFO: "无法更新您的信息。",
    FAILED_LOAD_MYINFO: "无法检索您的信息。",
  },
]
Object.freeze(TEXT)
