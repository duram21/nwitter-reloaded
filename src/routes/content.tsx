import { useNavigate, useParams } from "react-router-dom";
import { IWriting } from "./notice";
import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs, query, updateDoc} from "firebase/firestore";
import { auth, db } from "../firebase";
import styled from "styled-components";

const Wrapper = styled.div`
  display: grid;
  grid-template: 2fr 1fr  1fr 8fr 1fr / 50vw;
  padding: 0px 20px;
  height: 550px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  width: 100%;
  background-color: white;
  border-radius: 8px;
  /* font-weight: bold; */
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Detail = styled.p`
  margin: 10px 0px;
  font-size: 18px;
  grid-row-start: 4;
  textarea{
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    height: 200px;
  }
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
  font-weight: bold;
  input{
    width : 100%;
    height: 40px;
    border-radius: 8px;
    padding: 10px;
    font-weight: bold;
    font-size: 20px;
  }
`;
const NoticeName = styled.div`
  
`;

const Button = styled.div`
  grid-row-start: 5;
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`

export default function Content() {
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<IWriting>({
    title: '',
    id: '',
    noticeName: '',
    photo: '',
    detail: '',
    userId: '',
    username: '',
    createdAt: 0,
  });
  const [editFlag, setEditFlag] = useState(false);
  const user = auth.currentUser;
  const fecthTweets = async () => {
    const tweetQuery = query(
      collection(db, "writings"),
    );
    const snapshot = await getDocs(tweetQuery);
    const notices : IWriting[]  = snapshot.docs.map(doc => {
        const { detail, createdAt, userId, username, title, noticeName} = doc.data();
        return {
          detail: detail || '',
          createdAt: createdAt || '',
          userId: userId || '',
          username: username || '',
          title: title || '',
          id : doc.id,
          noticeName: noticeName || '',
        }
      })



    const addr = params.contentId;
    for(let i = 0 ; i < notices.length; i++){
      if(notices[i].id == addr){
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
      if(content?.id){
        await deleteDoc(doc(db, "writings", content?.id));
      }
      navigate("/notice");
    } catch (e) {
      console.log(e);
    } finally {

    }
  }
  const onEdit = () => {
    setEditFlag(true);
  }

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(prev => ({
      ...prev,
      title: e.target.value,
    }))
  }
  const onChangeDetail = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(prev => ({
      ...prev,
      detail: e.target.value,
    }))
  }

  const onSave = async () => {
    const ok = confirm("Are you sure you want to save this writing?");
    if (!ok) return;
    await updateDoc(doc(db, "writings", content?.id), {
      title: content?.title,
      detail: content?.detail,
    });

    setEditFlag(false);
  }

  return (<div>
      {loading ? "Loading..." : 
    (!editFlag ? 
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
                  <EditButton onClick={onEdit}>Edit</EditButton>
                  : null
                }
          </Button>

          </Wrapper>
        : 

        <Wrapper>
        <TitlePart>
          <input type="text" value={content?.title} onChange={onChangeTitle}></input>
        </TitlePart>
        <AddPart>
          <Username>{content?.username}</Username>
          <NoticeName>{content?.noticeName}</NoticeName>
        </AddPart>
          
        <Detail>
          <textarea value={content?.detail} onChange={onChangeDetail}></textarea>
        </Detail>
        
        <Button>
          {user?.uid === content?.userId ?
                <DeleteButton onClick={onDelete}>Delete</DeleteButton>
                : null
              }

          <SaveButton onClick={onSave}>Save</SaveButton>
        </Button>

        </Wrapper>

            )
      }
  </div>)
}