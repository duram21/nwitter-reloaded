import { useNavigate, useParams } from "react-router-dom";
import { IWriting } from "./notice";
import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import styled from "styled-components";

const Wrapper = styled.div`
  display: grid;
  grid-template: 2fr 1fr  1fr 8fr 1fr / 50vw;
  padding: 0px 20px;
  height: 500px;
  border: 1px solid rgba(255, 255, 255, 0.5);

  width: 100%;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Detail = styled.p`
  margin: 10px 0px;
  font-size: 18px;
  grid-row-start: 4;
`;
const AddPart = styled.div`
  display: flex;
  justify-content: space-between;
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
  font-size: 20px;
  align-self: center;
  
`;
const NoticeName = styled.div`
  
`;

const Button = styled.div`
  grid-row-start: 5;
  display: flex;
  gap: 10px;
`

export default function Content() {
  const params = useParams();
  const navigate = useNavigate();
  console.log(params.contentId);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<IWriting>();
  const user = auth.currentUser;
  const fecthTweets = async () => {
    const tweetQuery = query(
      collection(db, "writings"),
    );
    const snapshot = await getDocs(tweetQuery);
    const notices = snapshot.docs.map(doc => {
      if(doc.id === params.contentId){
        const { detail, createdAt, userId, username, title, noticeName} = doc.data();
        return {
          detail,
          createdAt,
          userId,
          username,
          title,
          id : doc.id,
          noticeName,
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

  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== content?.userId) return;
    try {
      await deleteDoc(doc(db, "writings", content?.id));
      navigate("/notice");
    } catch (e) {
      console.log(e);
    } finally {

    }
  }
  //   const onEdit = () => {
  //     //setEditMode(true);
  //   }
  //   const onSave = async() => {
  //     const ok = confirm("Are you sure you want to save this tweet?");
  //     if(!ok) return;
  //     await updateDoc(doc(db, "tweets", content?.id), {
  //       tweet: editTweet
  //     });
  
  //     //setEditMode(false);
  //   }

  return (<div>
      {loading ? "Loading..." : 
    <Wrapper>
        <TitlePart>
          {content?.title}
        </TitlePart>
        <AddPart>
          <Username>{content?.username}</Username>
          <NoticeName>{content?.noticeName}</NoticeName>
        </AddPart>
          
        <Detail>{content?.detail}</Detail>
        
        <Button>
          {user?.uid === content?.userId ?
                <DeleteButton onClick={onDelete}>Delete</DeleteButton>
                : null
              }
              <EditButton >Edit</EditButton>
              <SaveButton >Save</SaveButton>
        </Button>

        </Wrapper>
        
      }
  </div>)
}