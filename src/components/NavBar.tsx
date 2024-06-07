import styled from "styled-components";

const NavBar = () => {
  return (
    <Container>
      <Logo src="/public/c4-square-logo.png" />
      <SubContainer>
        <Item>About</Item>
        <Item>Service</Item>
        <Item>Product</Item>
        <Item href="/login">Log in</Item>
      </SubContainer>
    </Container>
  );
};

export default NavBar;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 1;
`;
const SubContainer = styled.div`
  display: flex;
  gap: 40px;
`;
const Item = styled.a`
  font-size: 16px;
  line-height: 28px;
  color: #0a2640;
  font-weight: 600;
  text-decoration: none;
  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
`;
const Logo = styled.img`
  height: 42px;
`;
