import { compare, hash } from 'bcryptjs' 


export const hashPassword = async (password: string) => {
    const saltRounds = 10;
    const hashPassword = await hash(password, saltRounds);
    return hashPassword;
}

export const verifyPassword = async (password: string, hashPassword: string) => {
    const match = await compare(password, hashPassword);
    return match;
}