import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ticketService from '../../features/help-support/components/ticketService';
import { useSnackbar } from '@components/toast-notif/ToastNotification';
import Card from '@components/cards/cards';
import { AppIcon } from '@shared/index';
import { 
  Typography, 
  Box, 
  Grid, 
  Avatar, 
  LinearProgress, 
  Button, 
  Chip, 
  Divider, 
  Paper 
} from '@mui/material';
import { 
  ArrowUpRight, 
  ArrowDownRight,
  BarChart4,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const toast = useSnackbar();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    tickets: {
      total: 0,
      open: 0,
      inProgress: 0,
      resolved: 0,
      closed: 0,
      unassigned: 0
    },
    responseTime: {
      average: 0,
      change: 0
    },
    resolution: {
      rate: 0,
      change: 0
    },
    userSatisfaction: {
      rate: 0,
      change: 0
    }
  });
  const [recentTickets, setRecentTickets] = useState([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch ticket stats
        const statsResponse = await ticketService.getTicketStats();
        if (statsResponse.data) {
          setStats(prev => ({
            ...prev,
            tickets: {
              total: statsResponse.data.total || 0,
              open: statsResponse.data.open || 0,
              inProgress: statsResponse.data.inProgress || 0,
              resolved: statsResponse.data.resolved || 0,
              closed: statsResponse.data.closed || 0,
              unassigned: statsResponse.data.unassigned || 0
            },
            // Sample data for other statistics (would come from the API in a real app)
            responseTime: {
              average: 2.4, // hours
              change: -5.2  // percent change
            },
            resolution: {
              rate: 87, // percent
              change: 3.8 // percent change
            },
            userSatisfaction: {
              rate: 92, // percent
              change: 1.5 // percent change
            }
          }));
        }
        
        // Fetch recent tickets
        const recentResponse = await ticketService.getAllTickets();
        setRecentTickets(recentResponse.data.slice(0, 5)); // Get latest 5 tickets
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [toast]);
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return { bg: '#EEF7FF', color: '#1A73E8' };
      case 'in-progress':
        return { bg: '#FFF7E0', color: '#F29D41' };
      case 'resolved':
        return { bg: '#E7F7ED', color: '#34A853' };
      case 'closed':
        return { bg: '#F2F2F2', color: '#5F6368' };
      default:
        return { bg: '#F2F2F2', color: '#5F6368' };
    }
  };
  
  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return { bg: '#E7F7ED', color: '#34A853' };
      case 'medium':
        return { bg: '#FFF7E0', color: '#F29D41' };
      case 'high':
        return { bg: '#FFEBEE', color: '#E53935' };
      case 'urgent':
        return { bg: '#7F1D1D', color: '#FFFFFF' };
      default:
        return { bg: '#F2F2F2', color: '#5F6368' };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <RefreshCw className="animate-spin text-primary" size={40} />
      </Box>
    );
  }
  
  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <Typography variant="h4" fontWeight="bold" color="text.primary">
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of support ticket metrics and activity
        </Typography>
      </div>
      
      {/* Statistics Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Tickets Card */}
        <Card.Base>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Tickets
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.tickets.total}
                </Typography>
              </Box>
              <Avatar
                sx={{
                  backgroundColor: 'rgba(21, 101, 192, 0.1)',
                  color: '#1565C0',
                  width: 40,
                  height: 40
                }}
              >
                <AppIcon name="ticket" size={20} />
              </Avatar>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip
                size="small"
                icon={<ArrowUpRight size={14} />}
                label="8.5% vs last week"
                sx={{
                  backgroundColor: 'rgba(52, 168, 83, 0.1)',
                  color: '#34A853',
                  fontSize: '0.75rem'
                }}
              />
            </Box>
          </Box>
        </Card.Base>
        
        {/* Response Time Card */}
        <Card.Base>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Average Response
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.responseTime.average}h
                </Typography>
              </Box>
              <Avatar
                sx={{
                  backgroundColor: 'rgba(245, 124, 0, 0.1)',
                  color: '#F57C00',
                  width: 40,
                  height: 40
                }}
              >
                <Clock size={20} />
              </Avatar>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip
                size="small"
                icon={<ArrowDownRight size={14} />}
                label={`${Math.abs(stats.responseTime.change)}% vs last week`}
                sx={{
                  backgroundColor: stats.responseTime.change < 0 ? 'rgba(52, 168, 83, 0.1)' : 'rgba(234, 67, 53, 0.1)',
                  color: stats.responseTime.change < 0 ? '#34A853' : '#EA4335',
                  fontSize: '0.75rem'
                }}
              />
            </Box>
          </Box>
        </Card.Base>
        
        {/* Resolution Rate Card */}
        <Card.Base>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Resolution Rate
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.resolution.rate}%
                </Typography>
              </Box>
              <Avatar
                sx={{
                  backgroundColor: 'rgba(52, 168, 83, 0.1)',
                  color: '#34A853',
                  width: 40,
                  height: 40
                }}
              >
                <CheckCircle size={20} />
              </Avatar>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip
                size="small"
                icon={<ArrowUpRight size={14} />}
                label={`${stats.resolution.change}% vs last week`}
                sx={{
                  backgroundColor: stats.resolution.change > 0 ? 'rgba(52, 168, 83, 0.1)' : 'rgba(234, 67, 53, 0.1)',
                  color: stats.resolution.change > 0 ? '#34A853' : '#EA4335',
                  fontSize: '0.75rem'
                }}
              />
            </Box>
          </Box>
        </Card.Base>
        
        {/* User Satisfaction Card */}
        <Card.Base>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  User Satisfaction
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.userSatisfaction.rate}%
                </Typography>
              </Box>
              <Avatar
                sx={{
                  backgroundColor: 'rgba(26, 115, 232, 0.1)',
                  color: '#1A73E8',
                  width: 40,
                  height: 40
                }}
              >
                <Users size={20} />
              </Avatar>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip
                size="small"
                icon={<ArrowUpRight size={14} />}
                label={`${stats.userSatisfaction.change}% vs last week`}
                sx={{
                  backgroundColor: stats.userSatisfaction.change > 0 ? 'rgba(52, 168, 83, 0.1)' : 'rgba(234, 67, 53, 0.1)',
                  color: stats.userSatisfaction.change > 0 ? '#34A853' : '#EA4335',
                  fontSize: '0.75rem'
                }}
              />
            </Box>
          </Box>
        </Card.Base>
      </div>
      
      {/* Open Tickets Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card.Base>
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Tickets by Status
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/admin/ticket ')}
                >
                  View All
                </Button>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2, 
                      textAlign: 'center',
                      backgroundColor: '#EEF7FF',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="h5" fontWeight="bold" color="#1A73E8">
                      {stats.tickets.open}
                    </Typography>
                    <Typography variant="body2" color="#1A73E8">
                      Open
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={6} md={3}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2, 
                      textAlign: 'center',
                      backgroundColor: '#FFF7E0',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="h5" fontWeight="bold" color="#F29D41">
                      {stats.tickets.inProgress}
                    </Typography>
                    <Typography variant="body2" color="#F29D41">
                      In Progress
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={6} md={3}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2, 
                      textAlign: 'center',
                      backgroundColor: '#E7F7ED',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="h5" fontWeight="bold" color="#34A853">
                      {stats.tickets.resolved}
                    </Typography>
                    <Typography variant="body2" color="#34A853">
                      Resolved
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={6} md={3}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2, 
                      textAlign: 'center',
                      backgroundColor: '#FFEBEE',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="h5" fontWeight="bold" color="#E53935">
                      {stats.tickets.unassigned}
                    </Typography>
                    <Typography variant="body2" color="#E53935">
                      Unassigned
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" fontWeight="medium">
                    Open Tickets
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {stats.tickets.open} / {stats.tickets.total}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(stats.tickets.open / stats.tickets.total) * 100}
                  sx={{ 
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(26, 115, 232, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#1A73E8'
                    }
                  }}
                />
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" fontWeight="medium">
                    In Progress Tickets
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {stats.tickets.inProgress} / {stats.tickets.total}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(stats.tickets.inProgress / stats.tickets.total) * 100}
                  sx={{ 
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(242, 157, 65, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#F29D41'
                    }
                  }}
                />
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" fontWeight="medium">
                    Resolved Tickets
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {stats.tickets.resolved} / {stats.tickets.total}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(stats.tickets.resolved / stats.tickets.total) * 100}
                  sx={{ 
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(52, 168, 83, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#34A853'
                    }
                  }}
                />
              </Box>
            </Box>
          </Card.Base>
        </div>
        
        {/* Recent Activity */}
        <div>
          <Card.Base sx={{ height: '100%' }}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Recent Activity
              </Typography>
              
              {recentTickets.length > 0 ? (
                <Box>
                  {recentTickets.map((ticket, index) => (
                    <React.Fragment key={ticket._id}>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          py: 2,
                          cursor: 'pointer'
                        }}
                        onClick={() => navigate(`/admin/tickets/${ticket._id}`)}
                      >
                        <Avatar
                          src={ticket.user?.profilePicture}
                          sx={{ width: 36, height: 36, mr: 2 }}
                        >
                          {ticket.user?.firstName?.charAt(0) || ticket.user?.email?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="body2" fontWeight="medium" noWrap>
                              {ticket.subject}
                            </Typography>
                            <Chip
                              label={ticket.status.replace('-', ' ')}
                              size="small"
                              sx={{
                                ...getStatusColor(ticket.status),
                                textTransform: 'capitalize',
                                fontWeight: 'medium',
                                fontSize: '0.65rem',
                                height: 20
                              }}
                            />
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(ticket.updatedAt)}
                          </Typography>
                        </Box>
                      </Box>
                      {index < recentTickets.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </Box>
              ) : (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No recent activity
                  </Typography>
                </Box>
              )}
            </Box>
          </Card.Base>
        </div>
      </div>
      
      {/* Priority Statistics */}
      <div className="mb-6">
        <Card.Base>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Tickets by Priority
              </Typography>
              <BarChart4 size={20} />
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box 
                    sx={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      backgroundColor: '#E7F7ED',
                      mb: 2
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" color="#34A853">
                      42%
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight="medium">
                    Low
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box 
                    sx={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      backgroundColor: '#FFF7E0',
                      mb: 2
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" color="#F29D41">
                      35%
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight="medium">
                    Medium
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box 
                    sx={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      backgroundColor: '#FFEBEE',
                      mb: 2
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" color="#E53935">
                      18%
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight="medium">
                    High
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box 
                    sx={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      backgroundColor: '#7F1D1D20',
                      mb: 2
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" color="#7F1D1D">
                      5%
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight="medium">
                    Urgent
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Card.Base>
      </div>
    </div>
  );
};

export default AdminDashboard;