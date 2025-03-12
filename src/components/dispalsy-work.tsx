import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  input{
    font-size: 20px;
  }
`;

const DisplayBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 2fr;
  min-width: 500px;
  .colored{
    background-color: #FBFFB9;
  }
`

const Box = styled.div`
  border: solid 2px black;
  height : 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BoolChim = styled.div`
  background-color: #ffffff;
  border: solid 2px black;
  height : 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  grid-column: span 2;
`;

interface Date  {
  dateData: string;
};

export default function DisplayWork({dateData} : Date){

  interface Work{
    date: string;
    name: string[];
  }
  const [workData, setWorkData] = useState<Work[] | null>([]);


  const [curWork, setCurWork] = useState<String[] | null>([]);
  // const [flag, setFlag] = useState(0);

  let idx = -2;
  let today = dateData;

  const fetchWorks = async() => {
    const worksQuery = query(collection(db, "works"),);
    const snapshot = await getDocs(worksQuery);
    const works: Work[] = snapshot.docs.map(doc=>{
      const {name} = doc.data() as {name: string[]};
      return {
        date: doc.id,
        name,
      }
    })
    setWorkData(works);
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
        <Box className="colored">{today}</Box>
        <Box className="colored">탄약고/주둔지</Box>
        <Box className="colored">무기고</Box>
        <Box className="colored">06:00~08:00</Box>
        <Box>{curWork[0]}</Box>
        <Box>{curWork[1]}</Box>
        <Box className="colored">08:00~10:00</Box>
        <Box>{curWork[2]}</Box>
        <Box>{curWork[3]}</Box>
        <Box className="colored">10:00~12:00</Box>
        <Box>{curWork[4]}</Box>
        <Box>{curWork[5]}</Box>
        <Box className="colored">12:00~14:00</Box>
        <Box>{curWork[6]}</Box>
        <Box>{curWork[7]}</Box>
        <Box className="colored">14:00~16:00</Box>
        <Box>{curWork[8]}</Box>
        <Box>{curWork[9]}</Box>
        <Box className="colored">16:00~18:00</Box>
        <Box>{curWork[10]}</Box>
        <Box>{curWork[11]}</Box>
        <Box className="colored">18:00~20:00</Box>
        <Box>{curWork[12]}</Box>
        <Box>{curWork[13]}</Box>
        <Box className="colored">20:00~22:00</Box>
        <Box>{curWork[14]}</Box>
        <Box>{curWork[15]}</Box>
        <Box className="colored">22:00~00:00</Box>
        <Box>{curWork[16]}</Box>
        <Box>{curWork[17]}</Box>
        <Box className="colored">00:02~02:04</Box>
        <Box>{curWork[18]}</Box>
        <Box>{curWork[19]}</Box>
        <Box className="colored">04:00~06:00</Box>
        <Box>{curWork[20]}</Box>
        <Box>{curWork[21]}</Box>

        <Box className="colored">불침번 1</Box>
        <BoolChim>{curWork[22]}</BoolChim>
        <Box className="colored">불침번 2</Box>
        <BoolChim>{curWork[23]}</BoolChim>

        <Box className="colored">불침번 3</Box>
        <BoolChim>{curWork[24]}</BoolChim>

        <Box className="colored">불침번 4</Box>
        <BoolChim>{curWork[25]}</BoolChim>

        <Box className="colored">불침번 5</Box>
        <BoolChim>{curWork[26]}</BoolChim>
        
      </DisplayBox>
      : "데이터가 없습니다."}

    </Wrapper>
}