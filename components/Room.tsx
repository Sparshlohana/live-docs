"use client"
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from '@liveblocks/react/suspense'
import { Editor } from './editor/Editor'
import Header from './Header'

const Room = () => {
    return (
        <LiveblocksProvider publicApiKey={"pk_dev_X9ZdSFWsXTHrgVJy774Tzo9N1RBasEBbCiVFw2MRhPqvRtAw-_O-ZTnk2d00pMvO"}>
            <RoomProvider id="my-room">
                <ClientSideSuspense fallback={<div>Loading…</div>}>
                    <div className='collaborative-room'>
                        <Header>
                            <div className='flex w-fit items-center justify-center gap-2'>
                                <p className='document-title'>Share</p>
                            </div>
                            <SignedOut>
                                <SignInButton />
                            </SignedOut>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </Header>
                        <Editor />
                    </div>
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    )
}

export default Room