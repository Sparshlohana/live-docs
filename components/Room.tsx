"use client"
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from '@liveblocks/react/suspense'
import { Editor } from './editor/Editor'
import Header from './Header'
import ActiveCollaborators from './ActiveCollaborators'
import { useEffect, useRef, useState } from 'react'
import { Input } from './ui/input'
import Image from 'next/image'
import { updateDocument } from '@/lib/actions/room.actions'
import Loader from './Loader'
import ShareModel from './ShareModel'

const Room = ({ roomId, roomMetadata, currentUserType, users }: CollaborativeRoomProps) => {
    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [documentTitle, setDocumentTitle] = useState(roomMetadata?.title || 'Untitled')

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [documentTitle, roomId])

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus()
        }
    }, [editing])

    const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
            setEditing(false)
            updateDocument(roomId, documentTitle)
        }
    }

    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const updateTitle = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setLoading(true)
            try {
                if (documentTitle !== roomMetadata?.title) {
                    const updatedRoom = await updateDocument(roomId, documentTitle);
                    if (updatedRoom) {
                        setEditing(false)
                    }
                }
            } catch (error) {
                console.log(error);

            } finally {
                setLoading(false)
                setEditing(false)
            }
        }
    }

    return (
        <RoomProvider id={roomId}>
            <ClientSideSuspense fallback={<Loader />}>
                <div className='collaborative-room'>
                    <Header>
                        <div ref={containerRef} className='flex w-fit items-center justify-center gap-2'>
                            {editing && !loading ? (
                                <Input
                                    type='text'
                                    value={documentTitle}
                                    ref={inputRef}
                                    placeholder='Enter title'
                                    onChange={(e) => {
                                        setDocumentTitle(e.target.value)
                                    }}
                                    onKeyDown={(e) => { updateTitle(e) }}
                                    disabled={!editing}
                                    className='document-title-input'
                                />
                            ) : (<>
                                <p className='document-title'>{documentTitle}</p>
                            </>)}

                            {currentUserType === "editor" && !editing && (
                                <Image
                                    src='/assets/icons/edit.svg'
                                    alt='Edit'
                                    width={24}
                                    height={24}
                                    onClick={() => {
                                        setEditing(true)
                                    }}
                                    className='pointer'
                                />
                            )}

                            {currentUserType !== "editor" && !editing && (
                                <p className='view-only-tag'>View Only</p>
                            )}

                            {loading && <p className='text-sm text-gray-400'>Saving...</p>}
                        </div>
                        <div className='flex w-full flex-1 justify-end gap-2 sm:gap-3'>
                            <ActiveCollaborators />
                            <ShareModel roomId={roomId} collaborators={users} creatorId={roomMetadata.creatorId} currentUserType={currentUserType} />
                            <SignedOut>
                                <SignInButton />
                            </SignedOut>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                    </Header>
                    <Editor roomId={roomId} currentUserType={currentUserType} />
                </div>
            </ClientSideSuspense>
        </RoomProvider>
    )
}

export default Room