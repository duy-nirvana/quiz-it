import { Loader, Table } from '@mantine/core';
import { resultApi } from 'api';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getParticipantAvatar } from 'utils/avatar';

const fakeList = [
    {
        id: 1,
        name: 'Burr',
        scrore: 698,
    },
    {
        id: 2,
        name: 'Loydie',
        scrore: 988,
    },
    {
        id: 3,
        name: 'Darrell',
        scrore: 351,
    },
    {
        id: 4,
        name: 'Kinny',
        scrore: 239,
    },
    {
        id: 5,
        name: 'Dayna',
        scrore: 993,
    },
    {
        id: 6,
        name: 'Thomasin',
        scrore: 996,
    },
    {
        id: 7,
        name: 'Geno',
        scrore: 729,
    },
    {
        id: 8,
        name: 'Donica',
        scrore: 242,
    },
    {
        id: 9,
        name: 'Alameda',
        scrore: 345,
    },
    {
        id: 10,
        name: 'Dal',
        scrore: 369,
    },
    {
        id: 11,
        name: 'Megan',
        scrore: 300,
    },
    {
        id: 12,
        name: 'Tommi',
        scrore: 504,
    },
    {
        id: 13,
        name: 'James',
        scrore: 255,
    },
    {
        id: 14,
        name: 'Murray',
        scrore: 492,
    },
    {
        id: 15,
        name: 'Wendi',
        scrore: 692,
    },
    {
        id: 16,
        name: 'Burk',
        scrore: 66,
    },
    {
        id: 17,
        name: 'Athena',
        scrore: 141,
    },
    {
        id: 18,
        name: 'Bengt',
        scrore: 133,
    },
    {
        id: 19,
        name: 'Nance',
        scrore: 560,
    },
    {
        id: 20,
        name: 'Kamilah',
        scrore: 875,
    },
    {
        id: 21,
        name: 'Ritchie',
        scrore: 471,
    },
    {
        id: 22,
        name: 'Sterne',
        scrore: 322,
    },
    {
        id: 23,
        name: 'Mile',
        scrore: 708,
    },
    {
        id: 24,
        name: 'Tobiah',
        scrore: 611,
    },
    {
        id: 25,
        name: 'Adrienne',
        scrore: 607,
    },
    {
        id: 26,
        name: 'Annnora',
        scrore: 205,
    },
    {
        id: 27,
        name: 'Jonah',
        scrore: 939,
    },
    {
        id: 28,
        name: 'Aldric',
        scrore: 123,
    },
    {
        id: 29,
        name: 'Devy',
        scrore: 590,
    },
    {
        id: 30,
        name: 'Tadeo',
        scrore: 248,
    },
    {
        id: 31,
        name: 'Miguelita',
        scrore: 934,
    },
    {
        id: 32,
        name: 'Kylie',
        scrore: 670,
    },
    {
        id: 33,
        name: 'Boy',
        scrore: 529,
    },
    {
        id: 34,
        name: 'Buck',
        scrore: 719,
    },
    {
        id: 35,
        name: 'Sansone',
        scrore: 459,
    },
    {
        id: 36,
        name: 'Lavinia',
        scrore: 530,
    },
    {
        id: 37,
        name: 'Cash',
        scrore: 353,
    },
    {
        id: 38,
        name: 'Karoly',
        scrore: 639,
    },
    {
        id: 39,
        name: 'Kally',
        scrore: 885,
    },
    {
        id: 40,
        name: 'Quentin',
        scrore: 121,
    },
    {
        id: 41,
        name: 'Fredra',
        scrore: 667,
    },
    {
        id: 42,
        name: 'Reiko',
        scrore: 724,
    },
    {
        id: 43,
        name: 'Mendy',
        scrore: 577,
    },
    {
        id: 44,
        name: 'Adella',
        scrore: 302,
    },
    {
        id: 45,
        name: 'Waylen',
        scrore: 477,
    },
    {
        id: 46,
        name: 'Pauli',
        scrore: 850,
    },
    {
        id: 47,
        name: 'Cody',
        scrore: 37,
    },
    {
        id: 48,
        name: 'Tildi',
        scrore: 408,
    },
    {
        id: 49,
        name: 'Morgana',
        scrore: 620,
    },
    {
        id: 50,
        name: 'Margarita',
        scrore: 67,
    },
];

