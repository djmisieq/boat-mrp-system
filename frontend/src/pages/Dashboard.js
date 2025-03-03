import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Card, 
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import { 
  Inventory as InventoryIcon,
  WarningAmber as WarningIcon,
  CheckCircle as CheckCircleIcon,
  LocalShipping as ShippingIcon,
  Build as BuildIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    activeOrders: 0,
    pendingShipments: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  // Mock data for initial development - to be replaced with API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalProducts: 157,
        lowStockProducts: 12,
        activeOrders: 8,
        pendingShipments: 3
      });
      
      setRecentOrders([
        { id: 1, orderNumber: 'ORD-2023-001', customerName: 'Jan Kowalski', status: 'CONFIRMED', date: '2025-02-28' },
        { id: 2, orderNumber: 'ORD-2023-002', customerName: 'Anna Nowak', status: 'IN_PRODUCTION', date: '2025-02-27' },
        { id: 3, orderNumber: 'ORD-2023-003', customerName: 'Tomasz Wiśniewski', status: 'SUBMITTED', date: '2025-02-26' },
        { id: 4, orderNumber: 'ORD-2023-004', customerName: 'Katarzyna Dąbrowska', status: 'COMPLETED', date: '2025-02-25' }
      ]);
      
      setLoading(false);
    }, 1000);
    
    // Actual API calls will be implemented here later
    // const fetchStats = async () => {
    //   try {
    //     const response = await axios.get('/api/v1/dashboard/stats');
    //     setStats(response.data);
    //   } catch (error) {
    //     console.error('Error fetching stats:', error);
    //   }
    // };
    
    // const fetchRecentOrders = async () => {
    //   try {
    //     const response = await axios.get('/api/v1/orders/recent');
    //     setRecentOrders(response.data);
    //   } catch (error) {
    //     console.error('Error fetching recent orders:', error);
    //   }
    // };
    
    // fetchStats();
    // fetchRecentOrders();
    // setLoading(false);
  }, []);
  
  // Helper function to get status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return { color: 'info', icon: <ShippingIcon fontSize="small" /> };
      case 'CONFIRMED':
        return { color: 'primary', icon: <CheckCircleIcon fontSize="small" /> };
      case 'IN_PRODUCTION':
        return { color: 'warning', icon: <BuildIcon fontSize="small" /> };
      case 'COMPLETED':
        return { color: 'success', icon: <CheckCircleIcon fontSize="small" /> };
      default:
        return { color: 'default', icon: null };
    }
  };

  // Helper function to format status
  const formatStatus = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return 'Złożone';
      case 'CONFIRMED':
        return 'Potwierdzone';
      case 'IN_PRODUCTION':
        return 'W produkcji';
      case 'COMPLETED':
        return 'Zakończone';
      default:
        return status;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Pulpit
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Witaj, {currentUser?.first_name || 'Użytkowniku'}! Oto bieżący przegląd systemu MRP.
        </Typography>
      </Box>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Produkty
            </Typography>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <InventoryIcon sx={{ color: 'primary.main', mr: 1, fontSize: 40 }} />
              <Typography variant="h4" component="div">
                {stats.totalProducts}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Niski stan magazynowy
            </Typography>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <WarningIcon sx={{ color: 'warning.main', mr: 1, fontSize: 40 }} />
              <Typography variant="h4" component="div">
                {stats.lowStockProducts}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aktywne zamówienia
            </Typography>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <BuildIcon sx={{ color: 'info.main', mr: 1, fontSize: 40 }} />
              <Typography variant="h4" component="div">
                {stats.activeOrders}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Oczekujące wysyłki
            </Typography>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <ShippingIcon sx={{ color: 'success.main', mr: 1, fontSize: 40 }} />
              <Typography variant="h4" component="div">
                {stats.pendingShipments}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Recent Orders */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Ostatnie zamówienia" />
            <Divider />
            <CardContent>
              <List>
                {recentOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1">{order.orderNumber}</Typography>
                            <Chip 
                              icon={getStatusColor(order.status).icon}
                              label={formatStatus(order.status)} 
                              color={getStatusColor(order.status).color} 
                              size="small" 
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="body2">{order.customerName}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {order.date}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
