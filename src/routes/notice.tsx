import { collection, getDocs, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import NoticeTweet from "../components/notice-tweet";



const Wrapper = styled.div`
  display: flex;
  gap :10px;
  flex-direction: column;
`;

const NoticeWrapper = styled.div`
  display:flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
`

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
      console.log(e.target.id);
      setNoticeName(e.target.id);
    }
  return <Wrapper>
    <NoticeWrapper>
      <input onChange={changeNoticeName} type="radio" name="NameNotice" id="all"></input>
      <label for="all">전체</label>
      <input onChange={changeNoticeName} type="radio" name="NameNotice" id="notice1"></input>
      <label for="notice1">게시판1</label>
      <input onChange={changeNoticeName} type="radio" name="NameNotice" id="notice2"></input>
      <label for="notice2">게시판2</label>
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