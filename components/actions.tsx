"use client"

import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Link2, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { on } from "stream"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useApiMutation } from "@/hooks/useApiMutation"
import { ConfirmModal } from "./confirm-modal"
import { Button } from "./ui/button"
import { useRenameModal } from "@/store/use-rename-modal"

interface ActionProps {
    children: React.ReactNode
    side?: DropdownMenuContentProps["side"]
    sideOffset?: DropdownMenuContentProps["sideOffset"]
    id: string
    title: string
}
export const Action = ({ title, children, side, sideOffset, id }: ActionProps) => {
    const { onOpen } = useRenameModal()
    const { mutate, pending } = useApiMutation(api.board.remove)
    const onCopyLink = () => {

        navigator.clipboard.writeText(
            `${window.location.origin}/board/${id}`,
        )
            .then(() => toast.success("Link copied"))
            .catch(() => toast.error("Something went wrong"))
    }
    const onDelete = () => {
        mutate({ id })
            .then(() => toast.success("Board deleted"))
            .catch(() => toast.error('Failed to delete board'))
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side={side}
                sideOffset={sideOffset}
                className="w-60"
                onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem
                    onClick={onCopyLink}
                    className="p-3 cursor-pointer">
                    <Link2 className="h-4 w-4 mr-2" />
                    Copy board link
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => onOpen(id, title)}
                    className="p-3 cursor-pointer">
                    <Pencil className="h-4 w-4 mr-2" />
                    Rename
                </DropdownMenuItem>
                <ConfirmModal
                    header="Delete Board"
                    description="Delete Board and its content"
                    disabled={pending}
                    onConfirm={onDelete}
                >
                    <Button
                        variant={'ghost'}
                        className="p-3 cursor-pointer text-sm w-full justify-start font-normal">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                </ConfirmModal>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}