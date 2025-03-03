import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  AvatarGroup,
  Chip,
  IconButton,
  useTheme
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon, 
  LocalShipping as LocalShippingIcon,
  Inventory as InventoryIcon,
  Alarm as AlarmIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Build as BuildIcon,
  DirectionsBoat as BoatIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  MoreVert as MoreVertIcon,
  TrendingDown as TrendingDownIcon,
  DateRange as DateRangeIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { API_URL } from '../config';

// Import new UI components
import DataCard from '../components/ui/DataCard';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';

// Chart components
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar 
} from 'recharts';

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    lowStockItems: 0,
    ordersFulfilled: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  // Sample data for charts
  const salesData = [
    { name: 'Sty', revenue: 4000, profit: 2400 },
    { name: 'Lut', revenue: 3000, profit: 1398 },
    { name: 'Mar', revenue: 2000, profit: 9800 },
    { name: 'Kwi', revenue: 2780, profit: 3908 },
    { name: 'Maj', revenue: 1890, profit: 4800 },
    { name: 'Cze', revenue: 2390, profit: 3800 },
    { name: 'Lip', revenue: 3490, profit: 4300 },
  ];

  const productionData = [
    { name: 'Model A', planned: 30, completed: 25 },
    { name: 'Model B', planned: 20, completed: 18 },
    { name: 'Model C', planned: 15, completed: 12 },
    { name: 'Model D', planned: 25, completed: 22 },
  ];

  // Demo activities for activity feed
  const activities = [
    { 
      id: 1, 
      type: 'orderCreated', 
      message: 'Nowe zamówienie #1248 zostało utworzone', 
      time: '5 minut temu',
      user: 'Michał K.'
    },
    { 
      id: 2, 
      type: 'lowStock', 
      message: 'Silnik XJ-450 osiągnął niski stan magazynowy', 
      time: '30 minut temu',
      user: 'System'
    },
    { 
      id: 3, 
      type: 'orderCompleted', 
      message: 'Zamówienie #1242 zostało zrealizowane', 
      time: '1 godzinę temu',
      user: 'Anna W.'
    },
    { 
      id: 4, 
      type: 'materialDelivery', 
      message: 'Dostawa materiałów dla zamówienia #1236', 
      time: '2 godziny temu',
      user: 'Krzysztof B.'
    },
  ];

  const activityIcons = {
    orderCreated: <BoatIcon color="primary" />,
    lowStock: <ErrorIcon color="error" />,
    orderCompleted: <CheckCircleIcon color="success" />,
    materialDelivery: <LocalShippingIcon color="info" />
  };

  useEffect(() => {
    // In a real app, this would fetch data from the API
    const fetchData = async () => {
      try {
        // Mock data for demo purposes
        setStats({
          totalOrders: 48,
          pendingOrders: 12,
          lowStockItems: 5,
          ordersFulfilled: 36
        });

        // Sample orders
        setRecentOrders([
          { id: 1247, order_number: 'ORD-1247', customer_name: 'Jan Kowalski', status: 'confirmed', order_date: '2025-02-28', required_date: '2025-03-15', total_value: 45000 },
          { id: 1246, order_number: 'ORD-1246', customer_name: 'Firma XYZ', status: 'in_production', order_date: '2025-02-25', required_date: '2025-03-10', total_value: 68000 },
          { id: 1245, order_number: 'ORD-1245', customer_name: 'Anna Nowak', status: 'completed', order_date: '2025-02-20', required_date: '2025-03-05', total_value: 53000 },
          { id: 1244, order_number: 'ORD-1244', customer_name: 'Mariusz Wilk', status: 'confirmed', order_date: '2025-02-18', required_date: '2025-03-12', total_value: 72000 },
        ]);

        // Sample low stock products
        setLowStockProducts([
          { id: 101, code: 'ENG-450', name: 'Silnik XJ-450', quantity_in_stock: 2, minimum_stock: 5, unit: 'szt.' },
          { id: 203, code: 'HULL-A32', name: 'Kadłub Model A32', quantity_in_stock: 3, minimum_stock: 8, unit: 'szt.' },
          { id: 374, code: 'ELEC-220', name: 'Zestaw elektryczny podstawowy', quantity_in_stock: 5, minimum_stock: 10, unit: 'szt.' },
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Błąd pobierania danych:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusChip = (status) => {
    let color = 'default';
    let label = status;

    switch (status) {
      case 'draft':
        color = 'default';
        label = 'Szkic';
        break;
      case 'confirmed':
        color = 'primary';
        label = 'Potwierdzone';
        break;
      case 'in_production':
        color = 'warning';
        label = 'W produkcji';
        break;
      case 'completed':
        color = 'success';
        label = 'Zrealizowane';
        break;
      case 'cancelled':
        color = 'error';
        label = 'Anulowane';
        break;
      default:
        break;
    }

    return <Chip size="small" color={color} label={label} />;
  };

  // Column definitions for orders table
  const orderColumns = [
    { id: 'order_number', label: 'Nr zamówienia', sortable: true },
    { id: 'customer_name', label: 'Klient', sortable: true },
    { 
      id: 'status', 
      label: 'Status', 
      sortable: true,
      render: (row) => getStatusChip(row.status)
    },
    { 
      id: 'order_date', 
      label: 'Data zamówienia', 
      sortable: true,
      render: (row) => new Date(row.order_date).toLocaleDateString('pl-PL')
    },
    { 
      id: 'required_date', 
      label: 'Wymagana data', 
      sortable: true,
      render: (row) => new Date(row.required_date).toLocaleDateString('pl-PL')
    },
    { 
      id: 'total_value', 
      label: 'Wartość', 
      sortable: true, 
      numeric: true,
      render: (row) => `${row.total_value.toLocaleString('pl-PL')} zł`
    },
    { 
      id: 'actions', 
      label: 'Akcje', 
      sortable: false,
      render: (row) => (
        <Button
          variant="outlined"
          size="small"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate(`/orders/${row.id}`)}
        >
          Szczegóły
        </Button>
      ) 
    },
  ];

  return (
    <Box>
      {/* Page Header */}
      <PageHeader
        title="Pulpit"
        subtitle="Witaj w systemie MRP do zarządzania produkcją łodzi"
        startAction={
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate('/orders')}
          >
            Nowe zamówienie
          </Button>
        }
      />

      {/* Key Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <DataCard
            title="Wszystkie zamówienia"
            value={stats.totalOrders}
            icon={<BoatIcon />}
            iconColor={theme.palette.primary.main}
            trend="up"
            trendValue="+12% (30d)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DataCard
            title="Oczekujące zamówienia"
            value={stats.pendingOrders}
            icon={<AlarmIcon />}
            iconColor={theme.palette.warning.main}
            chipLabel="Wymaga uwagi"
            chipColor="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DataCard
            title="Niski stan magazynowy"
            value={stats.lowStockItems}
            subtitle="Produktów do zamówienia"
            icon={<InventoryIcon />}
            iconColor={theme.palette.error.main}
            trend="up"
            trendValue="+3 (7d)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DataCard
            title="Zamówienia zrealizowane"
            value={stats.ordersFulfilled}
            progress={75}
            icon={<CheckCircleIcon />}
            iconColor={theme.palette.success.main}
            trend="up"
            trendValue="+8% (30d)"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Przychód i zysk
                </Typography>
                <Box>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<DateRangeIcon />}
                    sx={{ mr: 1 }}
                  >
                    Zakres
                  </Button>
                  <IconButton size="small">
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={salesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                  <YAxis stroke={theme.palette.text.secondary} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      borderColor: theme.palette.divider,
                      borderRadius: 8,
                      boxShadow: theme.shadows[3],
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Przychód"
                    stroke={theme.palette.primary.main}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    name="Zysk"
                    stroke={theme.palette.success.main}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Realizacja produkcji
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={productionData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                  <YAxis stroke={theme.palette.text.secondary} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      borderColor: theme.palette.divider,
                      borderRadius: 8,
                      boxShadow: theme.shadows[3],
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="planned"
                    name="Zaplanowane"
                    fill={theme.palette.primary.light}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="completed"
                    name="Ukończone"
                    fill={theme.palette.primary.main}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Section: Tables and Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <DataTable
            title="Ostatnie zamówienia"
            columns={orderColumns}
            data={recentOrders}
            onRowClick={(row) => navigate(`/orders/${row.id}`)}
            pagination={{
              page: 0,
              rowsPerPage: 5,
              totalCount: recentOrders.length,
            }}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="h6" fontWeight={600}>
                  Aktywność
                </Typography>
              </Box>
              <List sx={{ p: 0 }}>
                {activities.map((activity) => (
                  <React.Fragment key={activity.id}>
                    <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                      <ListItemIcon sx={{ minWidth: 42 }}>
                        <Avatar sx={{ bgcolor: 'transparent' }}>
                          {activityIcons[activity.type]}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.message}
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                              sx={{ fontWeight: 500 }}
                            >
                              {activity.user}
                            </Typography>
                            {` — ${activity.time}`}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider component="li" variant="inset" />
                  </React.Fragment>
                ))}
              </List>
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Button 
                  variant="text" 
                  size="small" 
                  endIcon={<ArrowForwardIcon />}
                >
                  Zobacz wszystkie
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
