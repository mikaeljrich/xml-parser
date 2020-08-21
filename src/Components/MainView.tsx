import React, { useState } from 'react';
import {
  Row,
  Col,
  Input,
  Card,
  Button,
  notification,
  Space,
  Modal,
  Typography,
} from 'antd';
import { DownloadOutlined, SmileOutlined } from '@ant-design/icons';
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
  const [format_input, setFormatInput] = useState('');
  const [format_output, setFormatOutput] = useState<string>('');
  const [visible, setVisible] = useState(false);
  const [filename, setFilename] = useState('test');

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

  const showSaveModal = () => {
    setVisible(true);
  };

  const saveToFile = () => {
    if (!format_output) {
      openNotification('error', 'Something went wrong...', 'Nothing to export');
      return;
    }

    setVisible(false);

    filename &&
      fileDownload(format_output, `${filename}.xml`, 'application/xml');
  };

  return (
    <div className="mainview">
      <div className="header">
        <Typography.Title className="main-title" level={1}>
          XML Parser
        </Typography.Title>
      </div>
      <Row gutter={32}>
        <Col span={8} offset={4}>
          <Typography.Title className="titles" level={2}>
            Input:
          </Typography.Title>
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
          <Typography.Title className="titles" level={2}>
            Output:
          </Typography.Title>
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
            type="danger"
            className="pink"
          >
            Format
          </Button>
          <Button
            disabled={!format_output}
            size="large"
            type="danger"
            icon={<DownloadOutlined />}
            onClick={showSaveModal}
            className="pink"
          >
            Save to XML file
          </Button>
        </Space>
      </div>
      <div className="footer">
        <Typography.Text>
          Softhouse here i come <SmileOutlined />
        </Typography.Text>
      </div>
      <Modal
        title="Name on file to save?"
        visible={visible}
        onOk={saveToFile}
        onCancel={() => setVisible(false)}
        okButtonProps={{ disabled: !filename }}
      >
        <Input
          placeholder="Filename..."
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default MainView;
