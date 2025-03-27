import { yupResolver } from '@hookform/resolvers/yup';
import { Anchor, Badge, Button } from '@mantine/core';
import { useGoogleLogin } from '@react-oauth/google';
import { IconLockPassword, IconUser } from '@tabler/icons-react';
import CheckboxField from 'components/form-controls/CheckboxField';
import InputField from 'components/form-controls/InputField';
import { showToast } from 'helpers';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchGoogleLogin, fetchLogin } from 'store/auth/authThunk';
import * as yup from 'yup';

function Login(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);

    const form = useForm({
        defaultValues: {
            is_remember_me: false,
        },
        resolver: yupResolver(
            yup.object({
                email: yup.string().nullable().required('Please enter email'),
            })
        ),
    });

    const handleSubmit = async (values) => {
        try {
            const resultAction = await dispatch(fetchLogin(values));

            if (fetchLogin.fulfilled.match(resultAction)) {
                showToast({
                    type: 'success',
                    title: 'Login successfully',
                });

                navigate('/');
            }
        } catch (error) {
            console.error(error);
            showToast({ type: 'error', message: 'Fail to login!' });
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenReponse) => {
            try {
                const { access_token } = tokenReponse;
                console.log({ access_token });
                const resultAction = await dispatch(
                    fetchGoogleLogin({ access_token })
                );

                if (fetchGoogleLogin.fulfilled.match(resultAction)) {
                    showToast({
                        type: 'success',
                        title: 'Login successfully',
                    });
                    navigate('/');
                }
            } catch (error) {
                console.error(error);
                showToast({ type: 'error', message: 'Fail to login!' });
            }
        },
    });

    return (
        <div className="flex h-screen min-h-fit flex-col gap-4 bg-indigo-950 p-2">
            <Badge
                radius="sm"
                variant="gradient"
                gradient={{ from: 'cyan', to: 'violet', deg: 130 }}
                className="min-h-fit cursor-pointer px-3 py-2 text-2xl"
                onClick={() => navigate('/')}
            >
                <p className="font-bold">QUIZ IT</p>
            </Badge>
            <div className="flex flex-grow items-center justify-center">
                <div className="flex h-fit w-96 flex-col items-stretch gap-6 rounded-lg bg-slate-600/50 p-6">
                    <p className="text-xl font-semibold text-white">Welcome!</p>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-3">
                                <InputField
                                    form={form}
                                    name="email"
                                    placeholder="Email"
                                    size="lg"
                                    className="font-semibold"
                                    leftSection={
                                        <IconUser className="h-5 w-5 stroke-[2.5px]" />
                                    }
                                />
                                <InputField
                                    form={form}
                                    name="password"
                                    placeholder="Password"
                                    size="lg"
                                    className="font-semibold"
                                    type="password"
                                    leftSection={
                                        <IconLockPassword className="h-5 w-5 stroke-[2.5px]" />
                                    }
                                />
                                <CheckboxField
                                    form={form}
                                    name="is_remember_me"
                                    label="Remember me"
                                    size="xs"
                                    classNames={{
                                        body: 'flex items-center',
                                        label: '!text-sm text-white',
                                    }}
                                />
                            </div>
                            <Button
                                size="lg"
                                variant="gradient"
                                gradient={{
                                    from: 'cyan',
                                    to: 'violet',
                                    deg: 130,
                                }}
                                type="submit"
                            >
                                Sign in
                            </Button>

                            <div className="flex flex-col items-center justify-center gap-2">
                                {/* <Anchor
                                    href="/"
                                    underline="hover"
                                    className="text-sm"
                                >
                                    Forgot password?
                                </Anchor> */}
                                <p className="text-sm text-white">
                                    Don't have an account?{' '}
                                    <Link
                                        to="/auth/register"
                                        className="text-sm"
                                    >
                                        Sign up
                                    </Link>
                                </p>
                                <div className="flex w-full items-center gap-2">
                                    <div className="h-[1px] flex-grow bg-slate-400"></div>
                                    <p className="h-fit text-sm text-white">
                                        or
                                    </p>
                                    <div className="h-[1px] flex-grow bg-slate-400"></div>
                                </div>
                                <Button
                                    variant="white"
                                    size="md"
                                    leftSection={
                                        <img
                                            src="/icon/google-color-icon.svg"
                                            className="h-6 w-6"
                                        />
                                    }
                                    justify="center"
                                    fullWidth
                                    onClick={handleGoogleLogin}
                                >
                                    <p className="text-slate-700">
                                        Sign in with Google
                                    </p>
                                </Button>
                                {/* <GoogleLogin
                                    onSuccess={(credentialResponse) => {
                                        console.log(credentialResponse);
                                    }}
                                    onError={() => {
                                        console.log('Login Failed');
                                    }}
                                    className="w-full"
                                /> */}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
