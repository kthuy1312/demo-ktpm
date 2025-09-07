
import { loginWithJWT } from 'controllers/client/auth-controller'
import { getProductsPaginate, getCategory, getDetailProduct, getAllProducts, postAddProductToCart, getCart, } from 'controllers/client/product-controller'
import express, { Express } from 'express'
import passport from 'passport'
import { verifyToken } from 'src/middleware/verifyToken'

// import fileUploadMiddleware from 'src/middleware/multer'
const router = express.Router()

const api = (app: Express) => {

    //product
    router.get("/product", getProductsPaginate)
    router.get("/products", getAllProducts)
    router.get("/product/:id", getDetailProduct)
    router.get("/category", getCategory)

    //
    router.post("/add-product/:id", verifyToken, postAddProductToCart)
    router.get("/cart", verifyToken, getCart)



    app.use("/api", router)
}

export default api
