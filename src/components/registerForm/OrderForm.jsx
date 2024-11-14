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
} from "./OrderForm.style";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { getCountryCallingCode } from "react-phone-number-input";
import { getCode } from "iso-3166-1-alpha-2";
import { useNavigate } from "react-router-dom";

const OrderForm = () => {
  const initialFormData = {
    first_name: "",
    last_name: "",
    country: "",
    email: "",
    postal_code: "",
    address_line: "",
    street: "",
    city: "",
    state: "",
    phone_number: "+1",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = "First name is required";
    if (!formData.last_name) newErrors.last_name = "Last name is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.street) newErrors.street = "Street is required";
    if (!formData.postal_code)
      newErrors.postal_code = "Postal code is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!formData.phone_number || formData.phone_number === "+1") {
      newErrors.phone_number = "Phone number is required";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prevData) => ({ ...prevData, phone_number: value }));
  };

  const handleCountryChange = (val) => {
    const alpha2Code = getCode(val);
    const countryCode = getCountryCallingCode(alpha2Code);
    setFormData((prevData) => ({
      ...prevData,
      country: val,
      phone_number: `+${countryCode}`,
    }));
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
        "https://api2.batterycoin.org/api/accounts/billing-address/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        if (response.status === 409) {
          setErrors({ email: "Email already exists" });
        }
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      navigate("/buy");
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };
  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <H3>Billing Address</H3>

        <Label htmlFor="first_name">First name*</Label>
        <Input
          id="first_name"
          type="text"
          name="first_name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        {errors.first_name && <Span>{errors.first_name}</Span>}

        <Label htmlFor="last_name">Last name*</Label>
        <Input
          id="last_name"
          type="text"
          name="last_name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        {errors.last_name && <Span>{errors.last_name}</Span>}

        <Label htmlFor="country">Country*</Label>
        <CountryDropdown
          id="country"
          name="country"
          value={formData.country}
          onChange={handleCountryChange}
          classes="select"
          style={{
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            transition: "border-color 0.3s",
            width: "100%",
          }}
        />
        {errors.country && <Span>{errors.country}</Span>}

        <Label htmlFor="state">State*</Label>
        <RegionDropdown
          id="state"
          country={formData.country}
          value={formData.state}
          onChange={handleStateChange}
          classes="select"
          required
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            transition: "border-color 0.3s",
          }}
        />
        {errors.state && <Span>{errors.state}</Span>}

        <Label htmlFor="address_line">
          Apt, suite, unit, bldg, floor, etc.
        </Label>
        <Input
          id="address_line"
          type="text"
          name="address_line"
          value={formData.apartment}
          onChange={handleChange}
        />

        <Label htmlFor="city">City*</Label>
        <Input
          id="city"
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />
        {errors.city && <Span>{errors.city}</Span>}

        <Label htmlFor="street">Street</Label>
        <Input
          id="street"
          type="text"
          name="street"
          value={formData.Street}
          onChange={handleChange}
          required
        />
        {errors.street && <Span>{errors.street}</Span>}

        <Label htmlFor="postal_code">Postal code*</Label>
        <Input
          id="postal_code"
          type="text"
          name="postal_code"
          value={formData.postal_code}
          onChange={handleChange}
          required
        />
        {errors.postal_code && <Span>{errors.postal_code}</Span>}

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

        <Label htmlFor="phoneNumber">Phone Number*</Label>
        <PhoneInput
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phone_number}
          onChange={handlePhoneChange}
          required
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            transition: "border-color 0.3s",
            marginBottom: "20px",
            alignItems: "center",
          }}
        />
        {errors.phone_number && <Span>{errors.phone_number}</Span>}

        <Button type="submit">Save</Button>
      </Form>
      {/* <OrderSummary>
        <h3>Your Order</h3>
        <p>Reserve Date: Nov 4, 2024, 12:47 PM</p>
        <p>Round Number: 1</p>
        <p>BATT Token Price: $0.5</p>
        <p>Total BATT Amount: 10</p>
        <p>Total Paid Amount: 0.002050915541681424 ETH</p>
        <Button type="submit">Confirm</Button>
      </OrderSummary> */}
    </Container>
  );
};

export default OrderForm;
