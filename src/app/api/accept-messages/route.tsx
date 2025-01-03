import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";


export async function POST(request:Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message:"Not authenticated"
            },
            {
                status: 401
            }
        )
    }

    const userId = user._id
    const {acceptMessages} = await request.json()

   try {
     const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        {isAcceptingMessage: acceptMessages},
        {new: true}
    );
 
     if(!updatedUser){
         return Response.json({
             success: false,
             message:"User not found"
         },
     {status: 401})
     }
     return Response.json({
        success: true,
        message: "Message acceptance status updated successfully",
        updatedUser
     },
    {status: 200})
   } catch (error) {
    console.log("failed to update user status to accept message, ", error);
    return Response.json({
        success: false,
        message: "failed to update user status to accept message"
    },
{status: 500})
   }
} 

export async function GET(request: Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message:"Not authenticated"
            },
            {
                status: 401
            }
        )
    }

    const userId = user._id;
    try {
        const loggedInUser = await UserModel.findById(userId);
        if(!loggedInUser){
            return Response.json(
                {
                    success: false,
                    message:"User not found"
                },
                {
                    status: 401
                }
            )
        }
        const isAcceptingMessage =  loggedInUser.isAcceptingMessage;

        return Response.json({
            success: true,
            message: "User status of accepting messages received",
            isAcceptingMessage
        },
    {status: 200})
    } catch (error) {
        console.log("failed to fetch user status of accepting messages, ", error);
    return Response.json({
        success: false,
        message: "failed to fetch user status of accepting messages"
    },
{status: 500})
    }
}

