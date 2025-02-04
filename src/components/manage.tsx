import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db} from "../firebase";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  
`;


const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;


const TitleArea = styled.input`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  width: 100px;
  padding: 10px 10px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

const ListWorkers = styled.div`
  display:flex;
  flex-direction: column;

`
const DisplayForm = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
`;

export default function Manage(){
  const [isLoading, setLoading] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [name, setName] = useState("");
  const [flag, setFlag] = useState();
  const fecthWorkers = async () => {
    const tweetQuery = query(
      collection(db, "workers"),
    );
    const snapshot = await getDocs(tweetQuery);
    const workers = snapshot.docs.map(doc => {
      const { name } = doc.data();
      return {
        name,
        id: doc.id,
      }
    })
    setWorkers(workers);
  };
  useEffect(() => {
    fecthWorkers();
    console.log("실행됨");
  }, [flag]);

  console.log(workers);

  const onSubmit = async(e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if(!user || isLoading || name === "") return;
    try{
      setLoading(true);
      const doc = await addDoc(collection(db, "workers"), {
        name,
      });
      
      setName("");
    } catch(e){
      console.log(e);
    } finally{
      setLoading(false);
      
    }
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }



  return <Wrapper>
      <h1> 근무 인원 </h1>
      
      <DisplayForm>
        <ListWorkers>
          {workers.map((worker) => (<Worker key={worker.id} {...worker}/>))} 
        </ListWorkers>
        <Form onSubmit={onSubmit}>  
          <TitleArea onChange={onChange} name="workerName" value={name} placeholder="근무자 이름"/>
          <SubmitBtn type="submit" value="추가"/>
        </Form>
      </DisplayForm>
      
    </Wrapper>
}


const NameWrapper = styled.div`
  display: flex;
  

`;
const NameBox = styled.div`
  border: 2px solid white;
  width: 100px;
  display: grid;
  grid-template-columns: 1fr 4fr;
  justify-content: center;
  justify-items: center;
  height: 30px;
  align-items: center;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;

  text-transform: uppercase;
  cursor: pointer;
`;


function Worker({id, name}) {
  
  


  return  <NameWrapper>
    <NameBox>
      <DeleteButton >X</DeleteButton>
      {name} 
    </NameBox>
    
  </NameWrapper>
}