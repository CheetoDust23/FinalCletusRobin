"use client"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import { OverLay } from "./overlay"
import { useAuth } from "@clerk/nextjs"
import { Footer } from "./footer"
import { Skeleton } from "@/components/ui/skeleton"
import { Action } from "@/components/actions"
import { MoreHorizontal } from "lucide-react"
import { useApiMutation } from "@/hooks/useApiMutation"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"

interface BoardCardProps {

    title: string
    id: string
    authorName: string
    authorId: string
    createdAt: number
    imageUrl: string
    orgId: string
    isFavorite: boolean

}
export const BoardCard = ({
    title, id, createdAt, authorId, authorName, isFavorite, imageUrl, orgId
}: BoardCardProps) => {
    const { mutate: onFavorite, pending: pendingFavorite } = useApiMutation(api.board.favorites)
    const { mutate: onUnFavorite, pending: pendingUnFavorite } = useApiMutation(api.board.unFavorite)

    const toggleFavorite = () => {
        if (isFavorite) {
            onUnFavorite({ id })
                .catch(() => toast.error('Failed to unfavorite'))
        }
        else {
            onFavorite({ id, orgId })
                .catch(() => toast.error("Failed to favorite"))
        }
    }
    const { userId } = useAuth()
    const authorLabel = userId === authorId ? "You" : authorName

    const createdAtLabel = formatDistanceToNow(createdAt, {
        addSuffix: true,
    })
    return (
        <Link href={`/boards/${id}`}>
            <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden">
                <div className="relative flex-1 bg-amber-50">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-fit" />
                    <OverLay />
                    <Action
                        id={id}
                        title={title}
                        side="right"
                    >
                        <button className="
                        absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity  px-3  py-2 outline-none">
                            <MoreHorizontal
                                className="text-white opacity-75 hover:opacity-100 transition-opacity" />
                        </button>
                    </Action>
                </div>
                <Footer
                    title={title}
                    isFavorite={isFavorite}
                    authorLabel={authorLabel}
                    createdAtLabel={createdAtLabel}
                    onClick={toggleFavorite}
                    disabled={pendingFavorite || pendingUnFavorite}
                />
            </div>
        </Link >
    )
}
BoardCard.Skeleton = function BoardCardSkeleton() {
    return (
        <div className=" aspect-[100/127]  rounded-lg overflow-hidden">
            <Skeleton className="h-full w-full" />
        </div>
    )
}