import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import logoImage from '../../static/images/logoNoBg.png';

const MainLogoStyle = styled.img`
  height: 50px;
  width: 50px;
  border-radius: 50%;
`;

export const MainLogo = () => {
  return (
    <Link to={'/'}>
      <MainLogoStyle src={logoImage} alt={'Logo'} />
    </Link>
  );
};
