import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mantine/core';
import { sessionApi } from 'api';
import InputField from 'components/form-controls/InputField';
import { showToast } from 'helpers';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

function Home(props) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: yupResolver(
            yup.object({
                host_id: yup
                    .string()
                    .min(5, 'Game PIN is required!')
                    .max(5, 'Game PIN is required!')
                    .required('Game PIN is required!'),
            })
        ),
    });

    const handleSubmit = async (values) => {
        try {
            if (loading) return;
            setLoading(true);

            const host_id = values.host_id.toUpperCase();

            const { success } = await sessionApi.getDetail(host_id);
            if (success) {
                navigate(`/play/${host_id}`);
            } else {
                throw Error();
            }
        } catch (error) {
            showToast({ type: 'error', message: 'Fail to join room!' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-grow flex-col justify-center">
            <div className="flex -translate-y-1/4 flex-col items-center justify-center gap-6">
                <p className="text-center text-5xl md:text-7xl lg:text-8xl font-black text-white">
                    QUIZ IT
                </p>
                <div className="flex w-6 min-w-fit flex-col rounded-xl bg-indigo-800 p-6 text-center">
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <InputField
                            form={form}
                            name="host_id"
                            placeholder="Game PIN"
                            size="lg"
                            className="mb-2"
                            classNames={{
                                input: '!text-center uppercase',
                            }}
                            maxLength={5}
                            showErrorText={false}
                        />
                        <Button
                            variant="filled"
                            size="lg"
                            color="orange"
                            className="min-w-full"
                            type="submit"
                            loading={loading}
                        >
                            GO
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Home;
