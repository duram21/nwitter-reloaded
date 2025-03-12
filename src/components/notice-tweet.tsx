import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Title from "./writing-list";
import { IWriting } from "../routes/notice";

const Wrapper = styled.div`
  display: flex;
  gap :10px;
  flex-direction: column;
  text-decoration: none;
  /* background-color: */
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
    const tweets : IWriting[] = snapshot.docs.map(doc => {
      const {title, noticeName, detail, createdAt, userId, username, photo } = doc.data();
      return {
        title,
        noticeName,
        createdAt,
        userId,
        detail,
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