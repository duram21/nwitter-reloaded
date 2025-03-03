import { addDoc, collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db} from "../firebase";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  h1{
    font-size: 30px;
  }
  
`;


const Form = styled.form`
  display: flex;
  /* flex-direction: column; */
  gap: 10px;
`;


const TitleArea = styled.input`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  height: 50px;
  background-color: black;
  width: 70%;
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
  background-color: #359b7c;
  color: white;
  border: none;
  width: 100px;
  padding: 10px 10px;
  border-radius: 20px;
  font-size: 20px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

const ListWorkers = styled.div`
  display:grid;
  grid-template-columns: 1fr 1fr;  
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
      <h1>근무자 명단</h1>
      
      <DisplayForm>
        <ListWorkers>
          {workers.map((worker) => (<Worker key={worker.id} {...worker}/>))} 
        </ListWorkers>
        <Form onSubmit={onSubmit}>  
          <TitleArea onChange={onChange} name="workerName" value={name} placeholder="근무자 이름"/>
          <SubmitBtn type="submit" value="추가"></SubmitBtn>
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
  grid-template-columns: 1fr 3fr;
  justify-content: center;
  justify-items: center;
  height: 40px;
  align-items: center;
  svg{
    color: lightgreen;
    border: solid 1px greenyellow;
    border-radius: 5px;
  }
  p{
    font-size: 18px;
  }
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
  
  const onDelete = async() => {
    let message = `${name} 명단에서 제외하겠습니까?`;
    const ok = confirm(message);
    if (!ok) return;
    try {
      await deleteDoc(doc(db, "workers", id));

    } catch (e) {
      console.log(e);
    } finally {

    }
  }


  return  <NameWrapper>
    <NameBox>

        <svg onClick={onDelete} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
         <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>

      <p>{name}</p> 
    </NameBox>
    
  </NameWrapper>
}