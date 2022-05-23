import React from 'react';
import { useSelector } from 'react-redux';
import { rootReducer } from '../../../../Redux/rootReducer';
import { Info } from './styled';

type RootState = ReturnType<typeof rootReducer>;
export const ResponsobilesData = () => {
  const responsibles = useSelector(
    (state: RootState) => state.data.responsibles
  );
  return (
    <div>
      <Info>Ответственный за данные</Info>
      <p>
        <strong>ФИО: </strong> {responsibles?.responsible_executor?.fullName}
      </p>
      <p>
        <strong>Должность: </strong>{' '}
        {responsibles?.responsible_executor?.position}
      </p>
      <p>
        <strong>Телефон:</strong> {responsibles?.responsible_executor?.phone}
      </p>
      <p>
        <strong>E-mail:</strong> {responsibles?.responsible_executor?.email}
      </p>

      <Info>Ответственный исполнитель</Info>
      <p>
        <strong>ФИО:</strong> {responsibles?.responsible_for_data?.fullName}
      </p>
      <p>
        <strong>Должность:</strong>{' '}
        {responsibles?.responsible_for_data?.position}
      </p>
      <p>
        <strong>Телефон:</strong> {responsibles?.responsible_for_data?.phone}
      </p>
      <p>
        <strong>E-mail:</strong> {responsibles?.responsible_for_data?.email}
      </p>
    </div>
  );
};
