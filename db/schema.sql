-- PostgreSQL schema for POC Vite CRUD application

CREATE TABLE IF NOT EXISTS "Comps" (
  id               SERIAL PRIMARY KEY,
  "PropertyName"   TEXT,
  "Address"        TEXT,
  "CityMunicipality" TEXT,
  "County"         TEXT,
  "State"          TEXT,
  "ZipCode"        TEXT,
  "ZoningDescription" TEXT,
  "Seller"         TEXT,
  "Buyer"          TEXT,
  "SaleDate"       DATE,
  "SalePrice"      NUMERIC(15, 2),
  "NumberOfAcres"  NUMERIC(10, 4),
  "NumberOfUnits"  INTEGER,
  "PricePerAcre"   NUMERIC(15, 2),
  "PricePerUnit"   NUMERIC(15, 2),
  "SaleRemarks"    TEXT,
  "PropertyRemarks" TEXT,
  "Latitude"       NUMERIC(10, 7),
  "Longitude"      NUMERIC(10, 7)
);
