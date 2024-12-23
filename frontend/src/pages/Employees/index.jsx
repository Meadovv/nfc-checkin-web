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

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [addForm] = Form.useForm();
    const [search, setSearch] = useState('');

    const toast = useToast();
    const tableBgColor = useColorModeValue('white', 'gray.700');
    const textColor = useColorModeValue('black', 'white');

    const fetchEmployees = async (page = 1, pageSize = 10, search = '') => {
        setLoading(true);
        try {
            const data = await axios.execute(
                'get',
                `${api.ADMIN.get_employee}?page=${page}&limit=${pageSize}&search=${search}`,
                null,
                { enableMessage: false }
            );
            setLoading(false);
            setEmployees(_ => data?.users);
            setTotal(data?.total);
        }
        catch (e) {
            setLoading(false)
            console.log(e);
        }
    };

    useEffect(() => {
        fetchEmployees(page, pageSize, search);
    }, [page, pageSize]);

    const handleUpdateUser = (employee) => {
        setSelectedEmployee(employee);
        form.setFieldsValue(employee);
        setModalVisible(true);
    };

    const handleUpdateModal = async () => {
        try {
            await form.validateFields()
            await axios.execute('post', api.ADMIN.update_employee, form.getFieldsValue());
            setModalVisible(false);
            fetchEmployees(page, pageSize, search);
        }
        catch (errorInfo) {
            console.log('Validate Failed:', errorInfo);
        }
    }

    const handleDeleteUser = (employee) => {
        AntdModal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc muốn xóa nhân viên ${employee.username}?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            okButtonProps: { size: 'large' },
            cancelButtonProps: { size: 'large' },
            onOk() {
                // TODO: Call api delete user
                const updatedEmployees = employees.filter((emp) => emp.username !== employee.username);
                setEmployees(updatedEmployees);
                toast({
                    title: 'Xóa thành công',
                    description: `Nhân viên ${employee.username} đã được xóa.`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            },
        });
    };

    const handleSwitchUser = async (employee) => {
        AntdModal.confirm({
            title: 'Xác nhận',
            content: `Bạn có chắc muốn ${employee.activated ? 'vô hiệu hóa' : 'kích hoạt'} nhân viên ${employee.username}?`,
            okText: 'Xác nhận',
            okType: employee.activated ? 'danger' : 'primary',
            cancelText: 'Hủy',
            okButtonProps: { size: 'large' },
            cancelButtonProps: { size: 'large' },
            onOk: async () => {
                // TODO: call api switch user
                try {
                    setLoading(true);
                    await axios.execute('post', api.ADMIN.switch_employee, { username: employee.username }, { enableMessage: false });
                    const updatedEmployees = employees.map(emp =>
                        emp.username === employee.username ? { ...emp, activated: !emp.activated } : emp
                    );
                    setEmployees(updatedEmployees);
                    toast({
                        title: employee.activated ? 'Vô hiệu hóa' : 'Kích hoạt',
                        description: `Nhân viên ${employee.username} đã được ${employee.activated ? 'vô hiệu hóa' : 'kích hoạt'}.`,
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

    const onPageChange = (page) => {
        setPage(page);
    }

    const onShowSizeChange = (_, size) => {
        setPageSize(size);
        setPage(1);
    };

    const handleCancelModal = () => {
        setModalVisible(false);
    }
    const handleCancelAddModal = () => {
        setAddModalVisible(false);
    }

    const handleAddUser = () => {
        setAddModalVisible(true);
    }
    const handleAddModal = async () => {
        try {
            await addForm.validateFields()
            await axios.execute('post', api.ADMIN.add_employee, addForm.getFieldsValue());
            setAddModalVisible(false);
            addForm.resetFields();
            fetchEmployees(page, pageSize, search);
        }
        catch (e) {
            console.log(e);
        }
    }

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSearchSubmit = () => {
        fetchEmployees(1, pageSize, search);
        setPage(1);
    };

    const columns = [
        {
            title: 'Tên đăng nhập',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Tên đầy đủ',
            dataIndex: 'fullname_slug',
            key: 'fullname_slug',
            responsive: ['md'],
        },
        {
            title: 'NFC ID',
            dataIndex: 'nfc_id',
            key: 'nfc_id',
            responsive: ['md'],
        },
        {
            title: 'Trạng thái',
            dataIndex: 'activated',
            key: 'activated',
            render: (activated) => (
                <Tag color={activated ? 'green' : 'red'}>
                    {activated ? 'Hoạt động' : 'Vô hiệu hóa'}
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (text, employee) => (
                <Space size="small">
                    <IconButton
                        icon={<EditIcon />}
                        colorScheme="blue"
                        aria-label="Cập nhật nhân viên"
                        onClick={() => handleUpdateUser(employee)}
                    />
                    <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        aria-label="Xóa nhân viên"
                        onClick={() => handleDeleteUser(employee)}
                        isDisabled={employee.activated}
                    />
                    <IconButton
                        icon={employee.activated ? <CloseIcon /> : <CheckIcon />}
                        colorScheme={employee.activated ? 'orange' : 'green'}
                        aria-label={employee.activated ? 'Vô hiệu hóa' : 'Kích hoạt'}
                        onClick={() => handleSwitchUser(employee)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <Box p={5}>
            <Flex align="center" justify="space-between" mb={4}>
                <Heading as="h1" size="lg" color={textColor}>
                    Quản lý nhân viên
                </Heading>
                <Button type='default' onClick={handleAddUser} size="large">
                    Thêm nhân viên
                </Button>
            </Flex>
            <Flex mb={4} justify="end">
                <AntdInput.Search
                    placeholder="Tên đăng nhập, tên đầy đủ hoặc NFC ID"
                    size="large"
                    onChange={handleSearchChange}
                    onSearch={handleSearchSubmit}
                    enterButton="Tìm kiếm"
                />
            </Flex>
            <Table
                loading={loading}
                columns={columns}
                dataSource={employees}
                rowKey="username"
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

            {/* Update Employee Modal */}
            <AntdModal
                title="Thông tin nhân viên"
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
                    {selectedEmployee && (
                        <>
                            <Form.Item
                                label="ID"
                                name="_id"
                                hidden
                            >
                                <Input disabled size="large" />
                            </Form.Item>
                            <Form.Item label="Họ và tên">
                                <Input value={selectedEmployee.fullname} disabled size="large" />
                            </Form.Item>
                            <Form.Item
                                label="Tên đăng nhập"
                                name="username"
                            >
                                <Input size="large" />
                            </Form.Item>
                            <Form.Item
                                label="Tên đầy đủ"
                                name="fullname_slug"
                                rules={[{ required: true, message: 'Vui lòng nhập tên đầy đủ!' }]}
                            >
                                <Input size="large" />
                            </Form.Item>
                            <Form.Item
                                label="NFC ID"
                                name="nfc_id"
                                rules={[{ required: true, message: 'Vui lòng nhập NFC ID!' }]}
                            >
                                <Input size="large" />
                            </Form.Item>
                        </>
                    )}

                </Form>
            </AntdModal>

            {/* Add Employee Modal */}
            <AntdModal
                title="Thêm nhân viên"
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
                        label="Tên đăng nhập"
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                    >
                        <Input size="large" />
                    </Form.Item>
                    <Form.Item
                        label="Họ và tên"
                        name="fullname"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                    >
                        <Input size="large" />
                    </Form.Item>
                    <Form.Item
                        label="NFC ID"
                        name="nfc_id"
                        rules={[{ required: true, message: 'Vui lòng nhập NFC ID!' }]}
                    >
                        <Input size="large" />
                    </Form.Item>
                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password size="large" />
                    </Form.Item>

                </Form>
            </AntdModal>
        </Box>
    );
};

export default Employees;