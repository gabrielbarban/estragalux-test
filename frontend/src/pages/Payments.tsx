import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { gql } from '@apollo/client';

const GET_PAYMENTS = gql`
  query GetPayments {
    payments {
      id
      amount
      month
      description
      paymentDate
      status
      apartmentOwner {
        id
        name
        apartmentNumber
      }
      createdAt
      updatedAt
    }
  }
`;

const GET_APARTMENT_OWNERS = gql`
  query GetApartmentOwners {
    apartmentOwners {
      id
      name
      apartmentNumber
    }
  }
`;

const CREATE_PAYMENT = gql`
  mutation CreatePayment($input: CreatePaymentInput!) {
    createPayment(input: $input) {
      id
      amount
      month
      description
      paymentDate
      status
      apartmentOwner {
        id
        name
        apartmentNumber
      }
      createdAt
    }
  }
`;

const UPDATE_PAYMENT = gql`
  mutation UpdatePayment($id: ID!, $input: UpdatePaymentInput!) {
    updatePayment(id: $id, input: $input) {
      id
      amount
      month
      description
      paymentDate
      status
      apartmentOwner {
        id
        name
        apartmentNumber
      }
      updatedAt
    }
  }
`;

const DELETE_PAYMENT = gql`
  mutation DeletePayment($id: ID!) {
    deletePayment(id: $id)
  }
`;

interface ApartmentOwner {
  id: string;
  name: string;
  apartmentNumber: string;
}

interface Payment {
  id: string;
  amount: number;
  month: string;
  description?: string;
  paymentDate: string;
  status: 'pending' | 'paid' | 'overdue';
  apartmentOwner: ApartmentOwner;
  createdAt: string;
  updatedAt: string;
}

interface PaymentFormData {
  apartmentOwnerId: string;
  amount: string;
  month: string;
  description: string;
  status: 'pending' | 'paid' | 'overdue';
}

const PaymentStatusChip: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Chip
      label={status.charAt(0).toUpperCase() + status.slice(1)}
      color={getStatusColor(status) as any}
      size="small"
    />
  );
};

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Not set';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('Invalid date string:', dateString);
      return 'Invalid date';
    }
    
    return date.toLocaleString('pt-PT', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Date parsing error:', error);
    return 'Invalid date';
  }
};

const Payments: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [formData, setFormData] = useState<PaymentFormData>({
    apartmentOwnerId: '',
    amount: '',
    month: '',
    description: '',
    status: 'pending',
  });

  const { loading, error, data, refetch } = useQuery(GET_PAYMENTS);
  const { data: ownersData } = useQuery(GET_APARTMENT_OWNERS);
  const [createPayment] = useMutation(CREATE_PAYMENT);
  const [updatePayment] = useMutation(UPDATE_PAYMENT);
  const [deletePayment] = useMutation(DELETE_PAYMENT);

  const handleOpenDialog = (payment?: Payment) => {
    if (payment) {
      setEditingPayment(payment);
      setFormData({
        apartmentOwnerId: payment.apartmentOwner.id,
        amount: payment.amount.toString(),
        month: payment.month,
        description: payment.description || '',
        status: payment.status,
      });
    } else {
      setEditingPayment(null);
      setFormData({
        apartmentOwnerId: '',
        amount: '',
        month: '',
        description: '',
        status: 'pending',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPayment(null);
    setFormData({
      apartmentOwnerId: '',
      amount: '',
      month: '',
      description: '',
      status: 'pending',
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingPayment) {
        // FIXED: Removed apartmentOwnerId from update mutation
        console.log('Updating payment with input:', {
          id: editingPayment.id,
          input: {
            amount: parseFloat(formData.amount),
            month: formData.month,
            description: formData.description,
            status: formData.status,
          },
        });
        
        await updatePayment({
          variables: {
            id: editingPayment.id,
            input: {
              amount: parseFloat(formData.amount),
              month: formData.month,
              description: formData.description,
              status: formData.status,
            },
          },
        });
      } else {
        console.log('Creating payment with input:', {
          input: {
            apartmentOwnerId: formData.apartmentOwnerId,
            amount: parseFloat(formData.amount),
            month: formData.month,
            description: formData.description,
            status: formData.status,
          },
        });
        
        await createPayment({
          variables: {
            input: {
              apartmentOwnerId: formData.apartmentOwnerId,
              amount: parseFloat(formData.amount),
              month: formData.month,
              description: formData.description,
              status: formData.status,
            },
          },
        });
      }
      refetch();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving payment:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await deletePayment({
          variables: { id },
        });
        refetch();
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success.main';
      case 'pending':
        return 'warning.main';
      case 'overdue':
        return 'error.main';
      default:
        return 'text.secondary';
    }
  };

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
        Error loading payments: {error.message}
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Payments</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Payment
        </Button>
      </Box>

      <Grid container spacing={3}>
        {data?.payments.map((payment: Payment) => (
          <Grid item xs={12} sm={6} md={4} key={payment.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6" color="primary">
                    ${payment.amount.toFixed(2)}
                  </Typography>
                  <PaymentStatusChip status={payment.status} />
                </Box>
                
                <Box display="flex" alignItems="center" mb={1}>
                  <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="textSecondary">
                    {payment.apartmentOwner.name} (Apt {payment.apartmentOwner.apartmentNumber})
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center" mb={1}>
                  <CalendarIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="textSecondary">
                    {payment.month}
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center" mb={1}>
                  <CalendarIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="textSecondary">
                    Payment Date: {formatDate(payment.paymentDate)}
                  </Typography>
                </Box>
                
                {payment.description && (
                  <Typography variant="body2" color="textSecondary" mb={1}>
                    {payment.description}
                  </Typography>
                )}
                
                <Typography variant="caption" color="textSecondary">
                  Created: {formatDate(payment.createdAt)}
                </Typography>
                <Typography variant="caption" color="textSecondary" display="block">
                  Updated: {formatDate(payment.updatedAt)}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog(payment)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(payment.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingPayment ? 'Edit Payment' : 'Add New Payment'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Apartment Owner</InputLabel>
                <Select
                  value={formData.apartmentOwnerId}
                  label="Apartment Owner"
                  onChange={(e: SelectChangeEvent) => setFormData({ ...formData, apartmentOwnerId: e.target.value })}
                >
                  {ownersData?.apartmentOwners.map((owner: ApartmentOwner) => (
                    <MenuItem key={owner.id} value={owner.id}>
                      {owner.name} (Apt {owner.apartmentNumber})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                InputProps={{
                  startAdornment: <MoneyIcon sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Month (YYYY-MM)"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                placeholder="2024-01"
                InputProps={{
                  startAdornment: <CalendarIcon sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e: SelectChangeEvent) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="overdue">Overdue</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingPayment ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payments; 