import styled from "styled-components";
import PostTweetForm from "../components/post-tweet-form";
import { auth } from "../firebase";
import Timeline from "../components/timeline";
import Notice from "./notice";
import { Link } from "react-router-dom";
import DisplayWork from "../components/dispalsy-work";
import { useEffect, useState } from "react";
import NoticeTweet from "../components/notice-tweet";


const TodayWork = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  gap : 10px;
  h{
    font-size: 20px;

  }
  border: 2px dashed white;
  padding : 10px;

`;
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 50px;
  
  ${TodayWork}{
    grid-row: span 2;
  
  }
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  border: 2px dashed white;
  padding : 10px;
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

const RecentWritings = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap : 10px;
  h{
    font-size: 20px;
  }
  border: 2px dashed white;
  padding : 10px;
`

const NoticeDetail = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const MenuSvg = styled.div`
    cursor: pointer;
    color: white;
    display: flex;
    font-size: 13px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: black;
    svg {
      width: 30px;
      fill: black;
    }
    &.log-out {
      svg {
        fill: gray;
      }
  }
`;

export default function Home() {
  const [today, setToday] = useState("");


  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setToday(formattedDate);
  }, []);
  return (
  <Wrapper>
      <Menu>
        <Link to="/make" style={{ textDecoration: "none" }}>
          <MenuItem>근무표 만들기</MenuItem>
        </Link>
        <Link to="/check" style={{ textDecoration: "none" }}>
          <MenuItem>근무 확인하기</MenuItem>
        </Link>
        <Link to="/manage" style={{ textDecoration: "none" }}>
          <MenuItem>인원 관리하기</MenuItem>
        </Link>
      </Menu>

      <TodayWork>
        <h>{today} 근무표</h>
        <DisplayWork dateData={today}> </DisplayWork>
      </TodayWork>
      <RecentWritings>
        <NoticeDetail>
          <h>최근 글</h>
          <Link to="/notice" style={{ textDecoration: "none" }}>
            <MenuSvg>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <h1>더보기</h1>
            </MenuSvg>
          </Link>
        </NoticeDetail>
        <NoticeTweet noticeName={"all"}></NoticeTweet>
      </RecentWritings>
  </Wrapper>
  )
}