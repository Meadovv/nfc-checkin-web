'use client'

import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
import {
  FiHome,
  FiUsers,
  FiMenu,
  FiBell,
  FiChevronDown,
  FiInbox,
  FiLogIn,
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import robots from '../../utils/robots'

const SidebarContent = ({ onClose, menuItems, ...rest }) => {
  const navigate = useNavigate()
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Optimus
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {menuItems.map((link) => (
        <NavItem
          key={link.name}
          icon={link.icon}
          onClick={() => {
            navigate(link.path)
            onClose() // Gọi onClose để đóng drawer
          }}
        >
          {link.name}
        </NavItem>
      ))}
    </Box>
  )
}

const NavItem = ({ icon, children, ...rest }) => {
  return (
    <Box
      as="a"
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  )
}

const MobileNav = ({ onOpen, ...rest }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  return (
    <Flex
      position="sticky"
      top={0}
      zIndex={10}
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Optimus
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <IconButton size="lg" variant="ghost" aria-label="open menu" icon={<FiBell />} />
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar size={'sm'} src="/avatar.webp" />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{user?.fullname_slug}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {user?.role}
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <MenuItem onClick={() => navigate(robots.profile)}>Hồ sơ</MenuItem>
              <MenuItem onClick={() => navigate(robots.settings)}>Cài đặt</MenuItem>
              <MenuDivider />
              <MenuItem onClick={() => navigate(robots.logout)}>Đăng xuất</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  )
}

const Layout = ({ children, enabled }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user } = useAuth()

  const userMenuItems = [
    { name: 'Trang chủ', path: robots.home, icon: FiHome },
    { name: 'Chấm công', path: robots.time_tracking, icon: FiInbox },
  ]

  const adminMenuItems = [
    { name: 'Trang chủ', path: robots.home, icon: FiHome },
    { name: 'Chấm công', path: robots.time_tracking, icon: FiInbox },
    { name: 'Nhân viên', path: robots.employees, icon: FiUsers },
    { name: 'Cổng', path: robots.gates, icon: FiLogIn },
  ]

  const menuItems = user?.role === 'admin' ? adminMenuItems : userMenuItems

  return enabled ? (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        menuItems={menuItems}
        onClose={onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent menuItems={menuItems} onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  ) : (
    <>{children}</>
  )
}

export default Layout