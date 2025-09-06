import { prisma } from "config/client";
import { TOTAL_ITEMS_PER_PAGE } from "config/constant";

const getAllUsers = async (page: number) => {
    const pageSize = TOTAL_ITEMS_PER_PAGE;
    const skip = (page - 1) * pageSize;
    const users = await prisma.user.findMany({
        skip: skip,
        take: pageSize
    });
    return users;
}

const countTotalUserPages = async () => {
    const pageSize = TOTAL_ITEMS_PER_PAGE;
    const totalItems = await prisma.user.count();

    const totalPages = Math.ceil(totalItems / pageSize);
    return totalPages;
}

export { getAllUsers, countTotalUserPages }