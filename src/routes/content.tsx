import { useParams } from "react-router-dom";
import { IWriting } from "./notice";
import { useEffect, useState } from "react";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: 30px;
  height: 300px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;
const Column = styled.div`
  display: flex;
  height: 200px;
  flex-direction: column;
  justify-content: space-between;
`;


const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;
const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;
const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const EditButton = styled.button`
  background-color: green;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const SaveButton = styled.button`
  background-color: red;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;
const TitlePart = styled.div`
  padding: 10px;
`;

export default function Content() {
  const params = useParams();
  console.log(params.contentId);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<IWriting>();
  const fecthTweets = async () => {
    const tweetQuery = query(
      collection(db, "writings"),
    );
    const snapshot = await getDocs(tweetQuery);
    const notices = snapshot.docs.map(doc => {
      if(doc.id === params.contentId){
        const { detail, createdAt, userId, username, title } = doc.data();
        return {
          detail,
          createdAt,
          userId,
          username,
          title,
          id: doc.id,
        }
      }
      else{
        return null;
      }
    })
    console.log(notices);
    for(let i = 0 ; i < notices.length; i++){
      if(notices[i]){
        setContent(notices[i]);
        setLoading(false);
        break;
      }
    }
    console.log(content);
  };
  useEffect(() => {
    fecthTweets();
  }, []);

  return (<div>
    <Wrapper>
      {loading ? "Loading..." : 
      <Column>
        <TitlePart>
          {content?.title}
        </TitlePart>
        <Username>{content?.username}</Username>
        <Payload>{content?.detail}</Payload>
      </Column>

    }
    </Wrapper>
  </div>)
}