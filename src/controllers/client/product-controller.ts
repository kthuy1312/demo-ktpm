
import { prisma } from 'config/client'
import { Response, Request } from 'express'
import { addProductToCart, countTotalProductClientPages, fetchAllProducts, fetchProductsPaginated, getAllCategory, getProductById, getProductInCart } from 'services/product-service';
import { success } from 'zod';


const getProductsPaginate = async (req: Request, res: Response) => {
    const { page, pageSize } = req.query
    let currentPage = page ? +page : 1
    if (currentPage <= 0) currentPage = 1;
    const totalPages = await countTotalProductClientPages(+pageSize);
    try {
        const products = await fetchProductsPaginated(+page, +pageSize);
        res.status(200).json({
            message: "Lấy danh sách sản phẩm thành công",
            data: products,
            meta: {
                totalPages,
            }
        });
    } catch (err: any) {
        res.status(500).json({
            message: "Đã xảy ra lỗi khi lấy sản phẩm",
            error: err.message,
        });
    }
}
const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await fetchAllProducts();
        res.status(200).json({
            message: "Lấy danh sách sản phẩm thành công",
            data: products,
        });
    } catch (err: any) {
        res.status(500).json({
            message: "Đã xảy ra lỗi khi lấy sản phẩm",
            error: err.message,
        });
    }
}

const getDetailProduct = async (req: Request, res: Response) => {
    const id = req.params.id
    try {
        const product = await getProductById(id)
        res.status(200).json({
            message: "Lấy thông tin sản phẩm thành công",
            data: product,
        });
    } catch (err: any) {
        res.status(500).json({
            message: "Đã xảy ra lỗi khi lấy thông tin sản phẩm",
            error: err.message,
        });
    }
}

const getCategory = async (req: Request, res: Response) => {
    try {
        const categories = await getAllCategory()
        res.status(200).json({
            message: "Lấy danh mục sản phẩm thành công",
            data: categories,
        });
    } catch (err: any) {
        res.status(500).json({
            message: "Đã xảy ra lỗi khi lấy danh mục sản phẩm",
            error: err.message,
        });
    }
}


// -------------------- ADD PRODUCT TO CART -------------------------------

const postAddProductToCart = async (req: Request, res: Response) => {
    const id_variant = req.params.id;
    const user = req.user;
    try {

        await addProductToCart(1, +id_variant, user);


        res.status(201).json({
            success: true,
            message: "Thêm sản phẩm vào giỏ hàng thành công",
        });
    }
    catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra khi thêm sản phẩm",
            error,
        });

    }

}

// -------------------- GET CART -------------------------------

const getCart = async (req: Request, res: Response) => {
    // trả về tất cả sản phẩm trong giỏ hàng , totalPrice,
    // trả về luôn cardId cho các bước 
    const user = req.user;
    try {
        const cartDetails = await getProductInCart(+user.id);
        const totalPrice = cartDetails?.map(item => (item.quantity * +item.price))
            ?.reduce((a, b) => a + b, 0); // tính tổng
        const cartId = cartDetails.length ? cartDetails[0].cart_id : 0
        res.status(200).json({
            success: true,
            cart_detail: cartDetails,
            totalPrice,
            cartId
        });
    }
    catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra khi lấy thông tin giỏ hàng",
            error,
        });

    }

}


export {
    getProductsPaginate, getDetailProduct, getCategory, getAllProducts, postAddProductToCart, getCart
}