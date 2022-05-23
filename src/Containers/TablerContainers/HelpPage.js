import React from 'react';
import { useHistory } from 'react-router-dom';

export const HelpPage = () => {
  const history = useHistory();

  return (
    <div>
      <button
        onClick={() => {
          history.goBack();
        }}
      >
        назад
      </button>
    </div>
  );
};
