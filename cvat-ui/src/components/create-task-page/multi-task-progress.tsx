// Copyright (C) 2022 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import Alert from 'antd/lib/alert';
import Progress from 'antd/lib/progress';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import Collapse from 'antd/lib/collapse';
import Text from 'antd/lib/typography/Text';
import List from 'antd/lib/list';

interface Props {
    tasks: any[];
    onCancel: () => void;
    onOk: () => void;
    onRetryFailedTasks: () => void;
    onRetryCancelledTasks: () => void;
}

export default function MultiTasksProgress(props: Props): JSX.Element {
    const {
        tasks: items,
        onOk,
        onCancel,
        onRetryFailedTasks,
        onRetryCancelledTasks,
    } = props;
    let alertType: any = 'info';

    const countPending = items.filter((item) => item.status === 'pending').length;
    const countProgress = items.filter((item) => item.status === 'progress').length;
    const countCompleted = items.filter((item) => item.status === 'completed').length;
    const countFailed = items.filter((item) => item.status === 'failed').length;
    const countCancelled = items.filter((item) => item.status === 'cancelled').length;
    const countAll = items.length;
    const percent = countAll ?
        Math.ceil(((countAll - (countPending + countProgress)) / countAll) * 100) :
        0;

    const failedFiles: string[] = percent === 100 && countFailed ?
        items.filter((item) => item.status === 'failed')
            .map((item): string => {
                const tabs = Object.keys(item.files);
                const itemType = tabs.find((key) => (item.files[key][0])) || 'local';
                return item.files[itemType][0]?.name || item.files[itemType][0] || '';
            })
            .filter(Boolean) :
        [];

    if (percent === 100) {
        if (countFailed === countAll) {
            alertType = 'error';
        } else if (countFailed) {
            alertType = 'warning';
        }
    }

    return (
        <Alert
            type={alertType}
            message={(
                <div>
                    {percent === 100 ? (
                        <Row>
                            <Col>
                                Finished
                            </Col>
                        </Row>
                    ) : null}
                    <Row>
                        <Col>
                            {`Pending: ${countPending} `}
                        </Col>
                        <Col offset={1}>
                            {`Progress: ${countProgress} `}
                        </Col>
                        <Col offset={1}>
                            {`Completed: ${countCompleted} `}
                        </Col>
                        <Col offset={1}>
                            {`Failed: ${countFailed} `}
                        </Col>
                        {countCancelled ? (<Col offset={1}>{`Cancelled: ${countCancelled} `}</Col>) : null}
                        <Col offset={1}>
                            {`Total: ${countAll}.`}
                        </Col>
                    </Row>
                    <Progress
                        status='normal'
                        percent={percent}
                        strokeWidth={5}
                        size='small'
                        trailColor='#d8d8d8'
                    />
                    <br />
                    {percent === 100 && countFailed ? (
                        <Row>
                            <Collapse style={{
                                width: '100%',
                                marginBottom: 5,
                            }}
                            >
                                <Collapse.Panel
                                    header={(
                                        <Text strong>
                                            Failed files
                                        </Text>
                                    )}
                                    key='appearance'
                                >
                                    <List
                                        size='small'
                                        dataSource={failedFiles}
                                        renderItem={(item: string) => <List.Item>{ item }</List.Item>}
                                    />
                                </Collapse.Panel>
                            </Collapse>
                        </Row>
                    ) : null }
                    <Row justify='end' gutter={5}>
                        {percent === 100 ?
                            (
                                <>
                                    <Col>
                                        <Button disabled={!countFailed} onClick={onRetryFailedTasks}>
                                            Retry failed tasks
                                        </Button>
                                    </Col>
                                    {
                                        countCancelled ? (
                                            <Col>
                                                <Button disabled={!countCancelled} onClick={onRetryCancelledTasks}>
                                                    Retry cancelled tasks
                                                </Button>
                                            </Col>
                                        ) : null
                                    }
                                    <Col>
                                        <Button type='primary' onClick={onOk}>
                                            Ok
                                        </Button>
                                    </Col>
                                </>
                            ) : (
                                <Col>
                                    <Button onClick={onCancel} disabled={!countPending}>
                                        Cancel pending tasks
                                    </Button>
                                </Col>
                            )}
                    </Row>
                </div>
            )}
        />
    );
}
