import FormInput from "../form-input/form-input.component";
import "./sign-in-form.styles.scss";
import { useState } from "react";
import Button from "../button/button.component";
import {
  createUserDocumentFromAuth,
  signInWithGooglePopup,
  loginUserWithEmailAndPassword,
} from "../../utils/firebase/firebase.utils";

const defaultFormFields = {
  email: "",
  password: "",
};

const SignInForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);

  const { email, password } = formFields;

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formFields);
    try {
      const { user } = await loginUserWithEmailAndPassword(email, password);
      console.log(user);
      resetFormFields();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleGoogleLogin = async (event) => {
    event.preventDefault();
    const { user } = await signInWithGooglePopup();
    await createUserDocumentFromAuth(user);
  };

  return (
    <div className="sign-in-container">
      <h2>Already have and account ?</h2>
      <span>Sign in with yout email and password</span>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          type="text"
          required
          onChange={handleChange}
          name="email"
          value={email}
        />

        <FormInput
          label="Password"
          type="password"
          required
          onChange={handleChange}
          name="password"
          value={password}
        />
        <div className="buttons-container">
          <Button type="submit">Sign In</Button>
          <Button type="button" buttonType="google" onClick={handleGoogleLogin}>
            Google sign in
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
