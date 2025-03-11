import { useState } from "react";
import styled from "styled-components";
import DisplayWork from "./dispalsy-work";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
  .inputDiv{
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    p{
      text-align: center;
      font-weight: bold;
      font-size: 25px;
    }
    input{
      font-size: 20px;
        
      }
  }
  .displayDiv{
    background-color: white;
    padding: 20px;
    border-radius: 8px;


  }
`;


export default function Check(){
  
  const [today, setToday] = useState<string>("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    const str = e.target.value;
    setToday(str);
  }


  return <Wrapper>
    <div className="inputDiv">

      <p>날짜를 선택해주세요</p>
      <input onChange={(e) => onChange(e)} type="date" id="today" name="today-work">
        </input>
    </div>
    <div className="displayDiv">
      <DisplayWork dateData={today}/>
    </div>
    </Wrapper>
}