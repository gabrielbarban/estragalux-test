import React from 'react';
import { useQuery } from '@apollo/client';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  People as PeopleIcon,
  Payment as PaymentIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { gql } from '@apollo/client';

const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    apartmentOwners {
      id
      name
      apartmentNumber
    }
    payments {
      id
      amount
      status
      month
    }
  }
`;

interface DashboardData {
  apartmentOwners: Array<{
    id: string;
    name: string;
    apartmentNumber: string;
  }>;
  payments: Array<{
    id: string;
    amount: number;
    status: string;
    month: string;
  }>;
}

const Dashboard: React.FC = () => {
  const { loading, error, data } = useQuery<DashboardData>(GET_DASHBOARD_DATA);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading dashboard data: {error.message}
      </Alert>
    );
  }

  const totalOwners = data?.apartmentOwners.length || 0;
  const totalPayments = data?.payments.length || 0;
  const totalAmount = data?.payments.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  const paidPayments = data?.payments.filter(payment => payment.status === 'paid').length || 0;
  const pendingPayments = data?.payments.filter(payment => payment.status === 'pending').length || 0;

  // Prepare chart data
  const monthlyData = data?.payments.reduce((acc, payment) => {
    const month = payment.month;
    if (!acc[month]) {
      acc[month] = { month, total: 0, paid: 0, pending: 0 };
    }
    acc[month].total += payment.amount;
    if (payment.status === 'paid') {
      acc[month].paid += payment.amount;
    } else if (payment.status === 'pending') {
      acc[month].pending += payment.amount;
    }
    return acc;
  }, {} as Record<string, { month: string; total: number; paid: number; pending: number }>) || {};

  const chartData = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PeopleIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Owners
                  </Typography>
                  <Typography variant="h4">
                    {totalOwners}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PaymentIcon color="secondary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Payments
                  </Typography>
                  <Typography variant="h4">
                    {totalPayments}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <MoneyIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Amount
                  </Typography>
                  <Typography variant="h4">
                    ${totalAmount.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUpIcon color="info" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Paid Payments
                  </Typography>
                  <Typography variant="h4">
                    {paidPayments}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Payment Overview
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="paid" fill="#4caf50" name="Paid" />
                  <Bar dataKey="pending" fill="#ff9800" name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment Status
              </Typography>
              <Box>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Paid: {paidPayments} ({totalPayments > 0 ? Math.round((paidPayments / totalPayments) * 100) : 0}%)
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Pending: {pendingPayments} ({totalPayments > 0 ? Math.round((pendingPayments / totalPayments) * 100) : 0}%)
                </Typography>
                <Typography variant="body1">
                  Overdue: {totalPayments - paidPayments - pendingPayments} ({totalPayments > 0 ? Math.round(((totalPayments - paidPayments - pendingPayments) / totalPayments) * 100) : 0}%)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 