import { collection, getDocs, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import NoticeList from "../components/notice-list";
import Timeline from "../components/timeline";
import NoticeTweet from "../components/notice-tweet";
import NoticeTweetForm from "../components/notice-tweet-form";



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
  const [noticeName, setNoticeName] = useState("");
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
      console.log(11);
    }, []);
    const onNotice = (x: string) => {
      setNoticeName(x);
    }

  return <Wrapper>
    <NoticeWrapper>
      {notices.map((notice) => (<NoticeList key={notice.id} {...notice} noticeNum={onNotice}/>))}
    </NoticeWrapper>

    {noticeName ? 
    <div>
      <NoticeTweetForm num={noticeName}/>
      <NoticeTweet num={noticeName} />
    </div>
    : null}
     
    </Wrapper>
}