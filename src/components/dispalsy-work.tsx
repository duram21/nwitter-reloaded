import { addDoc, collection, getDocs, query, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

  input{
    font-size: 20px;
    
  }
`;

const DisplayBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 2fr;
  min-width: 500px;
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

export default function DisplayWork({dateData}){
  console.log(dateData);
  const [workData, setWorkData] = useState();
  const [curWork, setCurWork] = useState();
  const [flag, setFlag] = useState(0);
  const [con, setCon] = useState(1);
  let idx = -2;
  let today = dateData;

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
    console.log("표 불러왔어요 ㅠㅠ")
  }
  useEffect(() => {
    fetchWorks();
  }, []);

  useEffect(() =>{
    if (workData) {
      idx = workData.findIndex((work) => {
        return work.date === today;
      })
      console.log(idx);
      if (idx == -1) setCurWork(null);
      else {
        setCurWork(workData[idx].name);
        console.log("언제되냐?")
      }
    }
    console.log(curWork);
    console.log(workData);
    console.log(123);
  }, [dateData, workData])

  return <Wrapper>
    
      {(curWork && idx != -1) ?
      <DisplayBox>
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
        
      </DisplayBox>
      : "데이터가 없습니다."}

    </Wrapper>
}