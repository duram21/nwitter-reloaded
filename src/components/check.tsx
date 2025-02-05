import { addDoc, collection, getDocs, query, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

  input{
    font-size: 20px;
    
  }
`;

const DisplayWork = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 2fr;
`

const Box = styled.div`
  border: solid 1px white;
  height : 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1d1b1b;
`;

const BoolChim = styled.div`
  background-color: #1d1b1b;
  border: solid 1px white;
  height : 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  grid-column: span 2;
`;

export default function Check(){
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [workData, setWorkData] = useState();
  const [curWork, setCurWork] = useState();
  const [flag, setFlag] = useState(0);
  const [today, setToday] = useState();
  let idx = -2;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const str = e.target.value;
    setToday(str);
    setYear(str.substring(0, 4));
    setMonth(str.substring(5, 7));
    setDay(str.substring(8, 10));
    console.log(str.length);
    idx = workData.findIndex((work) => {
      return work.date === str;
    })
    console.log(idx);
    if(idx == -1) setCurWork(null);
    else{
      setCurWork(workData[idx].name);
    }
    console.log(curWork);
  }

  const fetchWorks = async() => {
    const worksQuery = query(collection(db, "works"),);
    const snapshot = await getDocs(worksQuery);
    const works = snapshot.docs.map(doc=>{
      const {name} = doc.data();
      return {
        date: doc.id,
        name,
      }
    })
    setWorkData(works);
    setFlag(1);
  }
  useEffect(() => {
    fetchWorks();
    if(flag === 1) console.log(workData);
  }, [flag]);

  return <Wrapper>
        
    <input onChange={onChange} type="date" id="today" name="today-work">
      </input>
      {(curWork && idx != -1) ?
      <DisplayWork>
        <Box>{today}</Box>
        <Box>탄약고/주둔지</Box>
        <Box>무기고</Box>
        <Box>06:00~08:00</Box>
        <Box>{curWork[0]}</Box>
        <Box>{curWork[1]}</Box>
        <Box>08:00~10:00</Box>
        <Box>{curWork[2]}</Box>
        <Box>{curWork[3]}</Box>
        <Box>10:00~12:00</Box>
        <Box>{curWork[4]}</Box>
        <Box>{curWork[5]}</Box>
        <Box>12:00~14:00</Box>
        <Box>{curWork[6]}</Box>
        <Box>{curWork[7]}</Box>
        <Box>14:00~16:00</Box>
        <Box>{curWork[8]}</Box>
        <Box>{curWork[9]}</Box>
        <Box>16:00~18:00</Box>
        <Box>{curWork[10]}</Box>
        <Box>{curWork[11]}</Box>
        <Box>18:00~20:00</Box>
        <Box>{curWork[12]}</Box>
        <Box>{curWork[13]}</Box>
        <Box>20:00~22:00</Box>
        <Box>{curWork[14]}</Box>
        <Box>{curWork[15]}</Box>
        <Box>22:00~00:00</Box>
        <Box>{curWork[16]}</Box>
        <Box>{curWork[17]}</Box>
        <Box>00:02~02:04</Box>
        <Box>{curWork[18]}</Box>
        <Box>{curWork[19]}</Box>
        <Box>04:00~06:00</Box>
        <Box>{curWork[20]}</Box>
        <Box>{curWork[21]}</Box>
        <Box>불침번 1</Box>
        <BoolChim>{curWork[22]}</BoolChim>
        <Box>불침번 2</Box>
        <BoolChim>{curWork[23]}</BoolChim>

        <Box>불침번 3</Box>
        <BoolChim>{curWork[24]}</BoolChim>

        <Box>불침번 4</Box>
        <BoolChim>{curWork[25]}</BoolChim>

        <Box>불침번 5</Box>
        <BoolChim>{curWork[26]}</BoolChim>
        
      </DisplayWork>
      : <h>날짜를 선택해주세요</h>}

    </Wrapper>
}