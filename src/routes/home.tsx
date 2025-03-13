import styled from "styled-components";

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
  width: 560px;
  height: 950px;
  .workTable{
    font-size: 25px;
    font-weight: bold;
    color: black;
    padding: 5px;
  }
  background-color: white;
  border: 3px solid #bb94e9;
  border-radius: 8px;
  padding : 10px;
`;
const Wrapper = styled.div`
  /* display: grid; */
  display: flex;
  gap: 50px;
  
  ${TodayWork}{
  
  }
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  border-radius: 8px;
  border: 3px solid #bb94e9;
  background-color: white;
  padding : 30px;
`;

const MenuItem = styled.div`
    color: white;
    background-color: #fec8c9;
    font-size: 25px;
    font-weight: bold;
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
  background-color: white; 
  border-radius: 8px;
  border: 3px solid #bb94e9;
  gap : 10px;
  h{
    font-size: 20px;
  }
  padding : 10px;
`

const LeftMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap : 50px;
`;

const NoticeDetail = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: black;
  background-color: #88dba3;
  border-radius: 8px;
  .recentWriting{
    font-size: 20px;
  }
  p{
    padding: 20px;
  }
`

const MenuSvg = styled.div`
    cursor: pointer;
    color: #3b8686;
    background-color: #88dba3;
    padding: 10px;
    border-radius: 8px;
    display: flex;
    font-size: 13px;
    flex-direction: column;
    align-items: center;
    justify-content: center;

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
    <LeftMenu>
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

      <RecentWritings>
        <NoticeDetail>
          <p className="recentWriting">최근 글</p>
          <Link to="/notice" style={{ textDecoration: "none" }}>
            <MenuSvg>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <h1>더보기</h1>
            </MenuSvg>
          </Link>
        </NoticeDetail>
        <NoticeTweet noticeName={"all"}/>
      </RecentWritings>

    </LeftMenu>
      <TodayWork>
        <p className="workTable">{today} 근무표</p>
        <DisplayWork dateData={today}/>
      </TodayWork>
  </Wrapper>
  )
}