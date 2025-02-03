import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Project from "./project";

const Wrapper = styled.form`
  display: flex;
  flex-direction: column;
  
`;

export default function Make(){
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const str = e.target.value;
    setYear(str.substring(0, 4));
    setMonth(str.substring(5, 7));
    setDay(str.substring(8, 10));
  }
  return <Wrapper>
      <h1>시작 날짜를 입력해주세요</h1>
      <h1>일주일 분량의 근무가 짜여집니다.</h1>
      <input onChange={onChange} type="date" id="today" name="today-work">
      
      </input>

    <Project/>
      

    </Wrapper>
}