import Room from "@/components/Room"
import { getDocument } from "@/lib/actions/room.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Page = async ({ params: { id } }: SearchParamProps) => {
    const clerkUser = await currentUser();

    if (!clerkUser) {
        redirect('/sign-in');
    }

    const room = await getDocument({
        roomId: id,
        userId: clerkUser.emailAddresses[0].emailAddress,
    });



    // if (!room) {
    //     redirect('/');
    // }

    return (
        <main className="flex w-full flex-col items-center">
            <Room roomId={id} roomMetadata={room?.metadata} />
        </main>
    )
}

export default Page