import comment from "@/app/modls/comment/comments";
import connect from "@/app/utils/db";

 
 
export async function GET(req,{params}) {  
  await connect();  
  const {id} = await params
  try {  
    const comments = await comment
    .find({productId:  id})
  .populate("userId", "name phone")        // Only include name and phone from user
    .populate("productId", "name");          // Only include name from product
  
  
    return new Response(JSON.stringify(comments), {   
      status: 200,  
      headers: { "Content-Type": "application/json" },  
    });  
  } catch (error) {  
    console.error(error);  
    return new Response(JSON.stringify({ error: "Failed to fetch comments" }), {  
      status: 500,  
      headers: { "Content-Type": "application/json" },  
    });  
  }  
}


  
 
  export async function PUT(req, { params }) {
    await connect();
    try {
      const { id } = await params;
      const { isApproval } = await req.json();
      const updatedcomment = await comment.findByIdAndUpdate(id, { isApproval }, { new: true });
  
      if (!updatedcomment) {
        return new Response(JSON.stringify({ error: "مغازه پیدا نشد!" }), { status: 404 });
      }
      return new Response(JSON.stringify(updatedcomment), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: "خطا در ویرایش مغازه" }), { status: 500 });
    }
  }
     

 
 
export async function DELETE(req, { params }) {
  await connect();
  try {
    const { id } = await params;  

    const deletedcomments = await comment.findByIdAndDelete(id);

    if (!deletedcomments) {
      return new Response(JSON.stringify({ error: "پست پیدا نشد!" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: "پست با موفقیت حذف شد!" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "خطا در حذف پست" }), {
      status: 500,
    });
  }
}
