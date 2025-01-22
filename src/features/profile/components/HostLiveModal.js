import { Badge, Modal, SegmentedControl, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import InputField from 'components/form-controls/InputField';

function HostLiveModal({ children, quiz, form }, ref) {
    const [opened, { open, close }] = useDisclosure(false);

    console.log({ quiz });

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                title={<p className="text-bold text-xl">{quiz.title}</p>}
                centered
            >
                <div className="grid grid-cols-1 gap-3">
                    <Badge className="border border-slate-400" color="gray">
                        {quiz?.questions?.length} Questions
                    </Badge>
                    {/* <div>
                        <label htmlFor="access_code">
                            Access code <span className='italic text-sm font-light'>*(not required)</span>
                        </label>
                        <InputField
                            form={form}
                            name="access_code"
                            id="access_code"
                            label="Access code(not required)"
                            placeholder="JQKA2"
                        />
                    </div> */}
                    <Text size="sm" >
                        Total participants
                    </Text>
                    <SegmentedControl
                        data={[
                            {
                                value: '9999',
                                label: 'Unlimited',
                            },
                            {
                                value: 'export',
                                label: 'Export',
                            },
                        ]}
                    />
                </div>
            </Modal>
            <div onClick={open}>{children}</div>
        </>
    );
}

export default HostLiveModal;
