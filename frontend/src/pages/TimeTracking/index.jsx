import React, { useState, useEffect } from 'react';
import { Table, Select, Space } from 'antd';
import {
    Box,
    Heading,
    useColorModeValue,
    Flex,
    Spinner,
} from '@chakra-ui/react';
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
                `${api.USER.get_time_tracking}?startDate=${startDate}&endDate=${endDate}`,
                null,
                { enableMessage: false }
            );
            setLoading(false);
            setTimeLogs(_ => data?.time_logs);
        }
        catch (e) {
            setLoading(false)
            console.log(e);
        }
    };

    useEffect(() => {
        fetchTimeLogs(selectedMonth);
    }, [selectedMonth]);

    const handleMonthChange = (value) => {
        setSelectedMonth(value);
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
    ];

    return (
        <Box p={5}>
            <Flex align="center" justify="space-between" mb={4}>
                <Heading as="h1" size="lg" color={textColor}>
                    Chấm công
                </Heading>
                <Select
                    size="large"
                    defaultValue={selectedMonth}
                    options={months}
                    onChange={handleMonthChange}
                    style={{ width: 200 }}
                />
            </Flex>
            <Table
                columns={columns}
                dataSource={timeLogs}
                rowKey="_id"
                bordered
                bgcolor={tableBgColor}
                style={{ background: tableBgColor }}
                loading={loading}
            />

        </Box>
    );
};

export default TimeTracking;