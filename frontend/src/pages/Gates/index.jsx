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

    const handleUpdateGate = (gate) => {
        setSelectedGate(gate);
        form.setFieldsValue(gate);
        setModalVisible(true);
    };

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

    const handleDeleteGate = (gate) => {
        AntdModal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc muốn xóa cổng ${gate.gate_name}?`,
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
                    title: 'Deleted',
                    description: `Gate ${gate.gate_name} deleted.`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
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

    const handleAddGate = () => {
        setAddModalVisible(true);
    }
    const handleAddModal = async () => {
        try {
            await addForm.validateFields()
            await axios.execute('post', api.ADMIN.add_gate, addForm.getFieldsValue());
            setAddModalVisible(false);
            addForm.resetFields();
            fetchGates(page, pageSize, search);
        }
        catch(e) {
            console.log(e);
        }
    }


    const handleSearchChange = (e) => {
      setSearch(e.target.value);
    };

    const handleSearchSubmit = () => {
      fetchGates(1, pageSize, search);
       setPage(1);
    };


    const columns = [
        {
            title: 'Gate ID',
            dataIndex: 'gate_id',
            key: 'gate_id',
        },
        {
            title: 'Gate Name',
            dataIndex: 'gate_name',
            key: 'gate_name',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, gate) => (
                <Space size="small">
                    <IconButton
                        icon={<EditIcon />}
                        colorScheme="blue"
                        aria-label="Update Gate"
                        onClick={() => handleUpdateGate(gate)}
                    />
                    <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        aria-label="Delete Gate"
                        onClick={() => handleDeleteGate(gate)}

                    />
                </Space>
            ),
        },
    ];

    return (
        <Box p={5}>
            <Flex align="center" justify="space-between" mb={4}>
                <Heading as="h1" size="lg" color={textColor}>
                    Gates
                </Heading>
                  <Button type='default' onClick={handleAddGate} size="large">
                    Thêm Cổng
                </Button>
            </Flex>
             <Flex mb={4} justify="end">
               <AntdInput.Search
                   placeholder="Gate ID or Gate Name"
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

            <AntdModal
                title="Thông tin cổng"
                open={modalVisible}
                onCancel={handleCancelModal}
                footer={[
                    <Button key="cancel" onClick={handleCancelModal} size="large">
                        Cancel
                    </Button>,
                    <Button key="update" type="primary" onClick={handleUpdateModal} size="large">
                        Update
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
                                label="Gate ID"
                                name="gate_id"
                                >
                                <Input size="large" />
                            </Form.Item>
                            <Form.Item
                                label="Gate Name"
                                name="gate_name"
                            >
                                <Input size="large" />
                            </Form.Item>
                             <Form.Item
                                label="Secret"
                                name="gate_secret"
                            >
                                <Input  size="large" />
                            </Form.Item>

                        </>
                    )}

                </Form>
            </AntdModal>

             <AntdModal
                 title="Thêm cổng"
                 open={addModalVisible}
                 onCancel={handleCancelAddModal}
                 footer={[
                     <Button key="cancel" onClick={handleCancelAddModal} size="large">
                         Cancel
                     </Button>,
                     <Button key="add" type="primary" onClick={handleAddModal} size="large">
                         Thêm
                     </Button>,
                 ]}
             >
                 <Form form={addForm} layout="vertical" size="large">

                     <Form.Item
                         label="Gate ID"
                         name="gate_id"
                         rules={[{ required: true, message: 'Please input Gate ID!' }]}
                     >
                         <Input size="large" />
                     </Form.Item>
                     <Form.Item
                         label="Gate Name"
                         name="gate_name"
                         rules={[{ required: true, message: 'Please input Gate Name!' }]}
                     >
                         <Input size="large" />
                     </Form.Item>
                      <Form.Item
                        label="Secret"
                        name="gate_secret"
                        rules={[{ required: true, message: 'Please input Secret!' }]}
                    >
                          <Input.Password size="large"/>
                     </Form.Item>
                 </Form>
             </AntdModal>
        </Box>
    );
};

export default Gates;