import React from 'react';
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
    return (
        <div className="flex flex-1 flex-col items-center">
            <div className="flex w-full max-w-[1200px] flex-1 flex-col md:w-3/4">
                <p className="mb-4 text-center text-4xl font-bold text-white">
                    {'{QUIZ TITLE}'}
                </p>
                <div className="flex flex-1 flex-col gap-4 md:flex-row">
                    <div className="left-section flex h-fit basis-1/2 justify-center gap-8 rounded-lg bg-slate-700/50 p-4">
                        <div className="relative flex flex-col items-center gap-1">
                            <img
                                src="/icon/gold-medal.svg"
                                className="bottom-0 w-12"
                            />
                            <img
                                src={getParticipantAvatar({
                                    // ...participant.avatar,
                                    size: 90,
                                    backgroundColor: ['transparent'],
                                })}
                            />
                            <p className="text-xl font-semibold text-white">
                                Duy Tran
                            </p>
                            <p className="text-md font-light italic text-white">
                                <span className="">score:</span> 100
                            </p>
                        </div>
                        <div className="relative flex flex-col items-center gap-1 md:mt-16">
                            <img
                                src="/icon/silver-medal.svg"
                                className="bottom-0 w-12"
                            />
                            <img
                                src={getParticipantAvatar({
                                    // ...participant.avatar,
                                    size: 90,
                                    backgroundColor: ['transparent'],
                                })}
                            />
                            <p className="text-xl font-semibold text-white">
                                Duy Tran 2
                            </p>
                        </div>
                        <div className="relative flex flex-col items-center gap-1 md:mt-32">
                            <img
                                src="/icon/bronze-medal.svg"
                                className="bottom-0 w-12"
                            />
                            <img
                                src={getParticipantAvatar({
                                    // ...participant.avatar,
                                    size: 90,
                                    backgroundColor: ['transparent'],
                                })}
                            />
                            <p className="text-xl font-semibold text-white">
                                Duy Tran 3
                            </p>
                        </div>
                    </div>
                    <div className="right-section min-h-0 flex-auto basis-1/2 rounded-lg bg-slate-700/50 p-4">
                        <div className="max-h-full overflow-y-auto">
                            {fakeList.map((participant) => (
                                <div className="mb-2 bg-pink-200 last:mb-0">
                                    {participant.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Detail;
