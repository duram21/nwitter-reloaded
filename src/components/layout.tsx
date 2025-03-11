import { Link, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../firebase";


const TitleArea = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
    border: white  1px;
    p{
      font-size: 40px;
      color: #9055A2;
      margin: 10px;
    }

`;

  const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 100%;
    padding: 50px 0px;

    ${TitleArea}{
      grid-column: span 2;
    }
    header{
      display: flex;
      justify-content: space-between;
      background-color: white;
      border-radius: 8px;
      border: 3px solid #bb94e9;
      
    }
  `;
  const Menu = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 5px;
    padding: 10px;
    background-color: white;


    `;
  const MenuItem = styled.div`
    cursor: pointer;
    display: flex;
    color: white;
    font-size: 16px;
    font-weight: bold;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    border: 3px solid #a290b8;

    height: 80px;
    width: 80px;
    border-radius: 20px;
    background-color:#9598ff;
    svg {
      width: 50px;

      color: #e7d0ff;
    }
    &.log-out {
      svg {
;
      }
    }
  `;

export default function Layout(){
  const navigate = useNavigate();
  const onLogOut = async() => {
    const ok = confirm("Are you sure you want to log out?");
    
    if(ok){
      await auth.signOut();
      navigate("/login");
    }
  }

  return (
    <Wrapper>
      <header>
        <TitleArea>
          <p>근무를 열심히😊</p>
        </TitleArea>
        <Menu>
          <Link to="/" style={{ textDecoration: "none" }}>
            <MenuItem>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <h1>홈</h1>
            </MenuItem>
          </Link>
          <Link to="/profile" style={{ textDecoration: "none" }}>
            <MenuItem>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              <h1>프로필</h1>
            </MenuItem>
          </Link>
          <Link to="/notice" style={{ textDecoration: "none" }}>
            <MenuItem>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <h1>게시판</h1>

            </MenuItem>
          </Link>
          <Link to="/write" style={{ textDecoration: "none" }}>
            <MenuItem>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>

              <h1>글쓰기</h1>
            </MenuItem>
          </Link>
          <MenuItem onClick={onLogOut} className="log-out">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
            <h1>로그아웃</h1>

          </MenuItem>


        </Menu>
      </header>
      <Outlet />
    </Wrapper>
  );
}