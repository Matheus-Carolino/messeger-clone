import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

interface IParams {
    conversationId?: string;
}

export async function POST(
    request: Request,
    {params}: {params: IParams}
) {
    try {
        const { conversationId } = params;
        const currentUser = await getCurrentUser();
        const body = await request.json();
        const {
            name,
            groupImage
        } = body;

        if(!currentUser?.id){
            return new NextResponse('Unauthorized', {status: 401})
        }

        const existingConversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }
        });

        if (!existingConversation) {
            return new NextResponse('Invalid ID', { status: 400 });
        }

        const updateGroup = await prisma.conversation.update({
            where: {
                id: conversationId
            },
            data: {
                name: name,
                groupImage: groupImage
            }
        });

        return NextResponse.json(updateGroup);
    } catch (error) {
        console.log(error, 'ERROR_CONVERSATION_GROUPSETTINGS');
        return new NextResponse('Internal Error', {status: 500});
    }
}