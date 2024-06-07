import React from "react";
import styled from "styled-components";

type Props = {
  label?: string;
  id?: string;
};

const Input = ({ label, id }: Props) => {
  return (
    <Container>
      {label && <Label>{label}</Label>}
      <InputStyled />
    </Container>
  );
};

export default Input;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 8px;
`;

const Label = styled.p`
  padding: 0;
  margin: 0;
  font-size: 12px;
  line-height: 16px;
  color: #666;
  font-weight: 500;
`;
const InputStyled = styled.input`
  border: 1px solid #c9c9c9;
  border-radius: 10px;
  width: 100%;
  height: 40px;
  padding: 16px;
  box-sizing: border-box;
`;
