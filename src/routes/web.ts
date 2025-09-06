
import { getAdminOrderPage, getAdminProductPage, getAdminUserPage, getDashboardPage } from 'controllers/admin/dashboard-controller'
import { getCreateProductPage, getViewProductPage, postCreateProduct, postDeleteProduct, postUpdateProduct } from 'controllers/admin/product-controller'
import { getCreateUserPage, getViewUserPage, postCreateUser, postDeleteUser, postUpdateUser } from 'controllers/admin/user-controller'
import express, { Express } from 'express'
import fileUploadMiddleware from 'src/middleware/multer'

const router = express.Router()

const webRoutes = (app: Express) => {

    //display 
    router.get("/admin", getDashboardPage)
    router.get("/admin/userPage", getAdminUserPage)
    router.get("/admin/productPage", getAdminProductPage)
    router.get("/admin/orderPage", getAdminOrderPage)



    //user    
    router.get("/admin/creatUser", getCreateUserPage)
    router.post("/admin/delete-user/:id", postDeleteUser)
    router.post("/admin/create-user", postCreateUser)
    router.get("/admin/view-user/:id", getViewUserPage)
    router.post("/admin/update-user", postUpdateUser)


    //product
    router.get("/admin/creatProduct", getCreateProductPage)
    router.post("/admin/create-product", fileUploadMiddleware("productImg"), postCreateProduct)
    router.post("/admin/delete-product/:id", postDeleteProduct)
    router.get("/admin/view-product/:id", getViewProductPage)
    router.post("/admin/update-product", fileUploadMiddleware("productImg"), postUpdateProduct)


    app.use("/", router)
}

export default webRoutes
