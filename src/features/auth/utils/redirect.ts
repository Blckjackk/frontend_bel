export const getRedirectPath = (role: string | undefined): string => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'office_provider':
    case 'provider':
      return '/provider';
    case 'user':
    case 'customer':
      return '/customer';
    default:
      return '/auth/login';
  }
};

export const getChatPath = (role: string | undefined): string => {
  switch (role) {
    case 'admin':
      return '/admin/chat';
    case 'office_provider':
    case 'provider':
      return '/provider/chat';
    case 'user':
    case 'customer':
      return '/customer/chat';
    default:
      return '/auth/login';
  }
};
