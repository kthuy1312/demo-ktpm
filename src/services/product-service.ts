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
        },
        include: {
            category: {
                select: {
                    name: true,
                },
            },
            variants: true
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

const getProductInCart = async (id: number) => {
    const cart = await prisma.cart.findUnique({ where: { user_id: id } })
    if (cart) {
        return await prisma.cartItem.findMany({
            where: {
                cart_id: cart.id
            },
            include: {
                variant: true
            }
        })
    }

    return [];

};

//delete product
const handleDeleteProductInCart = async (cartItemId: string, sumCart: number, userId: number) => {

    //lấy quantity để trừ đi 
    const currentCartItem = await prisma.cartItem.findUnique({ where: { item_id: +cartItemId } })
    if (!currentCartItem) throw new Error("Không tìm thấy sản phẩm bạn muốn xóa trong giỏ hàng");

    const quantity = currentCartItem.quantity

    // lấy cart hiện tại theo userId
    const cart = await prisma.cart.findUnique({
        where: { user_id: userId }
    });
    if (!cart) throw new Error("Giỏ hàng không tồn tại");


    // xóa cart item
    await prisma.cartItem.delete({
        where: { item_id: +cartItemId }
    })

    //xóa cart 
    if (sumCart === 1) {
        //delete cart
        await prisma.cart.delete({ where: { id: cart.id } })
    } else {
        //update sum cart
        await prisma.cart.update({
            where: { user_id: userId },
            data: {
                sum: {
                    decrement: quantity
                }
            }
        })
    }

};


//update cart before checkout
const updateCartDetailBeforeCheckout = async (
    cartId: string,
    cartDetails: { item_id: string, quantity: string }[]
) => {

    //ktra giỏ hàng có tồn tại kh
    const cart = await prisma.cart.findUnique({ where: { id: +cartId } })
    if (!cart) {
        throw new Error("Giỏ hàng không tồn tại");
    }

    //get sum 
    let sum = 0

    //update quantity each product in cart
    for (let i = 0; i < cartDetails.length; i++) {
        const itemId = +cartDetails[i].item_id;
        const quantity = +cartDetails[i].quantity;

        // kiểm tra cartItem có thuộc về giỏ hàng này không
        const cartItem = await prisma.cartItem.findUnique({
            where: { item_id: itemId },
        });

        if (!cartItem || cartItem.cart_id !== +cartId) {
            throw new Error(`Sản phẩm với item_id=${itemId} không có trong giỏ hàng`);
        }

        //tính sum
        sum += quantity;

        await prisma.cartItem.update({
            where: { item_id: itemId },
            data: { quantity },
        });
    }

    //update sum cart
    await prisma.cart.update({
        where: {
            id: +cartId
        },
        data: {
            sum: sum
        }
    })
};

//place order
const handlePlaceOrder = async (
    userId: number,
    receiverName: string,
    receiverAddress: string,
    receiverPhone: string,
    totalAmount: number
) => {
    try {
        //tạo transaction
        await prisma.$transaction(async (tx) => {
            const cart = await tx.cart.findUnique({
                where: {
                    user_id: userId
                },
                include: {
                    items: true
                }
            })

            if (!cart) {
                throw new Error("Giỏ hàng không tồn tại");
            }


            if (cart.items.length === 0) {
                throw new Error("Giỏ hàng trống, không thể đặt hàng");
            }



            //create order + orderItems
            const dataOrderItem = cart?.items?.map(
                item => ({
                    variant_id: item.variant_id,
                    quantity: item.quantity,
                    price: item.price
                })
            )
            await tx.order.create({
                data: {
                    user_id: userId,
                    total_amount: totalAmount,
                    status: "PENDING",
                    paymentMethod: "COD",
                    paymentStatus: "PAYMENT_UNPAID",
                    receiverName,
                    receiverAddress,
                    receiverPhone,
                    items: {
                        create: dataOrderItem
                    }

                }
            })

            //delete cart + cartItems
            await tx.cartItem.deleteMany({
                where: {
                    cart_id: cart.id
                }
            })
            await tx.cart.delete({
                where: {
                    id: cart.id
                }
            })

            //check variant
            for (let i = 0; i < cart.items.length; i++) {
                const variantId = cart.items[i].variant_id
                const variant = await tx.productVariant.findUnique(
                    {
                        where: {
                            id: variantId
                        }
                        , include: {
                            product: true
                        }
                    })


                if (!variant || variant.stock < cart.items[i].quantity) {
                    throw new Error(`Sản phẩm ${variant?.product.name} màu ${variant?.color} không tồn tại hoặc không đủ số lượng.`)
                }

                //đủ spham thì trừ stock
                await tx.productVariant.update({
                    where: {
                        id: variantId
                    },
                    data: {
                        stock: {
                            decrement: cart.items[i].quantity
                        },
                        sold: {
                            increment: cart.items[i].quantity
                        }
                    }
                })

            }


        }
        )
        return "";
    }
    catch (error: any) {
        return error.message
    }
};

//order history
const listOrdersByUserId = async (userId: number) => {
    try {
        const orders = await prisma.order.findMany({
            where: {
                user_id: userId
            },
            include: {
                items: true
            }
        });
        if (!orders || orders.length === 0) {
            return []
        }
        return orders;
    } catch (error: any) {
        throw new Error("Có lỗi xảy ra khi lấy lịch sử đặt hàng");
    }
};


// review
const handlePostReview = async (userId: number, productId: number, rating: number, comment: string) => {
    try {
        return await prisma.review.create({
            data: {
                user_id: userId,
                product_id: productId,
                rating,
                comment
            }
        })
    }

    catch (error: any) {
        throw new Error("Có lỗi xảy ra khi viết phản hồi");
    }
};



export {
    getAllCategory, handleDeleteProduct, getProductById,
    countTotalProductClientPages, fetchProductsPaginated, fetchAllProducts, addProductToCart, getProductInCart
    , handleDeleteProductInCart, updateCartDetailBeforeCheckout, handlePlaceOrder, listOrdersByUserId, handlePostReview
}