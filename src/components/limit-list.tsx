import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import styled from "styled-components";





function setDay(date) {
  let year = date[0] + date[1] + date[2] + date[3];
  let month = date[5] + date[6];
  let day = date[8] + date[9];
  year = parseInt(year);
  month = parseInt(month);
  day = parseInt(day);

  let days = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let dateArr = [];
  // 윤년 check
  if (((year % 100 != 0) && (year % 4 == 0)) || year % 400 == 0) days[2]++;
  for (let i = 0; i < 7; i++) {
    // update
    let current_day = day + i;
    let current_month = month;
    let current_year = year;
    if (current_day > days[current_month]) {
      current_day -= days[current_month];
      current_month++;
      if (current_month == 13) {
        current_month = 1;
        current_year++;
      }
    }
    let current_date;
    current_date = `${String(current_year).padStart(4, "0")}-${String(current_month).padStart(2, "0")}-${String(current_day).padStart(2, "0")}`;
    dateArr.push(current_date);
  }
  return dateArr;
}

const Wrapper = styled.div`
  display: flex;
  /* flex-direction: column; */
  gap: 10px;

  .listButton {
  background-color:  #2d8d78;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 15px;
  min-width: 180px;
}
  .loading{
    font-size: 20px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    text-align: center;
  }
  
`;



export default function ToggleList({date}) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [week, setWeek] = useState([]);
  const [flag, setFlag] = useState(false);
  console.log(week);
  const fecthWorkers = async () => {
    if(date === "") return;
    setFlag(false);
    let Data = [];
    let Day = [];
    console.log(date);
    Day = setDay(date);
    setWeek(Day);
    for(let i = 0 ; i < 7; i++){
      const tweetQuery = query(
        collection(db, "limitations", Day[i], "data"),
      );
      const snapshot = await getDocs(tweetQuery);
      const workers = snapshot.docs.map(doc => {
        const { name, detail } = doc.data();
        return {
          name,
          date: Day[i],
          detail,
          id: doc.id,
        }
      })
      // setWorkers(workers);
      for(let i = 0 ; i < workers.length; i++){
        Data.push(workers[i]);
      }
    }
    setItems(Data);
    setFlag(true);
  };
  useEffect(() => {
    fecthWorkers();
  }, [date]);

  return (
    <Wrapper>
      <button onClick={() => setIsOpen(!isOpen)} className="listButton">
        {week.length === 7 ? 
          <p>{week[0]} 부터<br/>  {week[6]} 까지 </p>

        : ""}
        {isOpen ? "근무 제한 목록 숨기기" : "근무 제한 목록 보기"}
      </button>
      {isOpen && flag ? (
        <motion.ul
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          {items.map((item, index) => (
            // <li key={index} className="p-2 border-b last:border-0">
            //   {item.date} {item.name} : {item.detail}
            // </li>
            <List date={item.date} name={item.name} detail={item.detail}/>
          ))}
        </motion.ul>
      ) : (isOpen && !flag && date ? <h1 className="loading">불러오는 중입니다. 잠시만 기다려주세요.</h1> : null) }
    </Wrapper>
  );
}

const ListWrapper = styled.div`
  display: flex;
  /* grid-template-columns: 30px 100px 100px 1fr; */
  height: 30px;
  min-width: 1000px;
  align-items: center;
  border: 1px solid #9ca3af; /* gray-400 */
  background-color: #f3f4f6; /* gray-100 */
  border-radius: 8px;
  margin-bottom: 5px;
  gap : 30px;

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

`

function List({date, name, detail}) {

  return <ListWrapper>
    <input type="checkbox"></input>
    <p className="title">📅 {date}</p>
    <p className="title">👤 {name}</p>
    <p className="detail">📝 {detail}</p>

  </ListWrapper>
}