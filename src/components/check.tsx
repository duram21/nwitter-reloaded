import { addDoc, collection, getDocs, query, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import DisplayWork from "./dispalsy-work";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

  input{
    font-size: 20px;
    
  }
`;


export default function Check(){
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [workData, setWorkData] = useState();
  const [curWork, setCurWork] = useState();
  const [flag, setFlag] = useState(0);
  const [today, setToday] = useState();
  let idx = -2;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    const str = e.target.value;
    setToday(str);
  }


  return <Wrapper>
    <p>날짜를 선택해주세요</p>
    <input onChange={(e) => onChange(e)} type="date" id="today" name="today-work">
      </input>
      <DisplayWork dateData={today}></DisplayWork>

    </Wrapper>
}