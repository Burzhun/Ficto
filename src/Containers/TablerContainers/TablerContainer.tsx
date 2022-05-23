import { ThemeProvider } from '@material-ui/core/styles';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, useRouteMatch } from 'react-router-dom';
import { endpoints } from '../../api';
import { MainOrganizationCard } from '../../Components/MainOrganizationCard';
import { MainLayout } from '../../Layout/TablerLayouts/MainLayout';
import { AnalyticsNodePage } from '../../Pages/AnalyticsNodePage';
import { AnalyticsPage } from '../../Pages/AnalyticsPage';
import { MonitoringPage } from '../../Pages/MonitoringPage';
import { setMainData } from '../../Redux/actions/mainData.action';
import { changeCurrentWorkPlace } from '../../Redux/actions/workPlace.action';
import { mainTheme } from '../../theme/MuiThemes';
import { AddWork } from './AddWork';
import { HelpPage } from './HelpPage';
import { Instructions } from './Instructions';
import { Notifications } from './Notifications';
import { Profile } from './Profile';
import { Temp } from './Temp';
import { VideoPage } from './VideoPage';
import { WhatNew } from './WhatNew';
import { WorkInfoPage } from './WorkInfoPage';

type StateType = any;

export const TablerContainer = () => {
  const currentWP = useSelector(
    (state: StateType) => state.workPlaces.currentWorkPlace
  );
  const worksList = useSelector(
    (state: StateType) => state.workPlaces.workPlacesList
  );
  const dispatch = useDispatch();
  const { path } = useRouteMatch();
  // const account = useSelector((state) => state.mainData.account);
  const token = useSelector((state: StateType) => state.auth.token);

  useEffect(() => {
    localStorage.removeItem('currentProjectId');
  }, []);

  useEffect(() => {
    localStorage.setItem('curr_wP', currentWP);
  }, [currentWP]);

  useEffect(() => {
    const curr = localStorage.getItem('curr_wP');
    localStorage.removeItem('observer');
    const match = worksList.find((node: any) => node.id === curr);
    if (match) {
      dispatch(changeCurrentWorkPlace(match.id));
    } else {
      dispatch(changeCurrentWorkPlace(worksList[0].id));
    }

    (async () => {
      try {
        const response = await fetch('/api' + endpoints.loadMain(), {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const mainData = await response.json();
        localStorage.setItem(
          'organizationId',
          mainData.payload.organizations[0].organizationID
        );
        dispatch(setMainData(mainData.payload));
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        throw new Error(err);
      }
    })();
  }, [worksList, dispatch, token]);

  return (
    <ThemeProvider theme={mainTheme}>
      <MainLayout>
        <Route path={`${path}work/add`} component={AddWork} />
        <Route path={`${path}`} exact component={WorkInfoPage} />
        <Route path={`${path}instructions`} component={Instructions} />
        <Route path={`${path}video`} component={VideoPage} />
        <Route path={`${path}help`} exact component={HelpPage} />
        <Route path={`${path}monitoring`} exact component={MonitoringPage} />
        <Route path={`${path}whats`} component={WhatNew} />
        <Route path={`${path}temp`} component={Temp} />
        <Route path={`${path}notifications`} component={Notifications} />
        <Route path={`${path}profile`} component={Profile} />
        <Route path={`${path}analytics`} exact component={AnalyticsPage} />
        <Route
          path={`${path}analytics/:id`}
          exact
          component={AnalyticsNodePage}
        />
        <Route path={`${path}organization`} component={MainOrganizationCard} />
      </MainLayout>
    </ThemeProvider>
  );
};
