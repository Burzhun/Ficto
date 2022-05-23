import styled from 'styled-components';

const PlusImage = styled.img`
  width: 25px;
  height: 25px;

  /* background-color: red; */
`;

const DropzoneWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  border: 1px solid #c4c4c4;
  border-radius: 5px;
  color: #575757;
`;

const DropzoneControls = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 50%;
`;

const DropzoneButton = styled.button`
  background-color: #5ea6e6;
  padding: 0px 18px;
  border-radius: 5px 0 0 5px;
  border: none;
  border-right: 1px solid #c4c4c4;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  color: #fff;
  font-size: 40px;
  font-weight: 200;

  :hover {
    opacity: 0.7;
  }

  :focus {
    outline-color: #c4c4c4;
  }
`;

const File = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
`;

const FileName = styled.div`
  margin: 0 10px 0 4px;
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  opacity: 0.8;
`;

export {
  DropzoneWrap,
  DropzoneControls,
  DropzoneButton,
  File,
  FileName,
  Info,
  PlusImage,
};
