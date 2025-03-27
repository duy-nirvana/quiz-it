export * from '../utils/toast';

export const generateTimeOptions = (gap = 5, max = 60) => {
    let options = [];

    for (let i = 1; i <= max / gap; i++) {
        options.push({
            value: `${gap * i}`,
            label: `${gap * i} seconds`,
        })
    }

    return options;
};
