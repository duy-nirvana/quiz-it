import {
    AppShell,
    Badge,
    Burger,
    Button,
    Group,
    Menu,
    UnstyledButton,
    rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    IconChevronDown,
    IconLogout2,
    IconUserCircle,
} from '@tabler/icons-react';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

function MainLayout({ children }) {
    const navigate = useNavigate();
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { desktop: true, mobile: !opened },
            }}
            padding="md"
        >
            <AppShell.Header className="bg-indigo-950" withBorder={false}>
                <Group h="100%" p="md">
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="sm"
                        size="sm"
                    />
                    <Group justify="space-between" style={{ flex: 1 }}>
                        <Badge
                            radius="sm"
                            variant="gradient"
                            gradient={{ from: 'cyan', to: 'violet', deg: 130 }}
                            className="h-fit cursor-pointer px-3 py-2 text-2xl"
                            onClick={() => navigate('/')}
                        >
                            <p className="font-bold">QUIZ IT</p>
                        </Badge>
                        <Group ml="xl" gap={0} visibleFrom="sm">
                            {/* <UnstyledButton>Home1</UnstyledButton>
                            <UnstyledButton>Blog</UnstyledButton>
                            <UnstyledButton>Contacts</UnstyledButton>
                            <UnstyledButton>Support</UnstyledButton> */}
                            <Button
                                variant="filled"
                                color="teal"
                                size="md"
                                onClick={() => navigate('/quiz')}
                            >
                                Create
                            </Button>
                            {!true ? (
                                <Button
                                    variant="subtle"
                                    color="white"
                                    size="md"
                                    onClick={() => navigate('/auth/login')}
                                >
                                    Login
                                </Button>
                            ) : (
                                <Menu
                                    shadow="md"
                                    width={200}
                                    position="bottom-end"
                                >
                                    <Menu.Target>
                                        <Button
                                            variant="subtle"
                                            color="white"
                                            size="md"
                                            rightSection={
                                                <IconChevronDown className="h-4 w-4" />
                                            }
                                        >
                                            Hi, Dê Núi
                                        </Button>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Item
                                            leftSection={
                                                <IconUserCircle className="h-5 w-5" />
                                            }
                                            onClick={() => navigate('/profile')}
                                        >
                                            My profile
                                        </Menu.Item>
                                        <Menu.Divider />
                                        <Menu.Item
                                            leftSection={
                                                <IconLogout2 className="h-5 w-5" />
                                            }
                                        >
                                            Log out
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            )}
                        </Group>
                    </Group>
                </Group>
            </AppShell.Header>

            {/* <AppShell.Navbar py="md" px={4}>
                <UnstyledButton>Home</UnstyledButton>
                <UnstyledButton>Blog</UnstyledButton>
                <UnstyledButton>Contacts</UnstyledButton>
                <UnstyledButton>Support</UnstyledButton>
            </AppShell.Navbar> */}

            <AppShell.Main className="flex flex-1 flex-col bg-indigo-950">
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}

export default MainLayout;
