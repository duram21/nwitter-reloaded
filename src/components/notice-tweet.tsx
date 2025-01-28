import { collection, getDocs, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";
import Title from "./writing-list";
import { IWriting } from "../routes/notice";
import { Link } from "react-router-dom";

export interface ITweet {
  id: string;
  photo?: string;
  tweet:string;
  userId:string;
  username:string;
  createdAt?:number;
}

const Wrapper = styled.div`
  display: flex;
  gap :10px;
  flex-direction: column;
  text-decoration: none;
`;

type NoticeNum = {
  noticeName: string;
}

export default function NoticeTweet({noticeName} : NoticeNum){
  const [tweets, setTweets] = useState<IWriting[]>([]);
  const fecthTweets = async () => {
    let tweetQuery = null;
    if (noticeName === "all") {
      tweetQuery = query(
        collection(db, `writings`),
        orderBy("createdAt", "desc"),
        limit(25)
      );
    }
    else {
      tweetQuery = query(
        collection(db, `writings`),
        where("noticeName", "==", noticeName),
        orderBy("createdAt", "desc"),
        limit(25)
      );
    }
    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map(doc => {
      const {title, noticeName, createdAt, userId, username, photo } = doc.data();
      return {
        title,
        noticeName,
        createdAt,
        userId,
        username,
        photo,
        id: doc.id,
      }
    })
    console.log(tweets);
    setTweets(tweets);
  };
  useEffect(() => {
    fecthTweets();
  }, [noticeName]);

  return <Wrapper>
    {tweets.map((tweet) => (<Title key={tweet.id} {...tweet}/>))}
    </Wrapper>
}