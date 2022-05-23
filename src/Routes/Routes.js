import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { TablerContainer } from '../Containers/TablerContainers/TablerContainer';
import { LoginPage } from '../Containers/LoginPage';
import { serviceTheme } from '../theme/MuiThemes';
import { ServiceLayout } from '../Layout/ServiceLayouts/ServiceLayout';
import { TableAggContainer } from '../Containers/ServiceContainers/TableAggContainer';

export const useRoutes = (isAuth) => {
  if (!isAuth) {
    return (
      <>
        <Route path={'/login'} component={LoginPage} />
        <Redirect to={'/login'} />
      </>
    );
  }

  return (
    <Switch>
      <Route path={'/service'}>
        <ThemeProvider theme={serviceTheme}>
          <ServiceLayout>
            <TableAggContainer />
          </ServiceLayout>
        </ThemeProvider>
      </Route>
      <Route path={'/'} component={TablerContainer} />
      <Redirect to={'/'} />
    </Switch>
  );
};
