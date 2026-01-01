// Role constants
export const ROLES = {
    PAU: 'PAU',
    KETUA_KAMAR: 'KETUA_KAMAR',
    ASRAMA: 'ASRAMA',
    KAFIL: 'KAFIL',
    ASATID: 'ASATID',
    PENGURUS: 'PENGURUS',
}

// Check if user has specific role
export const hasRole = (user, roleName) => {
    if (!user || !user.roles) return false
    return user.roles.includes(roleName)
}

// Check if user has any of the roles
export const hasAnyRole = (user, roleNames) => {
    if (!user || !user.roles) return false
    return roleNames.some(role => user.roles.includes(role))
}

// Check if user can manage data (CRUD operations)
export const canManageData = (user) => {
    return hasRole(user, ROLES.PAU)
}

// Check if user can do presensi
export const canDoPresensi = (user) => {
    return hasAnyRole(user, [ROLES.KETUA_KAMAR, ROLES.ASRAMA])
}

// Get menu items based on role
export const getMenuItems = (user) => {
    const menuItems = [
        {
            name: 'Dashboard',
            path: '/dashboard',
            icon: 'home',
            roles: Object.values(ROLES), // All roles can access
        },
        {
            name: 'Data Santri',
            path: '/santri',
            icon: 'users',
            roles: Object.values(ROLES), // All roles can access
        },
    ]

    // Add Presensi menu only for specific roles
    if (canDoPresensi(user)) {
        menuItems.push({
            name: 'Presensi',
            path: '/presensi',
            icon: 'check-circle',
            roles: [ROLES.KETUA_KAMAR, ROLES.ASRAMA],
        })
    }

    return menuItems.filter(item =>
        !item.roles || item.roles.some(role => user.roles.includes(role))
    )
}
