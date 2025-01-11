import { collection, getDocs, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";

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
`;

type NoticeNum = {
  num: string;
}

export default function NoticeTweet({num} : NoticeNum){
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const aa = `notice/${num}/article`;
  console.log(aa);
  const fecthTweets = async () => {
    const tweetQuery = query(
      collection(db, `notice/${num}/article`),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map(doc => {
      const { tweet, createdAt, userId, username, photo } = doc.data();
      return {
        tweet,
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
  }, [num]);

  return <Wrapper>
    {tweets.map((tweet) => (<Tweet key={tweet.id} {...tweet}/>))}
    </Wrapper>
}