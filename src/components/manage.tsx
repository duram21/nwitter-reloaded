import { addDoc, collection, deleteDoc, doc, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db} from "../firebase";
import { Unsubscribe } from "firebase/auth";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
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

const SubmitBtn = styled.button`
  background-color: #359b7c;
  color: #ffffff;
  border: none;
  width: 100px;
  font-size: 18px;
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  `;

const WorkerBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 400px;
  margin: 0 auto;

  input{
    width: 100%;
    padding: 10px;
    border: 1px solid #201e1e;
    background-color: white;
    border-radius: 5px;
    font-size: 16px;
    color: black;
  }

  h1{
    color: black;
    text-align: center;
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  button {
    background-color: #2ca55a;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s ease;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
`

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 500px;
  margin: 0 auto;
  margin-bottom: 20px;
  input, textarea,
  button {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    border-radius: 5px;
    font-size: 16px;
  }
  textarea:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
  textarea {
    resize: vertical;
    height: 100px;
  }
  input:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
  
  button {
    background-color: #127c3b;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  button:hover {
    background-color: #0056b3;
  }

  button:active {
    background-color: #004099;
  }
  p{
    color: black;
    text-align: center;
    font-size: 22px;
    margin-bottom: 10px;
    font-weight: bold;
  }
  `
  interface WorkerData{
    id: string;
    name: string;
  }

const LimitBox = styled.div`
  display: flex;
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  flex-direction: column;
  gap: 2px;
`;

const LimitWrapper = styled.div`
  display: flex;
  flex-direction: column;

`

export default function Manage(){
  const [isLoading, setLoading] = useState(false);
  const [workers, setWorkers] = useState<WorkerData[]>([]);
  const [name, setName] = useState("");
  
  const [date, setDate] = useState("");
  const [limitName, setLimitName] = useState("");
  const [limitDetail, setLimitDetail] = useState("");

  interface Item{
    date: string;
    name: string;
    detail: string;
  }
  const [limitList, setLimitList] = useState<Item[]>([]);


  useEffect(() => {
    let unsubscribe : Unsubscribe | null = null;

    const fecthWorkers = async () => {
      const workersQuery = query(
        collection(db, "workers"),
      );
      unsubscribe = await onSnapshot(workersQuery, (snapshot) => {
        const workers = snapshot.docs.map(doc => {
         const { name } = doc.data();
         return {
           name,
           id: doc.id,
         };
       });
       setWorkers(workers);
      })
    };


    fecthWorkers();
    console.log("실행됨");
    return() => {
      unsubscribe && unsubscribe();
    }
  }, []);

  useEffect(() => {
    if(date == "") return;
    let unsubscribe : Unsubscribe | null = null;

    const fetchLimits = async() => {
      const limitsQuery = query(
        collection(db, "limitations", date, "data")
      );
      unsubscribe = await onSnapshot(limitsQuery, (snapshot) => {
        const limits = snapshot.docs.map(doc => {
          const {name, detail } = doc.data();
          return {
            name,
            date,
            detail,
            id: doc.id,
          };
          
        });
        setLimitList(limits);
      });
    }
    
    fetchLimits();

    return() => {
      unsubscribe && unsubscribe();
    }
  }, [date]);

  const onSubmit = async(e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if(!user || isLoading || name === "") return;
    try{
      setLoading(true);
      await addDoc(collection(db, "workers"), {
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


  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  }
  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLimitName(e.target.value);
  }
  const onDetailChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLimitDetail(e.target.value);
  }
  const onLimitSubmit = async(e : React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if(!user || isLoading || limitName === "" || limitDetail === "") return;
    try{
      setLoading(true);
      await addDoc(collection(db, "limitations", date, "data"), {
        name: limitName,
        detail: limitDetail,
      });
      
      console.log("제출됐어요");
      setLimitDetail("");
      setLimitName("");
    } catch(e){
      console.log(e);
    } finally{
      setLoading(false);
      
    }
  }
  



  return <Wrapper>
    <WorkerBox>
      <h1>근무자 명단 관리</h1>
      <DisplayForm>
        <Form onSubmit={onSubmit}>  
          <TitleArea onChange={onChange} name="workerName" value={name} placeholder="근무자 이름"/>
          <SubmitBtn type="submit" value="추가">추가</SubmitBtn>
        </Form>
        <ListWorkers>
          {workers.map((worker) => (<Worker key={worker.id} {...worker}/>))} 
        </ListWorkers>
      </DisplayForm>
    </WorkerBox>
    <LimitWrapper>
      <InputBox>
        <p>근무 제한 사항 입력</p>
        <input type="date" value={date} onChange={onDateChange}></input>
        <input type="text" onChange={onNameChange} placeholder="이름" value={limitName}></input>
        <textarea  onChange={onDetailChange} placeholder="근무 제한 사항 내용" value={limitDetail}></textarea>
        <button onClick={onLimitSubmit}>제출</button>
      </InputBox>
      <LimitBox>
      {limitList.map((item) => (
            <List date={item.date} name={item.name} detail={item.detail}/>
          ))}
      </LimitBox>
    </LimitWrapper>
    </Wrapper>
}


const NameWrapper = styled.div`
  display: flex;
  

`;
const NameBox = styled.div`
  border: 2px solid black;
  width: 200px;
  display: grid;
  padding: 5px;
  grid-template-columns: 1fr 3fr;
  justify-content: center;
  justify-items: center;
  align-items: center;
  background-color: #FFEEE4;
  svg{
    color: #020202;
    border-radius: 5px;
  }
  p{
    font-size: 18px;
    font-weight: bold;
    color: black;
  }
`;


function Worker({id, name} : WorkerData) {
  
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


  return <NameWrapper>
    <NameBox>
      <svg onClick={onDelete} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
      </svg>
      <p>{name}</p>
    </NameBox>
  </NameWrapper>
}

interface LimitData{
  date: string;
  name: string;
  detail: string;
}

const ListWrapper = styled.div`
  display: flex;
  /* grid-template-columns: 30px 100px 100px 1fr; */

  align-items: center;
  border: 1px solid black; /* gray-400 */
  background-color: #FFEEE4; /* gray-100 */
  border-radius: 8px;
  margin-bottom: 5px;
  gap : 30px;
  max-width: 500px;
  p {
    margin: 4px 0;
  }

  .title {
    color: #374151; /* gray-700 */
    font-weight: 600;
  }

  .detail {
    color: #4b5563; /* gray-600 */
    margin-top: 4px;
  }

  .infoPart{

  }

  .detailPart{
    width: 250px;
  }

`


function List({date, name, detail} : LimitData) {

  return <ListWrapper>
    <input type="checkbox"></input>
    <div className="infoPart">
      <p className="title">📅 {date}</p>
      <p className="title">👤 {name}</p>
    </div>
    <div className="detailPart">
      <p className="detail">📝 {detail}</p>
    </div>

  </ListWrapper>
}