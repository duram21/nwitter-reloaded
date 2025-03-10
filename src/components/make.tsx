import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Project from "./project";
import ToggleList from "./limit-list";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const InputDate = styled.div`
  display: flex;

  
  input[type=date]{
    padding: 5px;
    border: 1px solid #423939;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    border-radius: 5px;
    font-size: 16px;
  }
  p{
    font-size : 20px;
  }
`;

export default function Make(){
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [date, setDate] = useState("");

  const onDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  }
  
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const str = e.target.value;
    setYear(str.substring(0, 4));
    setMonth(str.substring(5, 7));
    setDay(str.substring(8, 10));
  }
  
  return <Wrapper>

      <h1>일주일 분량의 근무가 짜여집니다.</h1>

    <p>시작 날짜(월요일)를 입력해주세요!</p>
    <InputDate>
      <input type="date" id="today" name="today" onChange={onDate} />
    </InputDate>

    <ToggleList date={date}> </ToggleList>


    <Project date={date}/>
      

    </Wrapper>
}