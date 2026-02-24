import React from 'react';
import { Meta } from '@storybook/react';
import {
  Chat,
  ComponentError,
  componentCatalog,
  createChartComponentDef
} from '../src';

export default {
  title: 'Components/ComponentError',
  component: ComponentError
} as Meta;

const catalog = componentCatalog({
  Chart: createChartComponentDef()
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div
    className="dark:bg-gray-950 bg-white"
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      padding: 20
    }}
  >
    <Chat
      viewType="chat"
      sessions={[]}
      activeSessionId=""
      components={catalog}
    >
      <div style={{ maxWidth: 500 }}>{children}</div>
    </Chat>
  </div>
);

export const Default = () => (
  <Wrapper>
    <ComponentError
      title="Failed to render chart"
      message="The chart data could not be parsed. Please check the JSON format."
    />
  </Wrapper>
);

export const WithCode = () => (
  <Wrapper>
    <ComponentError
      title="Invalid chart configuration"
      message="The 'type' field is missing from the chart configuration."
      code={`{
  "data": [
    { "key": "A", "data": 10 },
    { "key": "B", "data": 20 }
  ]
}`}
    />
  </Wrapper>
);

export const Warning = () => (
  <Wrapper>
    <ComponentError
      variant="warning"
      title="Chart data incomplete"
      message="Some data points are missing values. The chart may not display correctly."
    />
  </Wrapper>
);

export const WarningWithCode = () => (
  <Wrapper>
    <ComponentError
      variant="warning"
      title="Unsupported chart type"
      message="The chart type 'scatter' is not supported. Falling back to bar chart."
      code={`{
  "type": "scatter",
  "data": [{ "key": "X", "data": 50 }]
}`}
    />
  </Wrapper>
);
