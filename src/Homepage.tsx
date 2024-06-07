import React, { useEffect } from "react";
import NavBar from "./components/NavBar";
import styled from "styled-components";
import { useHistory } from "react-router";

const Homepage = () => {
  const history = useHistory();

  useEffect(() => {
    document.body.style.overflow = "scroll";
  }, []);

  const openApp = () => {
    history.push("/C4");
  };
  return (
    <div>
      <Container>
        <Theme />
        <NavBar />
        <About>
          <Text style={{ fontSize: "20px", lineHeight: "32px" }}>About</Text>
          <Text
            style={{
              fontSize: "48px",
              lineHeight: "72px",
            }}
          >
            Save time by building fast system with C4 Template
          </Text>
          <Text style={{ fontSize: "16px", lineHeight: "28px" }}>
            Funding handshake buyer business-to-business metrics iPad
            partnership. First mover advantage innovator success deployment
            non-disclosure.
          </Text>
        </About>
        <Row
          style={{
            alignItems: "center",
            justifyContent: "center",
            padding: "36px 0px",
            gap: "36px",
          }}
        >
          <Button onClick={openApp}>Explore</Button>
        </Row>
      </Container>
      <SubContainer />
    </div>
  );
};

export default Homepage;

const Container = styled.div`
  padding: 36px 48px;
  background-color: #fff;
  position: relative;
`;

const Theme = styled.div`
  width: 1000px;
  height: 1000px;
  background-color: #f1f1f1;
  border-radius: 100%;
  position: absolute;
  top: -70vh;
  left: 70vw;
`;

const About = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #000;
  position: relative;
  font-weight: 400;
  gap: 12px;
  width: 800px;
  left: 50%;
  padding-top: 80px;
  transform: translateX(-50%);
`;

const Text = styled.p`
  padding: 0;
  margin: 0;
  text-align: center;
`;

const SubContainer = styled.div`
  position: relative;
  width: 100%;
  height: 1000px;
  border-radius: 56px 56px 0px 0px;
  background-color: #0a2640;
`;

const Button = styled.button`
  padding: 12px 56px;
  border-radius: 36px;
  border: 2px solid #000;
  background-color: #fff;
  color: #000;
  font-size: 16px;
  line-height: 20px;
  font-weight: 700;
  &:hover {
    cursor: pointer;
    background-color: #f1f1f1;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;
