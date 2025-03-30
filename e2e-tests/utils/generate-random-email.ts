export default (domain: string = 'example.com'): string => {
    const timestamp = Date.now().toString().slice(-6);
    return `user-${ timestamp }@${ domain }`;
};
