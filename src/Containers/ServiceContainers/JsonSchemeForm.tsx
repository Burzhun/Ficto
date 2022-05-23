import { AjvError, IChangeEvent, ISubmitEvent, UiSchema } from '@rjsf/core';
import JSONForm from '@rjsf/material-ui';
import { DatePicker, Input, Typography } from 'antd';
import type { JSONSchema7, JSONSchema7Type } from 'json-schema';
import { useEffect, useState } from 'react';
import { FileComponent } from '../../Components/ui/FileInput';
import { AsyncSelectEditorComponent } from './AsyncSelectEditor';
const { TextArea } = Input;
const { Paragraph } = Typography;

type SchemeProperty = {
  type: string;
  title: string | undefined;
  default?: JSONSchema7Type | undefined;
  url?: string;
};
type SchemeProperties = {
  name: string;
  value: SchemeProperty;
};
export type CustomScheme = {
  title: string;
  type: string;
  required: string | string[];
  properties: SchemeProperties[];
};
const prepareScheme = (sc: CustomScheme) => {
  const schema: JSONSchema7 = { ...sc, properties: {} } as JSONSchema7;
  const uiSchema: UiSchema = {};
  sc.properties.forEach(({ name, value }) => {
    switch (value.type) {
      case 'asyncselect': {
        if (schema.properties) schema.properties[name] = { type: 'string' };
        uiSchema[name] = {
          'ui:widget': (props) =>
            AsyncSelectEditorComponent({
              ...props,
              url: value.url || '',
            }),
        };
        break;
      }
      case 'boolean':
        if (schema.properties)
          schema.properties[name] = { ...value, type: 'boolean' };
        break;
      case 'file': {
        if (schema.properties) schema.properties[name] = { type: 'string' };
        uiSchema[name] = {
          'ui:widget': (props) => (
            <FileComponent
              onChange={(data) => props.onChange(data)}
              label={props.title}
              value={props.value}
            />
          ),
        };
        break;
      }
      case 'date': {
        if (schema.properties)
          schema.properties[name] = { ...value, type: 'string' };
        uiSchema[name] = {
          'ui:widget': (props) => (
            <DatePicker
              style={{ width: '200px' }}
              onChange={(e) => {
                console.log(e);
                props.onChange(e?.format('YYYY-MM-DD'));
              }}
              placeholder={props.label}
            />
          ),
        };
        break;
      }
      case 'radio': {
        if (schema.properties)
          schema.properties[name] = { ...value, type: 'string' };
        uiSchema[name] = {
          'ui:widget': value.type,
        };
        break;
      }
      case 'textarea': {
        if (schema.properties)
          schema.properties[name] = { ...value, type: 'string' };
        uiSchema[name] = {
          'ui:widget': (props) => (
            <TextArea
              value={props.value}
              rows={4}
              onChange={(e) => props.onChange(e.target.value)}
              placeholder={props.label}
            />
          ),
        };
        break;
      }
      case 'string': {
        if (schema.properties)
          schema.properties[name] = { ...value, type: 'string' };
        uiSchema[name] = {
          'ui:widget': (props) => (
            <>
              <Typography.Text>{props.label}</Typography.Text>
              <Input
                value={props.value}
                addonBefore={''}
                onChange={(e) => props.onChange(e.target.value)}
              />
            </>
          ),
        };
        break;
      }
      default: {
        if (schema.properties)
          schema.properties[name] = { ...value, type: 'string' };
      }
    }
  });
  return { schema, uiSchema };
};

type ValidatorType = {
  [k: string]: string;
};

type FormDataType = {
  [key: string]: string | number | boolean;
};

export function JsonSchemeForm({ schemaConfig, rules }) {
  const [data, setData] = useState<unknown>({});
  const [originalScheme, setOriginalScheme] = useState<JSONSchema7 | undefined>(
    undefined
  );
  const [fields, setFields] = useState<string[]>([]);
  const [sc, setSC] = useState<JSONSchema7 | undefined>(undefined);
  const [uiSchema, setUiSchema] = useState<UiSchema>({});
  const onSubmit = (event: ISubmitEvent<unknown>) => {
    const formData: FormDataType = event.formData as FormDataType;
    const newData = {};
    fields.forEach((f) => {
      newData[f] = (formData[f] || '').toString();
    });
    console.log(newData);
    //setData1(event.formData as FormDataType);
  };
  require('../../Style/antd.css');

  useEffect(() => {
    const { schema, uiSchema } = prepareScheme(schemaConfig);
    setOriginalScheme(schema);
    setSC(validate(schema));
    setUiSchema(uiSchema);
  }, []);

  useEffect(() => {
    setFields(Object.keys(sc?.properties || []));
  }, [sc]);

  //useEffect

  const onChange = (event: IChangeEvent<unknown>) => {
    console.log(event.formData);
    setData(event.formData);
  };

  const onError = (errors: AjvError[]) => {
    console.error(errors);
  };

  useEffect(() => {
    if (originalScheme) setSC(validate(originalScheme));
  }, [data]);

  const validate = (schema: JSONSchema7) => {
    const validator: ValidatorType = rules;
    const newSchema = { ...schema };
    const newProperties = schema?.properties ? { ...schema?.properties } : {};
    Object.keys(validator).forEach((key) => {
      const value = eval(validator[key]);
      if (key.indexOf('.') > 0) {
        const [key1, subkey] = key.split('.').slice(0, 2);
        key = key1;
        const prop = newProperties[key];
        if (
          newProperties &&
          schema.properties &&
          newProperties[key] &&
          subkey === 'enum'
        ) {
          if (typeof prop === 'object' && prop.hasOwnProperty(subkey)) {
            prop[subkey] = value;
            newProperties[key] = prop;
          }
        }
      } else {
        if (newProperties && schema.properties) {
          if (value) {
            newProperties[key] = schema.properties[key];
          } else delete newProperties[key];
        }
      }
    });
    newSchema.properties = newProperties;
    return JSON.parse(JSON.stringify(newSchema));
  };

  const makeUISchema = (uiSchema: UiSchema) => {
    const schema = { ...uiSchema };
    Object.keys(schema).forEach((k) => {
      if (schema[k]) {
        if (schema[k]['ui:widget'] === 'asyncselect')
          schema[k]['ui:widget'] = AsyncSelectEditorComponent;
      }
    });
    return schema;
  };

  return (
    <div style={{ maxWidth: '1000px', margin: 'auto' }}>
      <JSONForm
        schema={sc || {}}
        uiSchema={makeUISchema(uiSchema)}
        onSubmit={onSubmit}
        onChange={onChange}
        onError={onError}
        formData={data}
      />
    </div>
  );
}
