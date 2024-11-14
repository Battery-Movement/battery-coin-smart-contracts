import styled from "styled-components";
import BannerBgImg from "../../assets/images/banner/banner3-bg.png";

export const Container = styled.div`
  background-image: url(${BannerBgImg});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 0 auto;
  padding: 5vw 2vw;
  background-color: #f8f9fa;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);

  & > div:first-child {
    width: 100%;
    height: 100%;
    max-width: 500px;
  }

  & > div:last-child {
    margin-left: 5vh;
    margin-top: 0;
    height: fit-content;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: center;
    padding: 5vw 1.5vw;
  }

  @media (max-width: 768px) {
    padding: 4vw 1vw;
  }
`;

export const H3 = styled.h3`
  margin-bottom: 2vw;
  color: #333;
  font-weight: bold;
  text-align: center;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 4vw;
  border-radius: 1.6vw;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 1000px;

  @media (max-width: 768px) {
    padding: 3vw;
  }
`;

export const Label = styled.label`
  margin: 0.5vw 0;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 1.5vw;
  margin-top: 2vw;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.5vw;
  border: 1px solid #ccc;
  border-radius: 0.5vw;
  transition: border-color 0.3s;
  max-height: 5vh;

  &:focus {
    border-color: #0056b3;
    outline: none;
  }
`;

export const Button = styled.button`
  margin-top: 3vw;
  padding: 1vw;
  background: linear-gradient(90deg, #007bff, #ff00ff);
  color: #fff;
  border: none;
  border-radius: 1vw;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-0.2vw);
  }

  &:active {
    transform: translateY(0);
  }
`;
export const Span = styled.span`
  color: red;
  font-size: 0.9vw;
  margin-top: 0.5vw;
  display: block;

  @media (max-width: 768px) {
    font-size: 1.5vw;
  }
`;

export const OrderSummary = styled.div`
  width: 100%;
  max-width: 40vw;
  padding: 3vw;
  border: 1px solid #ccc;
  border-radius: 1.6vw;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 4vw;
  text-align: center;

  h3 {
    margin-bottom: 2vw;
    color: #333;
  }

  p {
    margin: 1vw 0;
    color: #555;
  }

  button {
    display: block;
    width: 60%;
    margin: 2vw auto 0;
    padding: 1.2vw 2vw;
    background-color: #28a745;
    color: #fff;
    border: none;
    border-radius: 0.8vw;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;

    &:hover {
      background-color: #218838;
      transform: translateY(-0.2vw);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }

  @media (max-width: 768px) {
    margin-top: 2vw;
    padding: 2vw;
  }
`;
