import { List } from "./list"
import { NewButton } from "./new-button"


const Sidebar = () => {
    return (
        <aside
            className="fixed z-[1] left-0 bg-blue-950 w-[60px] flex p-3 gap-y-4 flex-col h-full"
        >
            <List />
            <NewButton />
        </aside>
    )
}

export default Sidebar