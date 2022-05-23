import { FC } from 'react';
import { useSelector } from 'react-redux';
import * as Survey from 'survey-react';
import 'survey-react/modern.css';
import { endpoints } from '../../api';

Survey.StylesManager.applyTheme('modern');

interface SurveyPluginProps {
  saveId: string;
}

interface SurveyPluginState {
  auth: { token: boolean };
  data: { currentProjectId: number };
  survey: { data: Record<string, unknown>; options: Record<string, unknown> };
  serviceState: { aboutProjectInfoData: { status: boolean } };
}

interface SurveyPluginContent {
  name: string;
  type: string;
  content: string | ArrayBuffer | null;
  file: File;
}

export const SurveyPlugin: FC<SurveyPluginProps> = (props) => {
  const { token } = useSelector((state: SurveyPluginState) => state.auth);
  const { currentProjectId } = useSelector(
    (state: SurveyPluginState) => state.data
  );
  const { data, options } = useSelector(
    (state: SurveyPluginState) => state.survey
  );

  const { status } = useSelector(
    (state: SurveyPluginState) => state.serviceState.aboutProjectInfoData
  );

  const survey = new Survey.Model(options);
  survey.locale = 'ru';
  survey.data = data;
  if (status) {
    survey.mode = 'display';
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  survey.onUploadFiles.add(function (survey, options) {
    let content: SurveyPluginContent[] = [];
    if (Array.isArray(options.files)) {
      options.files.forEach(function (file: File) {
        const fileReader = new FileReader();

        if (
          file.type === 'application/pdf' ||
          file.type === 'image/jpeg' ||
          file.type === 'image/tiff' ||
          file.type ===
            // cspell:disable-next-line
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          // cspell:disable-next-line
          file.type === 'application/msword'
        ) {
          fileReader.onload = function (e) {
            content = content.concat([
              {
                name: file.name,
                type: file.type,
                content: fileReader.result,
                file: file,
              },
            ]);
            if (content.length === options.files.length) {
              //question.value = (question.value || []).concat(content);
              options.callback(
                'success',
                content.map(function (fileContent) {
                  return {
                    file: fileContent.file,
                    content: fileContent.content,
                  };
                })
              );
            }
          };

          fileReader.readAsDataURL(file);
        }
      });
    }
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  survey.onTextMarkdown.add(function (survey, options) {
    options.html = options.text;
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  survey.onComplete.add(async function (sender) {
    const surveyData = sender.data;
    try {
      const response = await fetch(
        `/api${endpoints.project(currentProjectId)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            tables: [
              {
                id: props.saveId,
                data: [surveyData],
              },
            ],
          }),
        }
      );
      const answer = await response.json();
      console.log(answer);
    } catch (err) {
      console.log(err);
    }
  });

  survey.checkErrorsMode = 'onValueChanged';
  survey.completeText = 'Сохранить';
  return <Survey.Survey model={survey} />;
};
