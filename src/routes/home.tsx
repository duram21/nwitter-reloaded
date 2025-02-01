import styled from "styled-components";
import PostTweetForm from "../components/post-tweet-form";
import { auth } from "../firebase";
import Timeline from "../components/timeline";
import Notice from "./notice";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  grid-template-rows: 1fr 5fr;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const MenuItem = styled.div`
    color: white;
    background-color: black;
    font-size: 20px;
    border: 1px solid white;
    border-radius: 30px;
    padding: 20px;
    width: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
`;


export default function Home() {
  return (
  <Wrapper>
    <Menu>
      <Link to="/make" style={{textDecoration: "none"}}>
      <MenuItem>근무표 만들기</MenuItem>
      </Link>
      <Link to="/check" style={{textDecoration: "none"}}>
        <MenuItem>근무 확인하기</MenuItem>
      </Link>
      <Link to="/manage" style={{textDecoration: "none"}}>
        <MenuItem>인원 관리하기</MenuItem>
      </Link>
    </Menu>
    
  </Wrapper>
  )
}