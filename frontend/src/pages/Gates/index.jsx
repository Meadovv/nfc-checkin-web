import React, { useState, useEffect } from 'react';
import { Table, Space, Tag, Pagination, Modal as AntdModal, Form, Input, Button, Input as AntdInput } from 'antd';
import {
    Box,
    Heading,
    IconButton,
    useToast,
    Flex,
    useColorModeValue,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import axios from '../../utils/axios';
import api from '../../utils/api';

const Gates = () => {
    const [gates, setGates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [selectedGate, setSelectedGate] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [addForm] = Form.useForm();
    const [search, setSearch] = useState('');

    const toast = useToast();
    const tableBgColor = useColorModeValue('white', 'gray.700');
    const textColor = useColorModeValue('black', 'white');

    // Fetch gates data from API
    const fetchGates = async (page = 1, pageSize = 10, search = '') => {
        setLoading(true);
        try {
            const data = await axios.execute(
                'get',
                `${api.ADMIN.get_gate}?page=${page}&limit=${pageSize}&search=${search}`,
                null,
                { enableMessage: false }
            );
            setLoading(false);
            setGates(_ => data?.gates);
            setTotal(data?.total);
        }
        catch (e) {
            setLoading(false)
            console.log(e);
        }
    };

    useEffect(() => {
        fetchGates(page, pageSize, search);
    }, [page, pageSize]);

    // Handle update gate button click
    const handleUpdateGate = (gate) => {
        setSelectedGate(gate);
        form.setFieldsValue(gate);
        setModalVisible(true);
    };

    // Handle update gate modal submit
    const handleUpdateModal = async () => {
        try {
            await form.validateFields()
            await axios.execute('post', api.ADMIN.update_gate, form.getFieldsValue());
            setModalVisible(false);
            fetchGates(page, pageSize, search);
        }
        catch (errorInfo) {
            console.log('Validate Failed:', errorInfo);
        }
    }

    // Handle delete gate button click
    const handleDeleteGate = (gate) => {
        AntdModal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa cổng ${gate.gate_name}?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            okButtonProps: { size: 'large' },
            cancelButtonProps: { size: 'large' },
            onOk() {
                // TODO: call api delete gate
                const updatedGates = gates.filter((g) => g.gate_id !== gate.gate_id);
                setGates(updatedGates);
                toast({
                    title: 'Xóa thành công',
                    description: `Cổng ${gate.gate_name} đã được xóa.`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            },
        });
    };

    // Handle switch gate activation
    const handleSwitchActivation = async (gate) => {
        AntdModal.confirm({
            title: 'Xác nhận',
            content: `Bạn có chắc chắn muốn ${gate.activated ? 'vô hiệu hóa' : 'kích hoạt'} cổng ${gate.gate_name}?`,
            okText: 'Xác nhận',
            okType: gate.activated ? 'danger' : 'primary',
            cancelText: 'Hủy',
            okButtonProps: { size: 'large' },
            cancelButtonProps: { size: 'large' },
            onOk: async () => {
                try {
                    setLoading(true);
                    await axios.execute('post', api.ADMIN.update_gate, { gate_id: gate.gate_id, activated: !gate.activated }, { enableMessage: false });
                    const updatedGates = gates.map(g =>
                        g.gate_id === gate.gate_id ? { ...g, activated: !gate.activated } : g
                    );
                    setGates(updatedGates);
                    toast({
                        title: gate.activated ? 'Vô hiệu hóa' : 'Kích hoạt',
                        description: `Cổng ${gate.gate_name} đã được ${gate.activated ? 'vô hiệu hóa' : 'kích hoạt'}.`,
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    });
                    setLoading(false);
                }
                catch (e) {
                    setLoading(false);
                    console.log(e)
                    toast({
                        title: 'Lỗi',
                        description: 'Lỗi khi cập nhật trạng thái',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                }
            },
        });
    };

    // Handle page change
    const onPageChange = (page) => {
        setPage(page);
    }

    // Handle page size change
    const onShowSizeChange = (_, size) => {
        setPageSize(size);
        setPage(1);
    };

    // Handle cancel update modal
    const handleCancelModal = () => {
        setModalVisible(false);
    }

    // Handle cancel add modal
    const handleCancelAddModal = () => {
        setAddModalVisible(false);
    }

    // Handle add gate button click
    const handleAddGate = () => {
        setAddModalVisible(true);
    }

    // Handle add gate modal submit
    const handleAddModal = async () => {
        try {
            await addForm.validateFields()
            await axios.execute('post', api.ADMIN.add_gate, addForm.getFieldsValue());
            setAddModalVisible(false);
            addForm.resetFields();
            fetchGates(page, pageSize, search);
        }
        catch (e) {
            console.log(e);
        }
    }

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    // Handle search submit
    const handleSearchSubmit = () => {
        fetchGates(1, pageSize, search);
        setPage(1);
    };

    // Table columns definition
    const columns = [
        {
            title: 'ID cổng',
            dataIndex: 'gate_id',
            key: 'gate_id',
        },
        {
            title: 'Tên cổng',
            dataIndex: 'gate_name',
            key: 'gate_name',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'activated',
            key: 'activated',
            render: (activated) => (
                <Tag color={activated ? 'green' : 'red'}>
                    {activated ? 'Hoạt động' : 'Không hoạt động'}
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (text, gate) => (
                <Space size="small">
                    <IconButton
                        icon={<EditIcon />}
                        colorScheme="blue"
                        aria-label="Cập nhật cổng"
                        onClick={() => handleUpdateGate(gate)}
                    />
                    <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        aria-label="Xóa cổng"
                        onClick={() => handleDeleteGate(gate)}
                        disabled={gate.activated}

                    />
                    <IconButton
                        icon={gate.activated ? <CloseIcon /> : <CheckIcon />}
                        colorScheme={gate.activated ? 'orange' : 'green'}
                        aria-label={gate.activated ? 'Vô hiệu hóa cổng' : 'Kích hoạt cổng'}
                        onClick={() => handleSwitchActivation(gate)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <Box p={5}>
            <Flex align="center" justify="space-between" mb={4}>
                <Heading as="h1" size="lg" color={textColor}>
                    Quản lý cổng
                </Heading>
                <Button type='default' onClick={handleAddGate} size="large">
                    Thêm cổng
                </Button>
            </Flex>
            <Flex mb={4} justify="end">
                <AntdInput.Search
                    placeholder="ID cổng hoặc tên cổng"
                    size="large"
                    onChange={handleSearchChange}
                    onSearch={handleSearchSubmit}
                    enterButton="Tìm kiếm"
                />
            </Flex>
            <Table
                loading={loading}
                columns={columns}
                dataSource={gates}
                rowKey="gate_id"
                bordered
                bgcolor={tableBgColor}
                style={{ background: tableBgColor }}
                pagination={false}
            />
            <Flex justify="end" mt={4}>
                <Pagination
                    current={page}
                    total={total}
                    pageSize={pageSize}
                    pageSizeOptions={[10, 20, 40]}
                    onChange={onPageChange}
                    onShowSizeChange={onShowSizeChange}
                    disabled={loading}
                    showSizeChanger
                    size="large"
                />
            </Flex>

            {/* Update Gate Modal */}
            <AntdModal
                title="Thông tin cổng"
                open={modalVisible}
                onCancel={handleCancelModal}
                footer={[
                    <Button key="cancel" onClick={handleCancelModal} size="large">
                        Hủy
                    </Button>,
                    <Button key="update" type="primary" onClick={handleUpdateModal} size="large">
                        Cập nhật
                    </Button>,
                ]}
            >
                <Form form={form} layout="vertical" size="large">
                    {selectedGate && (
                        <>
                            <Form.Item
                                label="ID"
                                name="_id"
                                hidden
                            >
                                <Input disabled size="large" />
                            </Form.Item>
                            <Form.Item
                                label="ID cổng"
                                name="gate_id"
                            >
                                <Input size="large" />
                            </Form.Item>
                            <Form.Item
                                label="Tên cổng"
                                name="gate_name"
                            >
                                <Input size="large" />
                            </Form.Item>
                            <Form.Item
                                label="Mật khẩu cổng"
                                name="gate_secret"
                            >
                                <Input.Password size="large" />
                            </Form.Item>

                        </>
                    )}

                </Form>
            </AntdModal>

            {/* Add Gate Modal */}
            <AntdModal
                title="Thêm cổng"
                open={addModalVisible}
                onCancel={handleCancelAddModal}
                footer={[
                    <Button key="cancel" onClick={handleCancelAddModal} size="large">
                        Hủy
                    </Button>,
                    <Button key="add" type="primary" onClick={handleAddModal} size="large">
                        Thêm
                    </Button>,
                ]}
            >
                <Form form={addForm} layout="vertical" size="large">

                    <Form.Item
                        label="ID cổng"
                        name="gate_id"
                        rules={[{ required: true, message: 'Vui lòng nhập ID cổng!' }]}
                    >
                        <Input size="large" />
                    </Form.Item>
                    <Form.Item
                        label="Tên cổng"
                        name="gate_name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên cổng!' }]}
                    >
                        <Input size="large" />
                    </Form.Item>
                    <Form.Item
                        label="Mật khẩu cổng"
                        name="gate_secret"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cổng!' }]}
                    >
                        <Input.Password size="large" />
                    </Form.Item>
                </Form>
            </AntdModal>
        </Box>
    );
};

export default Gates;