import { prisma } from "config/client"
import bcrypt from 'bcrypt';
import { Role } from "@prisma/client";
const saltRounds = 10;

//hash pwd
const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, saltRounds)
}
const comparePassword = async (password: string, hashPassword: string) => {
    return await bcrypt.compare(password, hashPassword)
}

//user
const getAllUser = async () => {
    return await prisma.user.findMany()
}
const deleteUser = async (id: string) => {
    return await prisma.user.delete({
        where: {
            id: +id
        }
    })
}


const createUser = async (email: string, name: string, password: string, phone: string, address: string, role: Role) => {
    const pwd = await hashPassword(password)
    return await prisma.user.create({
        data: {
            email: email,
            name: name,
            password: pwd,
            phone: phone,
            address: address,
            role: role
        }
    })

}
const updateUser = async (id: string, email: string, name: string, phone: string, address: string, role: Role) => {

    return await prisma.user.update({
        where: {
            id: +id
        },
        data: {
            email: email,
            name: name,
            phone: phone,
            address: address,
            role: role
        }
    })

}

const getUserById = async (id: string) => {

    return await prisma.user.findUnique({
        where: {
            id: +id
        }
    })

}

export { getAllUser, hashPassword, comparePassword, deleteUser, createUser, getUserById, updateUser }