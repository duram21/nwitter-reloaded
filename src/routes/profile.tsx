import styled from "styled-components";
import { auth, db, storage } from "../firebase"
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { collection, doc, DocumentReference, getDocs, limit, orderBy, query, updateDoc, where } from "firebase/firestore";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 50px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;
const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
`;

const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 10px;
 // border-radius: 20px;
  height: 50px;
  display: center;
  vertical-align: middle;
  text-align: center;
  width: 200px;
  font-size: 18px;
  color: white;
  background-color: black;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 20px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const Img = styled.div`
  display: flex;
  gap : 5px;
  svg{
    width: 30px;
  }
`;

const MyContents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 80%;
  h1{
    font-size: 15px;
  }
`;

const MyProfile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

`;

const NamePart = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
`;

export default function Profile() {
  const user =auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  // const [tweets, setTweets] = useState<ITweet[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(user?.displayName);
  const onAvatarChange = async(e:React.ChangeEvent<HTMLInputElement>) => {
    const {files} = e.target;
    if(!user) return;
    if(files && files.length === 1){
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      })
    }
  }
  const fecthTweets = async() => {
    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map(doc => {
      const {tweet, createdAt, userId, username, photo} = doc.data();
      return { 
        tweet,
        createdAt,
        userId,
        username,
        photo,
        id: doc.id,
      }
    })
    setTweets(tweets);
  };
  useEffect(() => {
    fecthTweets();
  }, []);

  const onEdit = () => {
    setEditMode(true);
  }
  const onSave = async() => {
    const ok = confirm("Are you sure you want to change this name?");
    if(!ok || !user) return;
    // set the name of the user
    await updateProfile(user, {
      displayName: newName,
    });

    tweets.map(async tweet => {
      await updateDoc(doc(db, "tweets", tweet.id), {
        username: newName
      });
    })

    

    setEditMode(false);
  }
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewName(e.target.value);
  }
  return <Wrapper>
    <MyProfile>
      <AvatarUpload htmlFor="avatar">
        {Boolean(avatar) ? <AvatarImg src={avatar}/> :  
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>}
      </AvatarUpload>
      <NamePart>
        <AvatarInput id="avatar" onChange={onAvatarChange} type="file" accept="image/*" />
          {!editMode ? 
          <Name>{user?.displayName ?? "Annonymous"}  </Name> :
          <TextArea value={newName} onChange={onChange}>{newName}</TextArea>
          }
        <Img>
          <svg onClick={onEdit}  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
          </svg>
          {editMode ?
            <svg onClick={onSave}  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg> : null }
        </Img>
      </NamePart>
    </MyProfile>
    <MyContents>
      {/* <h1>내가 쓴 글</h1>
      <Tweets>
        {tweets.map(tweet => <Tweet key={tweet.id} {...tweet} />)}
      </Tweets> */}
    </MyContents>
  </Wrapper>
}