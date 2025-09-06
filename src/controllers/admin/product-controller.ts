
import { prisma } from 'config/client'
import { Response, Request } from 'express'
import { getAllCategory, handleCreateProduct, handleDeleteProduct, handleUpdateProduct } from 'services/admin/product.service'

const getCreateProductPage = async (req: Request, res: Response) => {
    const categories = await getAllCategory()
    res.render("admin/product/createProduct.ejs", { categories })
}

const postCreateProduct = async (req: Request, res: Response) => {

    const { name, basePrice, description, category_id } = req.body
    const file = req.file
    const productImg = file?.filename ?? undefined //lấy ra tên ảnh

    // Lấy variants từ form
    const colors = req.body.color || []
    const storages = req.body.storage || []
    const prices = req.body.price || []
    const stocks = req.body.stock || []


    // Gom thành array object
    const variants = []
    for (let i = 0; i < colors.length; i++) {
        variants.push({
            color: colors[i],
            storage: storages[i],
            price: Number(prices[i]),
            stock: Number(stocks[i])
        })
    }


    await handleCreateProduct(
        name, basePrice, description, category_id, productImg,
        variants
    )
    res.redirect("/admin/productPage")
}

const postDeleteProduct = async (req: Request, res: Response) => {
    const id = req.params.id
    await handleDeleteProduct(id)
    res.redirect("/admin/productPage")
}


const getViewProductPage = async (req: Request, res: Response) => {

    const id = req.params.id
    const product = await prisma.product.findUnique({
        where: { id: +id },
        include: {
            category: true,
            variants: true // 👈 phải include mới có dữ liệu để render
        }
    }); const categories = await getAllCategory()
    res.render("admin/product/detailProduct.ejs", { product, categories })
}

const postUpdateProduct = async (req: Request, res: Response) => {
    const { id, name, basePrice, description, category_id } = req.body
    const file = req.file
    const productImg = file?.filename ?? undefined //lấy ra tên ảnh

    // Lấy variants từ form
    const colors = req.body.color || []
    const storages = req.body.storage || []
    const prices = req.body.price || []
    const stocks = req.body.stock || []


    // Gom thành array object
    const variants = []
    for (let i = 0; i < colors.length; i++) {
        variants.push({
            color: colors[i],
            storage: storages[i],
            price: Number(prices[i]),
            stock: Number(stocks[i])
        })
    }
    await handleUpdateProduct(
        id, name, basePrice, description, category_id, productImg,
        variants)
    res.redirect("/admin/productPage")
}


export {
    getCreateProductPage, postDeleteProduct,
    getViewProductPage, postCreateProduct, postUpdateProduct
}