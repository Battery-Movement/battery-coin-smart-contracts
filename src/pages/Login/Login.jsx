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
  RegisterPart,
} from "./Login.style";
import "react-phone-number-input/style.css";
import Layout from "../../Layout";
import { useNavigate } from "react-router-dom";
// import Notification from "../../components/notification/Notification";

const Login = () => {
  const initialFormData = {
    email: "",
    password: "",
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
    if (!formData.password) newErrors.street = "Password is required";
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
    try {
      const response = await fetch(
        "https://api2.batterycoin.org/api/accounts/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        if (
          response.statusText === "Unauthorized" ||
          response.statusText === "Not Found"
        ) {
          setErrors({
            email: "Email doesn't exist",
            password: "Password is incorrect",
          });
        }
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // setAlert(true);
      navigate("/buy");

      // if (data.bill_address) {
      // navigate("/buy");
      // } else {
      // navigate("/address");
      // }

      const { access } = data;
      if (access) {
        sessionStorage.setItem("access_token", access);
      } else {
        console.error("Access token not found in response");
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  return (
    <Layout pageTitle="Battery - Login">
      <Container>
        <Form onSubmit={handleSubmit}>
          <H3>Log In to Battery Coin</H3>

          <RegisterPart>
            <span style={{ color: "#333333" }}>
              Don't have an account yet?{" "}
              <a
                href="/#/register"
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
                Register
              </a>
            </span>
          </RegisterPart>

          <Label htmlFor="email" style={{ marginTop: "30px" }}>
            Email address*
          </Label>
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

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <input type="checkbox" id="stayLoggedIn" name="stayLoggedIn" />
              <Label htmlFor="stayLoggedIn" style={{ marginLeft: "0.5vw" }}>
                Stay Logged-in
              </Label>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <a
                href="#"
                style={{
                  color: "#00aaff",
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
                Forgot Password?
              </a>
            </div>
          </div>
          <Button type="submit">Login</Button>
        </Form>
      </Container>
      {/* {console.log("111111", alert)}
      {alert ? (
        <Notification notificationDone={alert} textMessage="Logging In..." />
      ) : (
        <></>
      )} */}
    </Layout>
  );
};

export default Login;
