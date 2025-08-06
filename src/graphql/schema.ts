import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  scalar DateTime

  type Building {
    id: ID!
    name: String!
    address: String!
    totalFloors: Int!
    description: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type ApartmentOwner {
    id: ID!
    name: String!
    email: String!
    apartmentNumber: String!
    buildingId: ID
    building: Building
    phoneNumber: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Payment {
    id: ID!
    apartmentOwnerId: ID!
    apartmentOwner: ApartmentOwner
    amount: Float!
    month: String!
    description: String
    paymentDate: DateTime!
    status: PaymentStatus!
    createdAt: DateTime!
    updatedAt: DateTime!
  }


  enum PaymentStatus {
    pending
    paid
    overdue
  }

  input CreateBuildingInput {
    name: String!
    address: String!
    totalFloors: Int!
    description: String
  }

  input UpdateBuildingInput {
    name: String
    address: String
    totalFloors: Int
    description: String
  }

  input CreateApartmentOwnerInput {
    name: String!
    email: String!
    apartmentNumber: String!
    buildingId: ID
    phoneNumber: String
  }

  input UpdateApartmentOwnerInput {
    name: String
    email: String
    apartmentNumber: String
    buildingId: ID
    phoneNumber: String
  }

  input CreatePaymentInput {
    apartmentOwnerId: ID!
    amount: Float!
    month: String!
    description: String
    status: PaymentStatus
  }

  input UpdatePaymentInput {
    amount: Float
    month: String
    description: String
    status: PaymentStatus
  }

  type Query {
    # Building queries
    buildings: [Building!]!
    building(id: ID!): Building
    buildingByName(name: String!): Building

    # Apartment Owner queries
    apartmentOwners: [ApartmentOwner!]!
    apartmentOwner(id: ID!): ApartmentOwner
    apartmentOwnerByEmail(email: String!): ApartmentOwner
    apartmentOwnerByApartmentNumber(apartmentNumber: String!): ApartmentOwner
    apartmentOwnersByBuilding(buildingId: ID!): [ApartmentOwner!]!

    # Payment queries
    payments: [Payment!]!
    payment(id: ID!): Payment
    paymentsByApartmentOwner(apartmentOwnerId: ID!): [Payment!]!
    paymentsByMonth(month: String!): [Payment!]!
    paymentsByStatus(status: PaymentStatus!): [Payment!]!
  }

  type Mutation {
    # Building mutations
    createBuilding(input: CreateBuildingInput!): Building!
    updateBuilding(id: ID!, input: UpdateBuildingInput!): Building!
    deleteBuilding(id: ID!): Boolean!

    # Apartment Owner mutations
    createApartmentOwner(input: CreateApartmentOwnerInput!): ApartmentOwner!
    updateApartmentOwner(id: ID!, input: UpdateApartmentOwnerInput!): ApartmentOwner!
    deleteApartmentOwner(id: ID!): Boolean!

    # Payment mutations
    createPayment(input: CreatePaymentInput!): Payment!
    updatePayment(id: ID!, input: UpdatePaymentInput!): Payment!
    deletePayment(id: ID!): Boolean!
  }
`; 