'use client'

import {
    Flex,
    Heading,
    Stack,
    Image,
    Button,
    Text,
    useMediaQuery
} from '@chakra-ui/react'
import { Form, Input } from 'antd'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import robots from '../../utils/robots'
import React from 'react'

export default function SplitScreen() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = React.useState(false)
    const [isMobile] = useMediaQuery('(max-width: 768px)')

    const onFinishLogin = async ({ username, password }) => {
        setLoading(true)
        await login({ username, password })
        setLoading(false)
        navigate(robots.home)
    }

    return (
        <Stack
            minH={'100vh'}
            overflow={isMobile ? 'hidden' : 'auto'} // Prevent scrolling on mobile
            direction={{ base: 'column', md: 'row' }}
        >
            <Flex p={8} flex={1} align={'center'} justify={'center'}>
                <Stack spacing={4} w={'full'} maxW={'md'}>
                    <Heading fontSize={'2xl'}>Log in to your account</Heading>
                    <Form
                        style={{
                            border: '1px solid #d3d3d3',
                            padding: '20px',
                            borderRadius: '10px',
                        }}
                        onFinish={onFinishLogin}
                    >
                        <Form.Item
                            name={'username'}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter your username',
                                },
                            ]}
                        >
                            <Input placeholder={'Email'} size="large" />
                        </Form.Item>
                        <Form.Item
                            name={'password'}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter your password',
                                },
                            ]}
                        >
                            <Input.Password placeholder={'Password'} size="large" />
                        </Form.Item>
                        <Stack spacing={6}>
                            <Stack>
                                <Text color={'blue.500'} style={{ cursor: 'pointer' }}>
                                    Forgot password?
                                </Text>
                            </Stack>
                            <Button
                                colorScheme={'blue'}
                                variant={'solid'}
                                type="submit"
                                isLoading={loading}
                                loadingText="Logging in"
                            >
                                Log in
                            </Button>
                        </Stack>
                    </Form>
                </Stack>
            </Flex>
            <Flex flex={1}>
                <Image
                    alt={'Login Image'}
                    objectFit={'cover'}
                    src={
                        'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
                    }
                />
            </Flex>
        </Stack>
    )
}