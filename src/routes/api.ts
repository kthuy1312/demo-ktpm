
import { loginWithJWT } from 'controllers/client/auth-controller'
import { getProductsPaginate, getCategory, getDetailProduct, getAllProducts, postAddProductToCart, getCart, deleteProductInCart, postHandleCartToCheckOut, getCheckOutPage, postPlaceOrder, postAddToCartFromDetailPage, getOrderHistory, postReview, getReview, } from 'controllers/client/product-controller'
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

    //cart
    router.post("/add-product/:id", verifyToken, postAddProductToCart)
    router.get("/cart", verifyToken, getCart)
    router.delete("/delete-product/:id", verifyToken, deleteProductInCart)
    router.post("/add-to-cart-from-detail-page/:id", verifyToken, postAddToCartFromDetailPage)

    //checkout
    router.post("/handle-cart-to-checkout", verifyToken, postHandleCartToCheckOut); //cập nhật giỏ hàng trước khi checkout
    router.get("/checkout", verifyToken, getCheckOutPage); //lấy thông tin giỏ hàng của user chuẩn bị thanh toán
    router.post("/place-order", verifyToken, postPlaceOrder); // thực hiện đặt hàng

    //order
    router.get("/order-history", verifyToken, getOrderHistory);

    //review
    router.post("/review", verifyToken, postReview);
    router.get("/review/:id", getReview);



    app.use("/api", router)
}

export default api
