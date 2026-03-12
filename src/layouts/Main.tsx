import React, { ReactNode } from 'react';

type MainProps = {
  children: ReactNode;
};

const Main = ({ children }: MainProps) => {
  return <div>{children}</div>;
};

export default Main;

