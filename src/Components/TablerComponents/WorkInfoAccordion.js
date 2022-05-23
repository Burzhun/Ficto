import { CardList } from '@sas/ui-kit';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { api, endpoints } from '../../api';
import { useHttp } from '../../hooks/http.hook';
import { setCurrentProjectId } from '../../Redux/actions/data.action';
import { PaginationSettingBox } from '../../Style/ServiceStyles/ServiceStyle';
import { AccordionBox } from '../../Style/TablesStyles/TablerStyle';
import Pagination from './Pagination/Pagination';

export const WorkInfoAccordion = () => {
  const [limit, setLimit] = useState(12);
  const [templates, setTemplates] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const { request } = useHttp();
  const history = useHistory();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(0);

  const setCardListOptions = useMemo(() => {
    if (templates) {
      return templates
        .map((node) => ({
          id: node.id,
          name: node.name,
        }))
        .slice(currentPage * limit, limit + currentPage * limit);
    } else {
      return [];
    }
  }, [templates, currentPage, limit]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api(endpoints.templateList());
        setTemplates(data.payload.result);
      } catch (e) {}
    })();
  }, []);

  const onClickHandler = async (id) => {
    try {
      const data = await request(
        endpoints.projectTypesUrl() + `/${id}`,
        'POST',
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      dispatch(setCurrentProjectId(data.payload.projectID));
      history.push('/service');
    } catch (e) {}
  };

  return (
    <AccordionBox>
      <PaginationSettingBox>
        <div>Отображать по:</div>
        <select
          onChange={(e) => {
            setCurrentPage(0);
            setLimit(Number(e.target.value));
          }}
        >
          <option value={8}>8</option>
          <option value={12} selected>
            12
          </option>
          <option value={24}>24</option>
        </select>
      </PaginationSettingBox>
      <CardList options={setCardListOptions} onNodeClick={onClickHandler} />
      {templates?.length > limit && (
        <Pagination
          totalPage={Math.ceil(templates?.length / limit)}
          setState={setCurrentPage}
          currentPage={currentPage}
        />
      )}
    </AccordionBox>
  );
};
