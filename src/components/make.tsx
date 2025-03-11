import { useState } from "react";
import styled from "styled-components";
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
  const [date, setDate] = useState<string>("");

  const onDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  }
  
  return <Wrapper>

      <h1>일주일 분량의 근무가 짜여집니다.</h1>

    <p>시작 날짜(월요일)를 입력해주세요!</p>
    <InputDate>
      <input type="date" id="today" name="today" onChange={onDate} />
    </InputDate>

    <ToggleList date={date}/>


    <Project date={date}/>
      

    </Wrapper>
}