import styled from "styled-components";

export const errors = {
    "auth/email-already-in-use": "That email already exists."
}

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 420px;
  padding: 50px 20px;
  background-color: white;
  
`;

export const Title = styled.h1`
  font-size: 30px;
  font-weight: bold;
  color:rgb(192, 73, 186);
`;
export const Form = styled.form`
  margin-top: 50px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;
export const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: solid 1px black;
  width: 100%;
  font-size: 16px;
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const Error = styled.span`
    font-weight: 600;
    color: tomato;
`;

export const Switcher = styled.span`
    margin-top: 20px;
    font-size: 15px;
    a {
        color: green;
    }
`