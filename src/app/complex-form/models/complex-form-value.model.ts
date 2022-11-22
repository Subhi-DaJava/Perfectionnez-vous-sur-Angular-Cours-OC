export class ComplexFormValue {
  personnelInfo!: {
    firstName: string,
    lastName: string
  };

  contactPreference!: string;

  email?: {
    email: string,
    confirm: string
  };

  phone?: string;

  loginInfo!: {
    username: string,
    password: string,
    confirmPassword: string
  };
}
