import { useState } from "react";

const useDrawer = () => {
    const [open, setOpen] = useState(true)
    const [openSubMenu, setOpenSubMenu] = useState({})

    const handleDrawer = () =>{
        setOpen(prev =>!prev)
    }

    const handleSubMenu = (segment) => {
        setOpenSubMenu(prev =>({
            ...prev,
            [segment] : !prev[segment]
        }))
    }

    return{
        open,
        openSubMenu,
        handleDrawer,
        handleSubMenu
    }
}

export default useDrawer