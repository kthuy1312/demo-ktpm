
import { prisma } from 'config/client'
import { Response, Request } from 'express'
import { countTotalProductClientPages, fetchAllProducts, fetchProductsPaginated, getAllCategory, getProductById } from 'services/product-service';


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



export {
    getProductsPaginate, getDetailProduct, getCategory, getAllProducts
}