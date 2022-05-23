import React, { FC, useRef } from 'react';
import HotTable from '@handsontable/react';
import { Button } from '../../ui/Button';
import { AnalyticsTableUI } from './styled';

type AnalyticsTablePropsType = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  settings: {},
  data: never[],
  fileName?: string
}

export const AnalyticsTable: FC<AnalyticsTablePropsType> = (props) => {
  const { settings, data, fileName } = props
  const hotRef = useRef(null)

  const exportToCsvHandler = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const downloadPlugin = hotRef.current.hotInstance.getPlugin(
      'exportFile'
    );
    downloadPlugin.downloadFile('csv', {
      filename: fileName || 'Отчет',
      columnDelimiter: ';',
    });
  }

  return (
    <AnalyticsTableUI>
      <Button onClick={exportToCsvHandler}>
        Сохранить в .csv
      </Button>
        <HotTable
          licenseKey="non-commercial-and-evaluation"
          settings={settings}
          data={data}
          width={"100%"}
          ref={hotRef}
          // height={window.innerHeight - 280}
        />
    </AnalyticsTableUI>
  )
}