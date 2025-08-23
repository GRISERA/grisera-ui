import { randomUUID } from 'crypto';

export default (domain: string = 'example.com'): string => {
    const uniqueId = randomUUID().slice(0, 8);
    return `user-${ uniqueId }@${ domain }`;
};
