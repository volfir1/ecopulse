import {List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse} from '@mui/material'
import { ExpandLess, ExpandMore} from '@mui/icons-material'
import React from 'react'
import { useTheme } from '@emotion/react'


const RenderDrawer =(item, open, openSubMenu, handleSubMenu) =>{
    const theme = useTheme()
    if(item.kind ==='header'){
        return open && (
            <ListItem key={item.title} sx={{py: 2, px: 3, color:theme.palette.text.secondary}}>
                <ListItemText
                    primary = {item.title}
                    primaryTypographyProps={{
                        fontSize: 12,
                        fontWeight: 'medium',
                        color: 'text.secondary',
                    }}
            />
            </ListItem>
        )
    }

    if (item.kind === 'divider') return null;
    const hasChildren = item.children && item.children.length > 0;

    return(
        <React.Fragment key={item.segment}>
            <ListItem disablePadding sx={{ display: 'block'}}>
            <ListItemButton
                sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                }}
                onClick={() => hasChildren && handleSubMenu(item.segment)}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                    }}
                >
                    {item.icon}
                </ListItemIcon>
                <ListItemText
                    primary={item.title}
                    sx={{ opacity: open ? 1 : 0}}
                />
                {hasChildren && open && (
                    openSubMenu[item.segment] ? <ExpandLess /> : <ExpandMore />
                )}
            </ListItemButton>
            </ListItem>  
            {hasChildren && (
                <Collapse in={open && openSubMenu[item.segment]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {item.children.map((child)=>(
                            <ListItemButton
                                key={child.segment}
                                sx={{pl: 4}}
                            >
                                <ListItemIcon>
                                    {child.icon}
                                </ListItemIcon>
                                <ListItemText primary = {child.title} />
                            </ListItemButton>
                        ))}
                    </List>
                </Collapse>
            )}    
         </React.Fragment>
    )
}
export default RenderDrawer
