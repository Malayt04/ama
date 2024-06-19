import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from '../../../model/User';

export async function POST(request: Request) {
    await dbConnect();
    const requestData = await request.json(); // Call request.json() once
    const { username, content } = requestData;

    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return new Response(JSON.stringify({
                success: false,
                message: "User not found"
            }), { status: 404 });
        }

        if (!user.isAcceptingMessage) {
            return new Response(JSON.stringify({
                success: false,
                message: "User is not accepting messages"
            }), { status: 401 });
        }

        const newMessage: Message = { content, createdAt: new Date() }; // Ensure newMessage is of type Message
        user.messages.push(newMessage);
        await user.save();

        return new Response(JSON.stringify({
            success: true,
            message: "Message sent successfully"
        }), { status: 200 });
    } catch (error) {
        console.error(error); // Improved error logging
        return new Response(JSON.stringify({
            success: false,
            message: "Failed to send message"
        }), { status: 500 });
    }
}
