import React from 'react';
import {
  AccordionPaper,
  ReportAccordionBox,
  SliderClickBox,
} from '../../Style/TablesStyles/TablerStyle';
import { useHistory } from 'react-router-dom';
import { useHttp } from '../../hooks/http.hook';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentProjectId } from '../../Redux/actions/data.action';
import { endpoints } from "../../api";

export const ReportAccordion = (props) => {
  const history = useHistory();
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { request } = useHttp();

  const onClickHandler = async () => {
    try {
      const data = await request(
        endpoints.projectTypesUrl() + `/${props.data.id}`,
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
    <>
      <ReportAccordionBox>
        <SliderClickBox style={{}} onClick={onClickHandler}>
          <AccordionPaper
            style={{
              backgroundColor: props.data.color,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <i style={{ color: 'white' }} className={props.data.icon} />
          </AccordionPaper>
          <p
            style={{
              textAlign: 'center',
            }}
          >
            {props.data.name}
          </p>
        </SliderClickBox>
      </ReportAccordionBox>
    </>
  );
};
