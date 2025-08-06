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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Apartment as ApartmentIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { gql } from '@apollo/client';

const GET_BUILDINGS = gql`
  query GetBuildings {
    buildings {
      id
      name
      address
      totalFloors
      description
      createdAt
      updatedAt
    }
  }
`;

const CREATE_BUILDING = gql`
  mutation CreateBuilding($input: CreateBuildingInput!) {
    createBuilding(input: $input) {
      id
      name
      address
      totalFloors
      description
      createdAt
    }
  }
`;

const UPDATE_BUILDING = gql`
  mutation UpdateBuilding($id: ID!, $input: UpdateBuildingInput!) {
    updateBuilding(id: $id, input: $input) {
      id
      name
      address
      totalFloors
      description
      updatedAt
    }
  }
`;

const DELETE_BUILDING = gql`
  mutation DeleteBuilding($id: ID!) {
    deleteBuilding(id: $id)
  }
`;

interface Building {
  id: string;
  name: string;
  address: string;
  totalFloors: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface BuildingFormData {
  name: string;
  address: string;
  totalFloors: string;
  description: string;
}

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Not set';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('Invalid date string:', dateString);
      return 'Invalid date';
    }
    
    // Adjust for timezone offset and format
    const adjustedDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    
    return adjustedDate.toLocaleString('en-GB', {
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

const Buildings: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [formData, setFormData] = useState<BuildingFormData>({
    name: '',
    address: '',
    totalFloors: '',
    description: '',
  });

  const { loading, error, data, refetch } = useQuery(GET_BUILDINGS);
  const [createBuilding] = useMutation(CREATE_BUILDING);
  const [updateBuilding] = useMutation(UPDATE_BUILDING);
  const [deleteBuilding] = useMutation(DELETE_BUILDING);

  const handleOpenDialog = (building?: Building) => {
    if (building) {
      setEditingBuilding(building);
      setFormData({
        name: building.name,
        address: building.address,
        totalFloors: building.totalFloors.toString(),
        description: building.description || '',
      });
    } else {
      setEditingBuilding(null);
      setFormData({
        name: '',
        address: '',
        totalFloors: '',
        description: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBuilding(null);
    setFormData({
      name: '',
      address: '',
      totalFloors: '',
      description: '',
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingBuilding) {
        await updateBuilding({
          variables: {
            id: editingBuilding.id,
            input: {
              name: formData.name,
              address: formData.address,
              totalFloors: parseInt(formData.totalFloors),
              description: formData.description,
            },
          },
        });
      } else {
        await createBuilding({
          variables: {
            input: {
              name: formData.name,
              address: formData.address,
              totalFloors: parseInt(formData.totalFloors),
              description: formData.description,
            },
          },
        });
      }
      refetch();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving building:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this building?')) {
      try {
        await deleteBuilding({
          variables: { id },
        });
        refetch();
      } catch (error) {
        console.error('Error deleting building:', error);
      }
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
        Error loading buildings: {error.message}
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Buildings</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Building
        </Button>
      </Box>

      <Grid container spacing={3}>
        {data?.buildings.map((building: Building) => (
          <Grid item xs={12} sm={6} md={4} key={building.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {building.name}
                </Typography>
                
                <Box display="flex" alignItems="center" mb={1}>
                  <LocationIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="textSecondary">
                    {building.address}
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center" mb={1}>
                  <ApartmentIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="textSecondary">
                    {building.totalFloors} floors
                  </Typography>
                </Box>
                
                {building.description && (
                  <Box display="flex" alignItems="flex-start" mb={1}>
                    <DescriptionIcon fontSize="small" sx={{ mr: 1, mt: 0.2 }} />
                    <Typography variant="body2" color="textSecondary">
                      {building.description}
                    </Typography>
                  </Box>
                )}
                
                <Typography variant="caption" color="textSecondary">
                  Created: {formatDate(building.createdAt)}
                </Typography>
                <Typography variant="caption" color="textSecondary" display="block">
                  Updated: {formatDate(building.updatedAt)}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog(building)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(building.id)}
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
          {editingBuilding ? 'Edit Building' : 'Add New Building'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Building Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Total Floors"
                type="number"
                value={formData.totalFloors}
                onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
                InputProps={{
                  startAdornment: <ApartmentIcon sx={{ mr: 1 }} />,
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
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingBuilding ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Buildings; 