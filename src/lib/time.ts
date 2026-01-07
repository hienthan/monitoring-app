export const nowSeconds = () => Math.floor(Date.now() / 1000);

export const minutesAgo = (mins: number) => Date.now() - mins * 60 * 1000;
