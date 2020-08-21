import React, { useState } from 'react';
import {
  Row,
  Col,
  Input,
  Card,
  Button,
  notification,
  Space,
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import fileDownload from 'js-file-download';
import format from '../helpers/formatter';

const openNotification = (
  type: 'error' | 'success',
  message: string,
  description: string,
): void => {
  notification[type]({
    message: message,
    description: description,
  });
};

const MainView: React.FC = () => {
  const [format_input, setFormatInput] = useState(
    'P|Carl Gustaf|Bernadotte\n' +
      'T|0768-101801|08-101801\n' +
      'A|Drottningholms slott|Stockholm|10001\n' +
      'F|Victoria|1977\n' +
      'A|Haga Slott|Stockholm|10002\n' +
      'F|Carl Philip|1979\n' +
      'T|0768-101802|08-101802\n' +
      'P|Barack|Obama\n' +
      'A|1600 Pennsylvania Avenue|Washington, D.C',
  );
  const [format_output, setFormatOutput] = useState<string>('');

  const onFormatClick = (): void => {
    try {
      const formatted = format(format_input);

      setFormatOutput(formatted);

      openNotification(
        'success',
        'Success!',
        'Your data is not formatted as beaaaaautiful XML.',
      );
    } catch (e) {
      openNotification('error', 'Something went wrong...', e.message);
    }
  };

  const saveToFile = () => {
    if (!format_output) {
      openNotification('error', 'Something went wrong...', 'Nothing to export');
      return;
    }

    fileDownload(format_output, 'test.xml', 'application/xml');
  };

  return (
    <div className="mainview">
      <Row gutter={32}>
        <Col span={8} offset={4}>
          <Card className="main-card">
            <Input.TextArea
              placeholder="Input text to format here..."
              value={format_input}
              bordered={false}
              autoSize={{ minRows: 16 }}
              onChange={({ target: { value } }) => setFormatInput(value)}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className={'main-card'}>
            <div className="codeview">{format_output}</div>
          </Card>
        </Col>
      </Row>
      <div className="button-container">
        <Space size="large">
          <Button
            onClick={onFormatClick}
            disabled={!format_input}
            size="large"
            type="primary"
          >
            Format
          </Button>
          <Button
            disabled={!format_output}
            size="large"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={saveToFile}
          >
            Save to XML file
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default MainView;
