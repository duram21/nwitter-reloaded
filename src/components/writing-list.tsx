import { styled } from "styled-components";
import { IWriting } from "../routes/notice";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  display: grid;
  grid-template: 1fr 1fr / 1fr;
  padding: 20px;
  border: 2px solid black;
  border-radius: 15px;
  color: black;
  font-weight: bold;
  background-color: white;
  
`;

const TItleTop = styled.div`
  display: flex;
  justify-content: space-between;
  
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 16px;
  text-decoration: none;
`;
const Payload = styled.p`
  margin: 5px 20px;
  font-size: 18px;
`;


export default function Title({ username, title, noticeName, id }: IWriting) {
  const moveAddress = `/content/${id}`
  const notice : {[key: string] : string} = {
    "announcement": "공지사항",
    "free": "자유게시판",
    "tip": "팁 게시판",
    "notice1": "게시판1",
    "notice2": "게시판2"
  }
  const key = noticeName;
  return (
        <Link to={moveAddress} style={{textDecoration: "none"}}>
    <Wrapper>
        <TItleTop>
          <Username>{username}</Username>
          <Username>{notice[key]}</Username>
        </TItleTop>
        <Payload>{title}</Payload>
    </Wrapper>
      </Link>
    
  );
}