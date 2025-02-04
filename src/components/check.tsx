import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Wrapper = styled.form`
  display: flex;
  flex-direction: column;
  
`;

export default function Check(){
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
      <input onChange={onChange} type="date" id="today" name="today-work">
        
      </input>

    </Wrapper>
}