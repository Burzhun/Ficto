import React, { FC, useEffect } from 'react';
import { WorkInfoAccordion } from '../../Components/TablerComponents/WorkInfoAccordion';
import { WorkInfoTable } from '../../Components/TablerComponents/WorkInfoTable';
import { Page, PageContent, PageHeader } from '../../Components/ui/Page';

export const WorkInfoPage: FC = () => {
  useEffect(() => {
    localStorage.removeItem('observer');
  }, []);

  return (
    <Page>
      <PageHeader title={'Список проектов'} />
      <PageContent>
        <WorkInfoAccordion />
      </PageContent>
      <PageContent>
        <WorkInfoTable />
      </PageContent>
    </Page>
  );
};
