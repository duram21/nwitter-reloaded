import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const TextArea = styled.textarea`
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

const SelectNoticeName =styled.select`
  background-color: white;
  font-size: 17px;
`;

export default function WriteForm(){
  const [isLoading, setLoading] = useState(false);
  const [detail, setDetail] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File|null>(null);
  const [noticeName, setNoticeName] = useState("notice1");
  const navigate = useNavigate();
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if(e.target.name === "detail"){
      setDetail(e.target.value);
    }
  }
  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.name === "title"){
      setTitle(e.target.value);
    }
  }
  const onNoticeNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e);
    setNoticeName(e.target.value);
    console.log(noticeName);
  }  
  const onSubmit = async(e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const user = auth.currentUser;
    if(!user || isLoading || detail === "" || detail.length > 180) return;

    try{
      setLoading(true);
      const doc = await addDoc(collection(db, "writings"), {
        detail,
        createdAt: Date.now(),
        username: user.displayName || "Annonymous",
        userId: user.uid,
        noticeName: noticeName,
        title: title,
      });
      if(file){
        const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`)
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          photo: url
        });
      }
      setDetail("");
      setTitle("");
      setFile(null);
      navigate("/notice");
      
    } catch(e){
      console.log(e);
    } finally{
      setLoading(false);
    }
  }
  return <Form onSubmit={onSubmit}>
    <SelectNoticeName onChange={onNoticeNameChange} value={noticeName}>
        <option value="notice1">notice1</option>
        <option value="notice2">notice2</option>

    </SelectNoticeName>
    <TitleArea required name="title" value={title} onChange={onTitleChange} placeholder="제목을 입력해주세요"/>
    <TextArea required rows={20} maxLength={180} name="detail" value={detail} onChange={onChange} placeholder="글을 작성하세요"/>

    <SubmitBtn type="submit" value={isLoading ? "Posting....":"등록하기"}/>
  </Form>
}