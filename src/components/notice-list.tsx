import { styled } from "styled-components";
import { INotice } from "../routes/notice";
import {UserProps} from "../routes/notice"

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;
const Column = styled.div``;
const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;




const SaveButton = styled.button`
  background-color: red;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;





export default function NoticeList({name, id, noticeNum} : UserProps) {
  const onClick = () =>{
    noticeNum(id);
  }
  console.log(noticeNum);
  return (
    <div>
      <Wrapper>
      <Column>
        <Payload>{name}</Payload>
          <svg onClick={onClick} width="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
            <path stroke-line="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
      </Column>
    </Wrapper>
    </div>
    
  );
}