function Detail(props) {
    const { id: hostId } = useParams();
    const location = useLocation();

    const [detail, setDetail] = useState();
    const [loading, setLoading] = useState(false);

    const participants = useMemo(() => {
        return Object.values(
            detail?.scored_participants?.reduce((acc, cur) => {
                if (acc[cur.socket_id]) {
                    acc[cur.socket_id] = {
                        ...acc[cur.socket_id],
                        score: acc[cur.socket_id].score + cur.score,
                    };

                    return acc;
                } else {
                    acc[cur.socket_id] = {
                        id: cur.socket_id,
                        avatar: cur.avatar || null,
                        name: cur.name || '',
                        user: cur.user || null,
                        score: cur.score || 0,
                    };

                    return acc;
                }
            }, {}) || {}
        ).sort((a, b) => b.score - a.score);
    }, [detail]);

    useEffect(() => {
        if (location.state) {
            setDetail(location.state);
        } else {
            getDetail();
        }
    }, [hostId]);

    const getDetail = async () => {
        try {
            setLoading(true);
            const { data, success } = await resultApi.getDetail(hostId);

            if (success) {
                setDetail(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    };

    console.log({ participants });
    console.log({ detail });
    console.log({ location });
    // console.log('values participants: ', Object.values(participants || {}));

    if (loading)
        return (
            <div className="flex flex-col max-h-[calc(100vh-92px)] items-center justify-center flex-1">
                <Loader size={40} color="white" />
            </div>
        );

    return (
        <div className="flex max-h-[calc(100vh-92px)] flex-1 flex-col items-center overflow-hidden">
            <div className="flex h-full w-full max-w-[1000px] flex-1 flex-col overflow-y-hidden lg:w-3/4">
                <p className="mb-4 text-center text-4xl font-bold text-white">
                    {detail?.title ?? ''}
                </p>
                <div className="flex min-h-0 flex-1 flex-col gap-4">
                    <div className="left-section flex h-fit basis-1/2 justify-center gap-8 rounded-lg bg-slate-700/50 p-4 pb-0">
                        {participants.length >= 2 && (
                            <div className="relative mt-6 flex flex-col items-center gap-1">
                                <img
                                    src={getParticipantAvatar({
                                        ...participants[1].avatar,
                                        size: 90,
                                        backgroundColor: ['transparent'],
                                    })}
                                />
                                <div className="flex h-full flex-col items-center rounded-t-lg bg-slate-500 p-2 md:pb-6">
                                    <img
                                        src="/icon/silver-medal.svg"
                                        className="bottom-0 w-12"
                                    />
                                    <p className="text-xl font-semibold text-white">
                                        {participants[1].name}
                                    </p>
                                    <p className="text-md font-light italic text-white">
                                        <span className="">score:</span>{' '}
                                        {participants[1].score.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        )}
                        {participants.length >= 1 && (
                            <div className="relative flex flex-col items-center gap-1">
                                <img
                                    src={getParticipantAvatar({
                                        ...participants[0].avatar,
                                        size: 90,
                                        backgroundColor: ['transparent'],
                                    })}
                                />
                                <div className="flex h-full flex-col items-center rounded-t-lg bg-slate-500 p-2 md:pb-6">
                                    <img
                                        src="/icon/gold-medal.svg"
                                        className="bottom-0 w-12"
                                    />
                                    <p className="text-xl font-semibold text-white">
                                        {participants[0].name}
                                    </p>
                                    <p className="text-md font-light italic text-white">
                                        <span className="">score:</span>{' '}
                                        {participants[0].score.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        )}
                        {participants.length >= 3 && (
                            <div className="relative mt-12 flex flex-col items-center gap-1">
                                <img
                                    src={getParticipantAvatar({
                                        ...participants[2].avatar,
                                        size: 90,
                                        backgroundColor: ['transparent'],
                                    })}
                                />
                                <div className="flex h-full flex-col items-center rounded-t-lg bg-slate-500 p-2 md:pb-6">
                                    <img
                                        src="/icon/bronze-medal.svg"
                                        className="bottom-0 w-12"
                                    />
                                    <p className="text-xl font-semibold text-white">
                                        {participants[2].name}
                                    </p>
                                    <p className="text-md font-light italic text-white">
                                        <span className="">score:</span>{' '}
                                        {participants[2].score.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="right-section relative max-h-fit flex-auto basis-1/2 overflow-y-auto rounded-lg bg-slate-700/50">
                        <table className="w-full text-white">
                            <thead>
                                <tr className="text-xl font-bold">
                                    <th className="sticky top-0 w-[5%] rounded-l-md bg-slate-500 px-5 py-4 text-left">
                                        Rank
                                    </th>
                                    <th className="sticky top-0 w-[65%] bg-slate-500 px-5 py-4 text-white">
                                        Name
                                    </th>
                                    <th className="sticky top-0 w-[30%] rounded-r-md bg-slate-500 px-5 py-4 text-right text-white">
                                        Score
                                    </th>
                                </tr>
                            </thead>
                            {participants.length > 3 ? (
                                <tbody>
                                    {participants
                                        .slice(3, participants.length)
                                        .map((participant, index) => {
                                            let startRank = 4;
                                            return (
                                                <tr className="border-b border-b-slate-700 text-lg last:border-none">
                                                    <td className="px-5 py-3">
                                                        {startRank + index}
                                                    </td>
                                                    <td className="px-5 py-3 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <img
                                                                src={getParticipantAvatar(
                                                                    {
                                                                        ...participants[
                                                                            startRank +
                                                                                index -
                                                                                1
                                                                        ]
                                                                            .avatar,
                                                                        size: 60,
                                                                        backgroundColor:
                                                                            [
                                                                                'transparent',
                                                                            ],
                                                                    }
                                                                )}
                                                            />
                                                            <p>
                                                                {
                                                                    participant.name
                                                                }
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3 text-right">
                                                        {participant.score}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            ) : (
                                <div className="flex items-center justify-center py-4">
                                    <p>No data</p>
                                </div>
                            )}
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Detail;
