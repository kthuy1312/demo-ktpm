import { prisma } from "config/client"
import { hashPassword } from "services/user-service";

const initDatabase = async () => {

    const countUser = await prisma.user.count();
    const countCategory = await prisma.category.count();
    const countProduct = await prisma.product.count();

    if (countUser === 0) {
        const pwd = await hashPassword("123456")
        await prisma.user.createMany(
            {
                data: [
                    {
                        name: "admin",
                        password: pwd,
                        email: "admin@gmail.com",
                        role: "admin"
                    },
                    {
                        name: "test1",
                        password: pwd,
                        email: "test1@gmail.com"
                    },
                    {
                        name: "test2",
                        password: pwd,
                        email: "test2@gmail.com"

                    },
                    {
                        name: "test3",
                        password: pwd,
                        email: "test3@gmail.com"
                    }
                ]
            }
        )
    }
    if (countCategory === 0) {

        await prisma.category.createMany(
            {
                data: [
                    {
                        name: "MAC",

                    },
                    {
                        name: "IPHONE",

                    },
                    {
                        name: "IPAD",


                    },
                    {
                        name: "AIRPODS",
                    }
                ]
            }
        )
    }
    if (countProduct === 0) {
        const mac = await prisma.category.findFirst({ where: { name: "MAC" } });
        const iphone = await prisma.category.findFirst({ where: { name: "IPHONE" } });
        const ipad = await prisma.category.findFirst({ where: { name: "IPAD" } });
        const airpods = await prisma.category.findFirst({ where: { name: "AIRPODS" } });

        const productsData = [
            {
                name: "MacBook Air 2020",
                description: "MacBook Air 2020 với thiết kế mỏng nhẹ, hiệu năng mạnh mẽ nhờ chip Intel thế hệ 10, màn hình Retina sắc nét, bàn phím Magic Keyboard cải tiến và thời lượng pin lên đến 12 giờ. Hoàn hảo cho công việc văn phòng, học tập và giải trí di động.",
                basePrice: 999,
                image: "58d24504-d241-4fde-96ec-ca685673f696.jpeg",
                category_id: mac!.category_id
            },
            {
                name: "Macbook Pro 2023",
                description: "MacBook Pro 2023 với chip Apple M2 Pro/M2 Max mạnh mẽ, màn hình Liquid Retina XDR sáng và sắc nét, thiết kế mỏng nhẹ nhưng bền bỉ, hỗ trợ nhiều cổng kết nối Thunderbolt và HDMI, bàn phím Magic Keyboard cải tiến, thời lượng pin lâu dài. Lý tưởng cho các nhà sáng tạo nội dung, lập trình viên và công việc đòi hỏi hiệu năng cao.",
                basePrice: 1299,
                image: "15918b9f-7a45-4eb4-ba09-07fb5945ee1a.jpeg",
                category_id: mac!.category_id
            },
            {
                name: "iMac 24 M1",
                description: "iMac 24 inch M1 với thiết kế siêu mỏng, màu sắc trẻ trung và sống động. Trang bị chip Apple M1 mạnh mẽ, chạy mượt macOS, hiệu năng đồ họa vượt trội, phù hợp cho cả công việc và giải trí đa phương tiện.",
                basePrice: 1299,
                image: "7bfe0fa1-55f7-440a-94fd-a55518845258.jpg",
                category_id: mac!.category_id
            },
            {
                name: "Mac Mini M2",
                description: "Mac Mini M2 nhỏ gọn nhưng mạnh mẽ với chip Apple M2, hiệu năng vượt trội cho công việc hàng ngày và các tác vụ chuyên sâu. Hỗ trợ kết nối đa dạng, đồ họa nâng cao, chạy mượt macOS với tốc độ phản hồi nhanh và tiêu thụ điện năng tối ưu.",
                basePrice: 699,
                image: "0b14cc32-1735-4833-b980-2f80ee647b82.jpg",
                category_id: mac!.category_id
            },
            {
                name: "iPhone 14",
                description: "iPhone 14 với màn hình Super Retina XDR, camera kép 12MP hỗ trợ chụp ảnh và quay video chất lượng cao, chip A15 Bionic mạnh mẽ, hiệu năng ổn định cho mọi tác vụ. Hỗ trợ Face ID, pin lâu dài, khả năng chống nước IP68 và các tính năng an toàn như SOS khẩn cấp qua vệ tinh.",
                basePrice: 799,
                image: "6b1b2390-01ff-49f4-9b82-dc4b2d21849d.jpg",
                category_id: iphone!.category_id
            },
            {
                name: "iPhone 14 Pro",
                description: "iPhone 14 Pro với màn hình Super Retina XDR ProMotion, camera 48MP cải tiến với nhiều chế độ chụp chuyên nghiệp, chip A16 Bionic mạnh mẽ, hiệu năng vượt trội cho mọi tác vụ và chơi game. Hỗ trợ Dynamic Island, Face ID, pin lâu dài và khả năng chống nước IP68.",
                basePrice: 999,
                image: "0b041bcb-d6da-4edf-b455-8c20c1c2c876.jpg",
                category_id: iphone!.category_id
            },
            {
                name: "iPhone 13",
                description: "iPhone 13 với thiết kế sang trọng, camera kép 12MP chất lượng cao, màn hình Super Retina XDR sáng rõ, chip A15 Bionic mạnh mẽ, hiệu năng mượt mà cho mọi tác vụ và chơi game. Hỗ trợ Face ID, pin lâu dài và khả năng chống nước chuẩn IP68.",
                basePrice: 699,
                image: "d176c4dc-e915-4885-8c3e-93a464281bd2.jpg",
                category_id: iphone!.category_id
            },
            {
                name: "iPhone SE (2022)",
                description: "iPhone SE (2022) với thiết kế nhỏ gọn, màn hình Retina HD, hiệu năng mạnh mẽ nhờ chip A15 Bionic, hỗ trợ camera đơn chất lượng cao và Touch ID tiện lợi. Lý tưởng cho người dùng thích iPhone nhỏ nhưng vẫn mạnh mẽ.",
                basePrice: 429,
                image: "138839eb-513f-4464-89d2-29039a80b400.jpg",
                category_id: iphone!.category_id
            },
            {
                name: "iPad Air 5",
                description: "iPad Air 5 với thiết kế mỏng nhẹ, màn hình Liquid Retina 10.9 inch, hiệu năng mạnh mẽ nhờ chip M1, hỗ trợ Apple Pencil 2 và Magic Keyboard. Lý tưởng cho học tập, làm việc và giải trí di động.",
                basePrice: 599,
                image: "0e8af94d-baf8-4fe1-b4ac-0dc80738aa9d.jpg",
                category_id: ipad!.category_id
            },
            {
                name: "iPad Pro 11 M2",
                description: "iPad Pro 11 inch M2 với màn hình Liquid Retina XDR sắc nét, chip M2 mạnh mẽ, hỗ trợ Apple Pencil 2 và Magic Keyboard, đem lại trải nghiệm làm việc và giải trí chuyên nghiệp, đa nhiệm mượt mà.",
                basePrice: 799,
                image: "49bb184c-8b61-4648-a539-b5902b3010c3.jpg",
                category_id: ipad!.category_id
            },
            {
                name: "iPad Air M3",
                description: "iPad Air M3 với chip Apple M3 mạnh mẽ, thiết kế mỏng nhẹ, màn hình Liquid Retina 10.9 inch sắc nét, hỗ trợ Apple Pencil và Magic Keyboard, lý tưởng cho học tập, sáng tạo và giải trí.",
                basePrice: 449,
                image: "33fbfa64-cb5e-4cc9-9e7f-f2cd593584b8.jpg",
                category_id: ipad!.category_id
            },
            {
                name: "iPad Mini 6",
                description: "iPad Mini 6 nhỏ gọn, trang bị chip A15 Bionic, màn hình Liquid Retina 8.3 inch, hỗ trợ Apple Pencil 2, lý tưởng cho công việc di động, giải trí và sáng tạo mọi lúc mọi nơi.",
                basePrice: 499,
                image: "44f38ef2-83ef-4778-bd28-d33639ac3cad.jpg",
                category_id: ipad!.category_id
            },
            {
                name: "AirPods 2",
                description: "AirPods 2 với thiết kế không dây tiện lợi, chất lượng âm thanh tốt, kết nối nhanh với các thiết bị Apple và thời lượng pin ấn tượng, phù hợp cho nghe nhạc, gọi điện và làm việc di động.",
                basePrice: 129,
                image: "f12b814a-aafd-4491-94c8-e385614fdd85.jpg",
                category_id: airpods!.category_id
            },
            {
                name: "AirPods Pro 2",
                description: "AirPods Pro 2 với tính năng chống ồn chủ động, chế độ Transparency, chất lượng âm thanh nâng cao và khả năng kết nối mượt mà với các thiết bị Apple, mang đến trải nghiệm nghe nhạc và gọi điện đỉnh cao.",
                basePrice: 249,
                image: "b691048c-8fa9-4531-89e1-aa85962b64e2.jpg",
                category_id: airpods!.category_id
            },
            {
                name: "AirPods Max",
                description: "AirPods Max là tai nghe chụp tai cao cấp của Apple với âm thanh không gian (Spatial Audio), chống ồn chủ động, chất liệu sang trọng và trải nghiệm nghe nhạc vượt trội, phù hợp cho audiophile và người dùng chuyên nghiệp.",
                basePrice: 549,
                image: "0a357de9-8724-4882-9ee4-19f36fda6b48.jpg",
                category_id: airpods!.category_id
            },
            {
                name: "AirPods 3",
                description: "AirPods 3 với thiết kế gọn nhẹ, âm thanh mạnh mẽ, hỗ trợ Spatial Audio và Adaptive EQ, mang đến trải nghiệm nghe nhạc và đàm thoại chất lượng cao, tiện lợi cho mọi hoạt động hàng ngày.",
                basePrice: 179,
                image: "8d0659e9-1e4a-42fe-baa2-01d2bdfe6cac.jpg",
                category_id: airpods!.category_id
            }
        ];

        for (const p of productsData) {
            await prisma.product.create({
                data: {
                    name: p.name,
                    description: p.description,
                    basePrice: p.basePrice,
                    image: p.image,
                    category_id: p.category_id
                }
            });
        }
    }
    else {
        console.log(">>>ALREADY INIT DATA...")
    }

}
export default initDatabase