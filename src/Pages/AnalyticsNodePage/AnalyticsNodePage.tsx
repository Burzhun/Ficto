import React, { FC, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { AnalyticsTable } from '../../Components/TablerComponents/AnalyticsTable';
import { useSelector } from 'react-redux';
import { useHttp } from '../../hooks/http.hook';
import { PageContent, PageHeader } from 'Components/ui/Page';
import { Page } from '../../Components/ui/Page';
import { endpoints } from '../../api';

type StateProps = {
  auth: { token: string };
  mainData: { account: { organizationID: number } };
};
interface ParamTypes {
  id: string;
}

export const AnalyticsNodePage: FC = () => {
  const { id } = useParams<ParamTypes>();
  const orgId = useSelector(
    (state: StateProps) => state.mainData?.account?.organizationID
  );
  const { token } = useSelector((state: StateProps) => state.auth);
  const history = useHistory();
  const { request } = useHttp();
  const [state, setState] = useState({
    title: '',
    settings: {},
    data: [],
  });

  useEffect(() => {
    (async function () {
      try {
        const data = await request(
          endpoints.analyticsCard(id, orgId),
          'GET',
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        );
        setState({
          title: data.payload.heading,
          settings: data.payload.options,
          data: data.payload.data,
        });
      } catch (e) {
        if (orgId) {
          history.push('/analytics');
        }
      }
    })();
  }, [id, orgId, request, token]);

  return (
    <>
      <Page>
        <PageHeader title={state.title} />
        <PageContent>
          <AnalyticsTable
            settings={state.settings}
            data={state.data}
            fileName={state.title}
          />
        </PageContent>
      </Page>
    </>
  );
};
