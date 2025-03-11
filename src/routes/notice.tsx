import { collection, getDocs, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import NoticeTweet from "../components/notice-tweet";



const Wrapper = styled.div`
  display: flex;
  gap :50px;
  flex-direction: column;
`;

const NoticeWrapper = styled.div`
  display:flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
  background-color: white;
  padding: 10px;
  border-radius: 8px;
`
const NoticeBox = styled.div`
  background: black;
  padding: 0px 0px;
  border: 1px solid black;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;

  height: 50px;
  width: 100px;
  font-size: 20px;
  input[type=radio]{
    display:none;

  }
  :hover{
    background-color: #f7dcdc;
  }
`;

const Box = styled.div`
  background: #ffffff;
  padding: 0px 0px;
  border: 2px solid black;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;

  height: 50px;
  width: 100px;
  font-size: 20px;

`;

export interface IWriting {
  id: string;
  noticeName: string;
  photo?: string;
  detail: string;
  title: string;
  userId:string;
  username:string;
  createdAt?:number;
}

export interface INotice{
  id: string;
  name: string;
}

export type UserProps = {
  noticeNum(x: string) : void;
  id: string;
  name: string;
}

export default function Notice(){
  const [notices, setNotice] = useState<INotice[]>([]);
  const [noticeName, setNoticeName] = useState("all");
  const fecthTweets = async() => {
      const tweetQuery = query(
        collection(db, "notice"),
      );
      const snapshot = await getDocs(tweetQuery);
      const notices = snapshot.docs.map(doc => {
        const {name} = doc.data();
        return { 
          name,
          id: doc.id,
        }
      })
      setNotice(notices);
    };
    useEffect(() => {
      fecthTweets();
    }, []);
    const changeNoticeName = (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(e);
      setNoticeName(e.target.id);
    }
  return <Wrapper>
    <NoticeWrapper>
        <NoticeBox>
        <input onChange={changeNoticeName} type="radio"  name="NameNotice" id="all"></input>
        <label for="all">
          <Box>모든 글</Box>
        </label>
      </NoticeBox>
      <NoticeBox>
        <input onChange={changeNoticeName} type="radio" name="NameNotice" id="notice1"></input>
        <label for="notice1"><Box>게시판1</Box></label>
      </NoticeBox>
      <NoticeBox>        
        <input onChange={changeNoticeName} type="radio" name="NameNotice" id="notice2"></input>
        <label for="notice2"><Box>게시판2</Box></label>
      </NoticeBox>
      {/* {notices.map((notice) => (<NoticeList key={notice.id} {...notice} noticeNum={onNotice}/>))} */}
    </NoticeWrapper>

    
    {noticeName ? 
    <div>
      {/* <NoticeTweetForm num={noticeName}/> */}
      <NoticeTweet noticeName={noticeName} />
    </div>
    : null}
     
    </Wrapper>
}