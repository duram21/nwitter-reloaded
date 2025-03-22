import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Error, Form, Input, Switcher, Title, Wrapper } from "../components/auth-components";
import GithubButton from "../components/github-btn";


export default function CreateAccount() {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { name, value } } = e;
        if (name === "email") {
            setEmail(value);
        }
        else if (name === "password") {
            setPassword(value);
        }
    }

    const onSubmit = async (e : React.FormEvent<HTMLElement>) => {
        e.preventDefault();
        setError("");
        if(isLoading || email === "" || password === "") return;
        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            // redirect to the home page
            navigate("/");

        } catch(e){
            //setError
            if(e instanceof FirebaseError){
                console.log(e.code, e.message);
                setError(e.message);
            }
            console.log(e);
        }
        finally {
          setLoading(false);
        }
        console.log(name, email, password);
      }
      
      return (
        <Wrapper>
            <Title>추가 기능을 위해 로그인</Title>
          <p>text id : test@test.com</p>
          <p>text password : 123123</p>
        <Form onSubmit={onSubmit}>
            <Input
                onChange={onChange}
                name="email"
                value={email}
                placeholder="이메일"
                type="email"
                required />
            <Input
                onChange={onChange}
                name="password"
                value={password}
                placeholder="비밀번호"
                type="password"
                required />
            <Input type="submit" value={isLoading ? "Loading..." : "로그인"} />
        </Form>
        {error !== "" ? <Error>{error}</Error> : null}
        <Switcher>
            계정이 없나요? <Link to="/create-account">회원가입 하기</Link>
        </Switcher>
        <GithubButton />

        <Link to="/">홈으로 돌아가기</Link>


    </Wrapper>
    );
}