import { Category } from "@prisma/client";
import { prisma } from "config/client";
import { TOTAL_ITEMS_PER_PAGE } from "config/constant";



const fetchProductsPaginated = async (page: number = 1, pageSize: number = 50) => {
    return await prisma.product.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
            category: {
                select: {
                    name: true,
                },
            },
        },
    });
};
const fetchAllProducts = async (page: number = 1, pageSize: number = 50) => {
    return await prisma.product.findMany({
        include: {
            category: {
                select: {
                    name: true,
                },
            },
        },
    });
};




const getAllCategory = async () => {
    return await prisma.category.findMany()
};



const handleDeleteProduct = async (id: string) => {
    return await prisma.product.delete({
        where: {
            id: +id
        },
    })
};
const getProductById = async (id: string) => {
    return await prisma.product.findUnique({
        where: {
            id: +id
        }
    })
};


//phân trang
//tính số trang cần hiện ra 
const countTotalProductClientPages = async (pageSize: number) => {
    const totalItems = await prisma.product.count()
    const totalPages = Math.ceil(totalItems / pageSize);
    return totalPages
};

//add product
const addProductToCart = async (quantity: number, id_variant: number, user: Express.User) => {
    const cart = await prisma.cart.findUnique({ where: { user_id: user.id } })

    const variant = await prisma.productVariant.findUnique({ where: { id: id_variant } })


    //    nếu đã có giỏ hàng
    //      -> cập nhật giỏ hàng
    //      -> cập nhật chi tiết giỏ hàng -> nếu chưa có, tạo mới.có rồi, cập nhật quantity -> update + insert

    if (cart) {
        await prisma.cart.update({
            where: { id: cart.id },
            data: {
                sum: {
                    increment: quantity,
                }
            }
        })

        const currentCartItem = await prisma.cartItem.findFirst({
            where: {
                cart_id: cart.id,
                variant_id: id_variant
            }
        })

        await prisma.cartItem.upsert({
            where: {
                item_id: currentCartItem?.item_id ?? 0
            },
            update: {
                quantity: {
                    increment: quantity
                }
            },
            create: {
                price: variant.price,
                quantity: quantity,
                variant_id: id_variant,
                cart_id: cart.id
            }
        })
    }
    else {
        // nếu chưa có giỏ hàng
        //    -> tạo mới giỏ hàng
        //    -> tạo mới chi tiết giỏ hàng

        await prisma.cart.create({
            data: {
                user_id: user.id,
                sum: quantity,
                items: {
                    create: [
                        {
                            variant_id: variant.id,
                            price: variant.price,
                            quantity: quantity
                        }
                    ]
                }
            },

        })
    }
}




export {
    getAllCategory, handleDeleteProduct, getProductById,
    countTotalProductClientPages, fetchProductsPaginated, fetchAllProducts, addProductToCart, getProductInCart
}