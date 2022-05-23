import React, { FC, useEffect, useState } from 'react';
import { AnalyticsCardItem } from '../../Components/ui/AnalyticsCardItem';
import { useHttp } from '../../hooks/http.hook';
import { useSelector } from 'react-redux';
import { InfoMessage } from '../../Components/ui/InfoMessage';
import { Page } from '../../Components/ui/Page';
import { PageContent, PageHeader } from '../../Components/ui/Page';
import { endpoints } from '../../api';

type StateProps = {
  auth: { token: string };
};

export const AnalyticsPage: FC = () => {
  const { request } = useHttp();
  const { token } = useSelector((state: StateProps) => state.auth);
  const [analyticsList, setAnalyticsList] = useState([]);

  useEffect(() => {
    (async function () {
      try {
        const data = await request(endpoints.analyticsList(), 'GET', null, {
          Authorization: `Bearer ${token}`,
        });
        setAnalyticsList(data.payload);
      } catch (err) {}
    })();
  }, [request, token]);

  return (
    <Page>
      <PageHeader title={'Аналитика'} />
      <PageContent>
        {analyticsList.length === 0 ? (
          <InfoMessage title={'Список аналитических отчетов пуст'} />
        ) : (
          analyticsList.map((node: { name: string; path: string }) => (
            <AnalyticsCardItem name={node.name} path={node.path} />
          ))
        )}
      </PageContent>
    </Page>
  );
};
