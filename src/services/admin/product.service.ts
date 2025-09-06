import { Category } from "@prisma/client";
import { prisma } from "config/client";
import { TOTAL_ITEMS_PER_PAGE } from "config/constant";



const getAllProduct = async (page: number = 1, pageSize: number = 50) => {
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


const getAllCategory = async () => {
    return await prisma.category.findMany()
};


const handleCreateProduct = async (
    name: string,
    basePrice: string,
    description: string,
    category_id: string, // kiểu là number
    productImg: string,
    variants: {
        color: string;
        storage?: string;
        price: number;
        stock: number;
    }[]
) => {
    return await prisma.product.create({
        data: {
            name: name,
            basePrice: +basePrice,
            description: description,
            image: productImg,
            category: {
                connect: {
                    category_id: +category_id,
                },
            },
            variants: {
                create: variants.map((v) => ({
                    color: v.color,
                    storage: v.storage,
                    price: v.price,
                    stock: v.stock,
                })),
            },
        },
        include: { variants: true },
    });

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

const handleUpdateProduct = async (
    id: string,
    name: string,
    basePrice: string,
    description: string,
    category_id: string, // kiểu là number
    productImg: string,
    variants: {
        color: string;
        storage?: string;
        price: number;
        stock: number;
    }[]
) => {
    return await prisma.product.update({
        where: {
            id: +id
        },
        data: {
            name: name,
            basePrice: +basePrice,
            description: description,
            image: productImg,
            category: {
                connect: {
                    category_id: +category_id,
                },
            },
            variants: {
                create: variants.map((v) => ({
                    color: v.color,
                    storage: v.storage,
                    price: v.price,
                    stock: v.stock,
                })),
            },
        },
        include: { variants: true },
    });
};

//phân trang
//tính số trang cần hiện ra 

const countTotalProductPages = async () => {
    const pageSize = TOTAL_ITEMS_PER_PAGE;
    const totalItems = await prisma.product.count();

    const totalPages = Math.ceil(totalItems / pageSize);
    return totalPages;
}

const getProductList = async (page: number) => {
    const pageSize = TOTAL_ITEMS_PER_PAGE;
    const skip = (page - 1) * pageSize;
    return await prisma.product.findMany({
        skip: skip,
        take: pageSize,
        include: {
            category: {
                select: {
                    name: true,
                },
            },
        },
    });
}

export {
    getAllProduct, getAllCategory, handleDeleteProduct, getProductById,
    handleCreateProduct, handleUpdateProduct, getProductList, countTotalProductPages
}