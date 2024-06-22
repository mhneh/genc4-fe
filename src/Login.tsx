import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import Input from "./components/Input";

const Login = () => {
  return (
    <>
      <Head>
        <HeadItem href="/">
          <FontAwesomeIcon icon={faArrowLeft} />
          Back
        </HeadItem>
        <HeadItem>Create an account</HeadItem>
      </Head>
      <Main>
        <MainHead>
          <Logo src="/public/c4-square-logo.png" />
          <Text
            style={{
              color: "#555",
              fontSize: "28px",
              lineHeight: "32px",
              fontWeight: 500,
            }}
          >
            Log in
          </Text>
        </MainHead>
        <Container>
          <InputForm />
          <Divider />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
              width: "300px",
              boxSizing: "border-box",
            }}
          >
            <InputItem type="google" />
            <InputItem type="facebook" />
          </div>
        </Container>
      </Main>
    </>
  );
};

export default Login;

const Divider = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <div
        style={{ height: "150px", width: "2px", backgroundColor: "#e5e5e5" }}
      />
      <Text color="#ccc">OR</Text>
      <div
        style={{ height: "150px", width: "2px", backgroundColor: "#e5e5e5" }}
      />
    </div>
  );
};

const InputForm = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        width: "300px",
        justifyContent: "center",
      }}
    >
      {/* <Text style={{ fontSize: "16px", textAlign: "center" }}>Log in</Text> */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <Input label="Email address" />
        <Input label="Password" />
        <Button>Log in</Button>
      </div>
    </div>
  );
};

const InputItem = ({ type }: { type: "facebook" | "google" }) => {
  return (
    <InputItemStyled
      style={{
        width: "100%",
        padding: "8px 16px",
        borderRadius: "24px",
        border: "1px solid #333",
        display: "flex",
        gap: "16px",
        boxSizing: "border-box",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {type === "facebook" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          width={24}
        >
          <path
            d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z"
            fill="#0C82EE"
          />
        </svg>
      )}
      {type === "google" && <img src="/public/google.svg" width={24} />}

      <Text
        style={{
          color: "#333",
          fontSize: "16px",
          lineHeight: "20px",
          fontWeight: "300",
        }}
      >
        {type === "facebook"
          ? "Continue with Facebook"
          : "Continue with Google"}
      </Text>
    </InputItemStyled>
  );
};

const Head = styled.div`
  background-color: #fff;
  border-bottom: 2px solid #e5e5e5;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px 48px;
`;

const HeadItem = styled.a`
  text-decoration: none;
  color: #666;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
  width: auto;
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
`;

const Main = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MainHead = styled.div`
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  height: 48px;
  width: 48px;
`;

const Text = styled.p`
  padding: 0;
  margin: 0;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 32px;
  gap: 32px;
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #c3c3c3;
  border-radius: 10px;
  border: none;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;
const InputItemStyled = styled.div`
  &: hover {
    cursor: pointer;
    background-color: #f1f1f1;
  }
`;
