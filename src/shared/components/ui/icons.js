import React from "react";
import {
    Sun,
    Wind,
    Earth,
    Dam,
    Recycle,
    LayoutDashboard,
    Component, 
    PlugZap,  
    HeartHandshake,
    BadgeCheck,
    MapPinned,
    UserPen,
    SearchIcon,
    Bell,
    Settings,
    UserPlus,
    // New Profile Related Icons
    User,
    Mail,
    Lock,
    Shield,
    Camera,
    Save,
    Smartphone,
    AlertTriangle,
    Key,
    Clock,
    FileText
} from 'lucide-react';
import { useTheme } from "@emotion/react";

export const IconLibrary = {
    // Sidebar Icons
    solar: Sun,
    wind: Wind,
    geothermal: Earth,
    hydropower: Dam,
    biomass: Recycle,
    dashboard: LayoutDashboard,
    modules: Component,
    energyshare: PlugZap,
    help: HeartHandshake,
    recommendation: BadgeCheck,
    myaccount: UserPen,

    // Profile Related Icons
    profile: User,
    email: Mail,
    security: Shield,
    notifications: Bell,
    camera: Camera,
    save: Save,
    phone: Smartphone,
    alert: AlertTriangle,
    password: Key,
    activity: Clock,
    document: FileText
};

export const IconTools = {
    search: SearchIcon,
    notification: Bell,
    settings: Settings,
    addaccount: UserPlus,
    location: MapPinned,
};

export const AppIcon = ({name, color, type = 'icon', ...props}) => {
    const IconComponent = type === 'tool'
            ? IconTools[name] || Sun
            : IconLibrary[name] || Sun;
    const theme = useTheme();
    return (
        <IconComponent 
            color={theme?.palette?.elements?.[name] || 'currentColor'} 
            {...props} 
        />
    );
};

//Default Props For icons
AppIcon.defaultProps = {
    size: 20,
    strokeWidth: 1.75,
    color: 'currentColor',
};

export default AppIcon