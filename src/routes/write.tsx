import styled from "styled-components";
import PostTweetForm from "../components/post-tweet-form";
import { auth } from "../firebase";
import Timeline from "../components/timeline";
import Notice from "./notice";
import WriteForm from "../components/write-form";

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  grid-template-rows: 1fr 5fr;
`;

export default function Write() {
  return (
  <Wrapper>
    <WriteForm />
  </Wrapper>
  )
}