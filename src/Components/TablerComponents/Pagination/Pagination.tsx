import React, { FC, useMemo } from 'react';
import './style.css';

type PropsType = {
  totalPage: number;
  setState: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
};

const Pagination: FC<PropsType> = ({ totalPage, setState, currentPage }) => {
  const templatesArr = useMemo(() => {
    return new Array(totalPage).fill(1);
  }, []);

  return (
    <div className="pagination-container">
      {templatesArr.map((el, i) => {
        return (
          <div key={i}>
            <div
              className={
                currentPage === i
                  ? 'pagination-circle active'
                  : 'pagination-circle'
              }
              onClick={() => setState(i)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Pagination;
