import users from "@/app/modls/User/users";
import connect from "@/app/utils/db";

 

export async function GET(req, { params }) {
    await connect();
    const { id } = await params;

    try {
        const user = await users.findById(id);
        if (!user) {
            return new Response(JSON.stringify({ error: "کاربر یافت نشد" }), { status: 404 });
        }

        return new Response(JSON.stringify(user), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching user:", error.message);
        return new Response(JSON.stringify({ error: "خطا در دریافت اطلاعات کاربر" }), { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    await connect();
    try {
        const { id } = await params;

        const deletedUser = await users.findByIdAndDelete(id);

        if (!deletedUser) {
            return new Response(JSON.stringify({ error: "کاربر پیدا نشد!" }), {
                status: 404,
            });
        }

        return new Response(JSON.stringify({ message: "کاربر با موفقیت حذف شد!" }), {
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "خطا در حذف کاربر" }), {
            status: 500,
        });
    }
}

export async function PUT(req, { params }) {
    await connect();
    try {
        const { id } = await params;
        const { name, phone,    isAdmin } = await req.json();

        const updatedUser = await users.findByIdAndUpdate(
            id,
            { name, phone,  isAdmin },
            { new: true }
        );

        if (!updatedUser) {
            return new Response(JSON.stringify({ error: "کاربر پیدا نشد!" }), {
                status: 404,
            });
        }

        return new Response(JSON.stringify(updatedUser), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "خطا در ویرایش کاربر" }), {
            status: 500,
        });
    }
}
        