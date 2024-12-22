import React, { useState, useEffect } from 'react';
import { Table, Select, Space, Button, Modal } from 'antd';
import {
    Box,
    Heading,
    useColorModeValue,
    Flex,
    Spinner,
} from '@chakra-ui/react';
import { ReloadOutlined, MoreOutlined } from '@ant-design/icons';
import axios from '../../utils/axios';
import api from '../../utils/api';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
dayjs.locale('vi');

const TimeTracking = () => {
    const [timeLogs, setTimeLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(dayjs().format('MM/YYYY'));
    const tableBgColor = useColorModeValue('white', 'gray.700');
    const textColor = useColorModeValue('black', 'white');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDayLogs, setSelectedDayLogs] = useState([]);

    const generateMonths = () => {
        const currentMonth = dayjs();
        const months = [];
        for (let i = 0; i < 10; i++) {
            const month = currentMonth.subtract(i, 'month');
            months.push({
                value: month.format('MM/YYYY'),
                label: month.format('MM/YYYY')
            });
        }
        return months;
    };

    const months = generateMonths();

    const processTimeLogs = (data) => {
        const groupedLogs = {};
        data.forEach(log => {
            const date = dayjs(log.time).format('YYYY-MM-DD');
            if (!groupedLogs[date]) {
                groupedLogs[date] = [];
            }
            groupedLogs[date].push(log);
        });

        const processedLogs = Object.keys(groupedLogs).map(date => {
            const logs = groupedLogs[date];
            logs.sort((a, b) => dayjs(a.time).valueOf() - dayjs(b.time).valueOf());

            return {
                date: date,
                check_in: logs[0].time,
                check_out: logs[logs.length - 1].time,
                all_logs: logs
            };
        });

        processedLogs.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());

        return processedLogs;
    };

    const fetchTimeLogs = async (month) => {
        setLoading(true);
        try {
            const [monthStr, yearStr] = month.split("/");
            const monthNum = parseInt(monthStr);
            const yearNum = parseInt(yearStr);
            const startDate = dayjs().year(yearNum).month(monthNum - 1).startOf('month').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
            const endDate = dayjs().year(yearNum).month(monthNum - 1).endOf('month').format('YYYY-MM-DDTHH:mm:ss.SSSZ');

            const data = await axios.execute(
                'get',
                `${api.USER.get_tracking_time}?startDate=${startDate}&endDate=${endDate}`,
                null,
                { enableMessage: false }
            );
            setTimeLogs(processTimeLogs(data));
        }
        catch (e) {
            console.log(e);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTimeLogs(selectedMonth);
    }, [selectedMonth]);

    const handleMonthChange = (value) => {
        setSelectedMonth(value);
    };

    const handleRefresh = () => {
        fetchTimeLogs(selectedMonth);
    };

    const handleShowMore = (logs) => {
        setSelectedDayLogs(logs);
        setModalVisible(true);
    };

    const columns = [
        {
            title: 'Ngày',
            dataIndex: 'date',
            key: 'date',
            render: (date) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Giờ vào',
            dataIndex: 'check_in',
            key: 'check_in',
            render: (time) => time ? dayjs(time).format('HH:mm:ss') : null,
        },
        {
            title: 'Giờ ra',
            dataIndex: 'check_out',
            key: 'check_out',
            render: (time) => time ? dayjs(time).format('HH:mm:ss') : null,
        },
        {
            title: '',
            key: 'action',
            render: (text, record) => (
                <Button type="link" icon={<MoreOutlined />} onClick={() => handleShowMore(record.all_logs)}>
                    More
                </Button>
            ),
        },
    ];

    return (
        <Box p={5}>
            <Flex align="center" justify="space-between" mb={4}>
                <Heading as="h1" size="lg" color={textColor}>
                    Chấm công
                </Heading>
                <Space>
                    <Select
                        size="large"
                        defaultValue={selectedMonth}
                        options={months}
                        onChange={handleMonthChange}
                        style={{ width: 200 }}
                    />
                    <Button
                        size="large"
                        icon={<ReloadOutlined />}
                        onClick={handleRefresh}
                    >
                        Làm mới
                    </Button>
                </Space>
            </Flex>
            <Table
                columns={columns}
                dataSource={timeLogs}
                rowKey="date"
                bordered
                bgcolor={tableBgColor}
                style={{ background: tableBgColor }}
                loading={loading}
            />

            <Modal
                title="Chi tiết chấm công"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                <Table
                    columns={[
                        {
                            title: 'Cổng',
                            dataIndex: 'gate',
                            key: 'gate',
                        },
                        {
                            title: 'Thời gian',
                            dataIndex: 'time',
                            key: 'time',
                            render: (time) => dayjs(time).format('HH:mm:ss'),
                        },
                    ]}
                    dataSource={selectedDayLogs}
                    rowKey="_id"
                    pagination={false}
                />
            </Modal>
        </Box>
    );
};

export default TimeTracking;