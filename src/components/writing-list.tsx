import { styled } from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";
import { IWriting } from "../routes/notice";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  display: grid;
  grid-template: 1fr 1fr / 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  color:white;
  
`;
const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const TItleTop = styled.div`
  display: flex;
  justify-content: space-between;
  
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 16px;
  text-decoration: none;
`;
const Payload = styled.p`
  margin: 5px 20px;
  font-size: 18px;
`;


export default function Title({ username, photo, title, noticeName, userId, id }: IWriting) {
  const [editMode, setEditMode] = useState(false);
  const moveAddress = `/content/${id}`
  const user = auth.currentUser;
  const onDelete = async() => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if(!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if(photo){
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {

    }
  }
  return (
        <Link to={moveAddress} style={{textDecoration: "none"}}>
    <Wrapper>
        <TItleTop>
          <Username>{username}</Username>
          <Username>{noticeName}</Username>
        </TItleTop>
        <Payload>{title}</Payload>
    </Wrapper>
      </Link>
    
  );
}