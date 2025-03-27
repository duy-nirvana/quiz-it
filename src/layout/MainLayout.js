import {
    AppShell,
    Badge,
    Burger,
    Button,
    Group,
    Menu
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    IconChevronDown,
    IconLogout2,
    IconPlus,
    IconUserCircle,
} from '@tabler/icons-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { clearAuthData } from 'store/auth/authSlice';
import { clearPersonalData } from 'store/personal/personalSlice';
import { fetchPersonal } from 'store/personal/personalThunk';

function MainLayout({ children }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { auth, personal } = useSelector((state) => state);
    const [opened, { toggle }] = useDisclosure();

    useEffect(() => {
        if (auth.access_token && !personal.profile) {
            dispatch(fetchPersonal());
        }
    }, []);

    const handleLogout = () => {
        navigate('/');
        dispatch(clearAuthData());
        dispatch(clearPersonalData());
    };

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
                        color="white"
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
                            <Button
                                variant="filled"
                                color="teal"
                                size="md"
                                onClick={() =>
                                    auth.access_token
                                        ? navigate('/quiz')
                                        : navigate('/auth/login')
                                }
                            >
                                Create
                            </Button>
                            {!auth.access_token ? (
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
                                            Hi, {personal.profile?.email}
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
                                            onClick={handleLogout}
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

            <AppShell.Navbar
                py="md"
                px={4}
                className="bg-slate-900/95"
                withBorder={false}
            >
                <Group className="px-4">
                    {auth.access_token && (
                        <p className="text-lg font-bold text-white">
                            Hi, {personal.profile?.email}
                        </p>
                    )}
                    <Button
                        variant="filled"
                        color="orange"
                        size="md"
                        onClick={() => {
                            auth.access_token
                                ? navigate('/quiz')
                                : navigate('/auth/login');
                            toggle();
                        }}
                        fullWidth
                        leftSection={<IconPlus className="h-5 w-5" />}
                    >
                        Create
                    </Button>
                    {!auth.access_token && (
                        <Button
                            color="green"
                            size="md"
                            onClick={() => {
                                navigate('/auth/login');
                                toggle();
                            }}
                            fullWidth
                        >
                            Login
                        </Button>
                    )}

                    {auth.access_token && (
                        <>
                            <Button
                                size="md"
                                onClick={() => {
                                    navigate('/profile');
                                    toggle();
                                }}
                                fullWidth
                                leftSection={
                                    <IconUserCircle className="h-5 w-5" />
                                }
                            >
                                My profile
                            </Button>
                            <Button
                                variant="outline"
                                color="red"
                                size="md"
                                onClick={() => {
                                    handleLogout();
                                    toggle();
                                }}
                                fullWidth
                                leftSection={
                                    <IconLogout2 className="h-5 w-5" />
                                }
                            >
                                Logout
                            </Button>
                        </>
                    )}
                </Group>
            </AppShell.Navbar>

            <AppShell.Main className="flex flex-1 flex-col bg-indigo-950">
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}

export default MainLayout;
