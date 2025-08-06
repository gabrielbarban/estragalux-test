// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the condominium-manager database
db = db.getSiblingDB('condominium-manager');

// Create buildings collection with validation
db.createCollection('buildings', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "address", "totalFloors"],
      properties: {
        name: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        address: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        totalFloors: {
          bsonType: "number",
          minimum: 1,
          description: "must be a number >= 1 and is required"
        },
        description: {
          bsonType: "string",
          description: "must be a string if present"
        }
      }
    }
  }
});

// Create collections with validation
db.createCollection('apartmentowners', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "apartmentNumber"],
      properties: {
        name: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "must be a valid email and is required"
        },
        apartmentNumber: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        buildingId: {
          bsonType: "objectId",
          description: "must be an objectId if present"
        },
        phoneNumber: {
          bsonType: "string",
          description: "must be a string if present"
        }
      }
    }
  }
});

db.createCollection('payments', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["apartmentOwnerId", "amount", "month"],
      properties: {
        apartmentOwnerId: {
          bsonType: "objectId",
          description: "must be an objectId and is required"
        },
        amount: {
          bsonType: "number",
          minimum: 0,
          description: "must be a number >= 0 and is required"
        },
        month: {
          bsonType: "string",
          pattern: "^\\d{4}-\\d{2}$",
          description: "must be in YYYY-MM format and is required"
        },
        description: {
          bsonType: "string",
          description: "must be a string if present"
        },
        status: {
          enum: ["pending", "paid", "overdue"],
          description: "must be one of the enum values"
        }
      }
    }
  }
});

// Create indexes for better performance
db.buildings.createIndex({ "name": 1 }, { unique: true });
db.apartmentowners.createIndex({ "email": 1 }, { unique: true });
db.apartmentowners.createIndex({ "apartmentNumber": 1 }, { unique: true });
db.apartmentowners.createIndex({ "buildingId": 1 });
db.payments.createIndex({ "apartmentOwnerId": 1 });
db.payments.createIndex({ "month": 1 });
db.payments.createIndex({ "status": 1 });

// Insert sample buildings
db.buildings.insertMany([
  {
    name: "Sunset Towers",
    address: "123 Sunset Boulevard, Los Angeles, CA 90210",
    totalFloors: 15,
    description: "Luxury residential building with ocean views",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Parkview Apartments",
    address: "456 Park Avenue, New York, NY 10022",
    totalFloors: 12,
    description: "Modern apartment complex in the heart of Manhattan",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Get the inserted buildings for creating apartment owners
const buildings = db.buildings.find({}).toArray();

// Insert some sample data (optional)
db.apartmentowners.insertMany([
  {
    name: "John Doe",
    email: "john.doe@example.com",
    apartmentNumber: "A101",
    buildingId: buildings[0]._id,
    phoneNumber: "+1234567890",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    apartmentNumber: "A102",
    buildingId: buildings[0]._id,
    phoneNumber: "+0987654321",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    apartmentNumber: "B201",
    buildingId: buildings[1]._id,
    phoneNumber: "+1122334455",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Get the inserted apartment owners for creating sample payments
const owners = db.apartmentowners.find({}).toArray();

if (owners.length > 0) {
  db.payments.insertMany([
    {
      apartmentOwnerId: owners[0]._id,
      amount: 500.00,
      month: "2024-01",
      description: "January maintenance fee",
      status: "paid",
      paymentDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      apartmentOwnerId: owners[1]._id,
      amount: 500.00,
      month: "2024-01",
      description: "January maintenance fee",
      status: "pending",
      paymentDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
}

print("✅ MongoDB initialization completed successfully!");
print("📊 Database: condominium-manager");
print("📋 Collections: buildings, apartmentowners, payments");
print("🔍 Indexes created for better performance");
print("📝 Sample data inserted"); 