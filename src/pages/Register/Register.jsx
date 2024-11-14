import React, { useState } from "react";
import {
  Form,
  Label,
  Input,
  Container,
  Button,
  InputWrapper,
  H3,
  Span,
  RegisterContent,
  RegisterForm,
  RegisterInfo,
  LoginPart,
} from "./Register.style";
import "react-phone-number-input/style.css";
import Layout from "../../Layout";
import { useNavigate } from "react-router-dom";
// import Notification from "../../components/notification/Notification";

const Register = () => {
  const initialFormData = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  // const [alert, setAlert] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password does not match";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleStateChange = (val) => {
    setFormData((prevData) => ({ ...prevData, state: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    const { confirmPassword, ...formDataToSend } = formData; // Exclude confirmPassword
    try {
      const response = await fetch(
        "https://api2.batterycoin.org/api/accounts/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataToSend),
        }
      );
      if (!response.ok) {
        if (
          response.statusText === "Bad Request" ||
          response.statusText === "Not Found"
        ) {
          setErrors({
            email: "Email already exists",
          });
        }
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // setAlert(false);
      // navigate("/address");
      navigate("/");
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  return (
    <Layout pageTitle="Battery - Join the UFOP">
      <Container>
        <Form onSubmit={handleSubmit}>
          <H3>Join the Federation of Planets</H3>

          <LoginPart>
            <span style={{ color: "#333333" }}>
              You already have a account?{" "}
              <a
                href="/"
                style={{
                  color: "#3333DD",
                  textDecoration: "none",
                  transition: "text-decoration 0.3s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.textDecoration = "underline")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.textDecoration = "none")
                }
              >
                Login
              </a>
            </span>
          </LoginPart>

          <RegisterContent>
            <RegisterForm>
              <p style={{ color: "gray" }}>
                Welcome to the United Federation of Planets! By joining, you
                become part of an interstellar community dedicated to peaceful
                exploration, cooperation, and shared progress. Please create
                your account to gain access to exclusive resources and
                participate in the Battery Coin Pre-Sale.
              </p>

              <Label htmlFor="email">Email address*</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <Span>{errors.email}</Span>}

              <Label htmlFor="password">Password*</Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && <Span>{errors.password}</Span>}

              <Label htmlFor="confirmPassword">Confirm Password*</Label>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword && <Span>{errors.confirmPassword}</Span>}

              <p style={{ color: "gray" }}>
                By joining the Federation, you agree to uphold the principles of
                cooperation, exploration, and mutual respect among all members.
                Before proceeding, please confirm your acceptance of the terms
                below:
              </p>
              <div style={{ marginTop: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <input
                    type="checkbox"
                    id="acceptance"
                    name="acceptance"
                    required
                  />
                  <Label
                    htmlFor="acceptance"
                    style={{ marginLeft: "0.5vw", color: "gray" }}
                  >
                    I confirm my acceptance to join the United Federation of
                    Planets *
                  </Label>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <input type="checkbox" id="terms" name="terms" required />
                  <Label
                    htmlFor="terms"
                    style={{ marginLeft: "0.5vw", color: "gray" }}
                  >
                    I have read and agree to the{" "}
                    <a
                      href="https://batterycoin.org/rax/terms.html"
                      style={{ color: "#00aaff" }}
                    >
                      Terms of Service
                    </a>{" "}
                    *
                  </Label>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input type="checkbox" id="privacy" name="privacy" required />
                  <Label
                    htmlFor="privacy"
                    style={{ marginLeft: "0.5vw", color: "gray" }}
                  >
                    I have read and agree to the{" "}
                    <a
                      href="https://batterycoin.org/rax/privacy.html"
                      style={{ color: "#00aaff" }}
                    >
                      Privacy Policy
                    </a>{" "}
                    *
                  </Label>
                </div>
              </div>
            </RegisterForm>
            <RegisterInfo>
              <div>
                <h4>Why Join The Federation?</h4>
                <p>
                  Members gain access to exclusive content, community benefits,
                  and a platform for contributing to the advancement of space
                  exploration, knowledge sharing, and Battery Coin
                  opportunities.
                </p>
                <h4 style={{ marginTop: "10px" }}>Need Help?</h4>
                <p>
                  If you encounter any issues or need assistance, please contact
                  our support team at{" "}
                  <a href="mailto:support@batterycoin.org">
                    support@batterycoin.org
                  </a>
                </p>
              </div>
            </RegisterInfo>
          </RegisterContent>
          <Button type="submit">Register</Button>
        </Form>
      </Container>
      {/* {alert ? (
        <Notification notificationDone={alert} textMessage="Registering..." />
      ) : (
        <></>
      )} */}
    </Layout>
  );
};

export default Register;
