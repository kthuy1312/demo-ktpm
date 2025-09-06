
import { prisma } from 'config/client'
import { Response, Request } from 'express'
import { createUser, deleteUser, getAllUser, getUserById, updateUser } from 'services/user-service'

//display pages


const getCreateUserPage = (req: Request, res: Response) => {
    res.render("admin/user/createUser.ejs")
}


//user
const postDeleteUser = async (req: Request, res: Response) => {
    const id = req.params.id
    await deleteUser(id)
    res.redirect("/admin/userPage")
}
const postCreateUser = async (req: Request, res: Response) => {
    const { email, name, password, phone, address, role } = req.body
    await createUser(email, name, password, phone, address, role)
    res.redirect("/admin/userPage")
}

const getViewUserPage = async (req: Request, res: Response) => {
    const id = req.params.id
    const user = await getUserById(id)
    res.render("admin/user/detailUser.ejs", { user: user })
}
const postUpdateUser = async (req: Request, res: Response) => {
    const { id, email, name, phone, address, role } = req.body
    await updateUser(id, email, name, phone, address, role)
    res.redirect("/admin/userPage")
}



export {
    postDeleteUser, postCreateUser, getCreateUserPage, getViewUserPage, postUpdateUser
}