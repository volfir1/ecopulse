import React from 'react';
import { Card, AppIcon } from '@shared/index';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow,
  Chip,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Dialog
} from '@mui/material';
import { useUserManagement } from '../users/userManageHook';

export default function UserManagement() {
  const {
    data,
    loading,
    selectedUser,
    filters,
    handleUserStatusChange,
    handleUserDelete,
    handleSearch,
    handleFilterChange,
    setSelectedUser
  } = useUserManagement();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with Stats */}
      <Box className="mb-6">
        <Typography variant="h4" className="mb-6">User Management</Typography>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(data.statistics).map(([key, value]) => (
            <Card.Base key={key}>
              <Box className="p-4">
                <Typography color="text.secondary" variant="body2">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </Typography>
                <Typography variant="h4" className="mt-2">{value}</Typography>
              </Box>
            </Card.Base>
          ))}
        </div>
      </Box>

      {/* Filters */}
      <Card.Base className="mb-6">
        <Box className="p-4 flex gap-4 flex-wrap">
          <TextField
            placeholder="Search users..."
            size="small"
            onChange={(e) => handleSearch(e.target.value)}
            value={filters.search}
          />
          <Select
            size="small"
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
          >
            <MenuItem value="all">All Roles</MenuItem>
            {data.roles.map(role => (
              <MenuItem key={role} value={role}>{role}</MenuItem>
            ))}
          </Select>
          <Select
            size="small"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            {data.statuses.map(status => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </Select>
        </Box>
      </Card.Base>

      {/* Users Table */}
      <Card.Base>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Energy Usage</TableCell>
              <TableCell>Last Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.usersList.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <Typography variant="body2">{user.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email}
                      </Typography>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip label={user.role} size="small" />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.status}
                    color={user.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{user.energyUsage}</TableCell>
                <TableCell>
                  {new Date(user.lastActive).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Box className="flex gap-2">
                    <IconButton
                      size="small"
                      onClick={() => setSelectedUser(user)}
                    >
                      <AppIcon name="edit" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleUserDelete(user.id)}
                    >
                      <AppIcon name="delete" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card.Base>
    </div>
  );
}