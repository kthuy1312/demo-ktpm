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



export {
    getAllCategory, handleDeleteProduct, getProductById,
    countTotalProductClientPages, fetchProductsPaginated, fetchAllProducts
}