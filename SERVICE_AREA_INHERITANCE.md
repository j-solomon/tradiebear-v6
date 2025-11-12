# Service Area Inheritance System

## Overview

The Service Area Inheritance System allows service areas to be defined at the **service level** and automatically inherited by all sub-services within that service category. Sub-services can then add **exclusions** (areas to remove from the inherited set) or **inclusions** (additional areas specific to that sub-service).

## Key Concepts

### Area Types

The system uses three types of service areas:

1. **`service_default`** - Areas defined at the service level that all sub-services inherit
2. **`sub_service_inclusion`** - Additional areas specific to a sub-service
3. **`sub_service_exclusion`** - Areas to remove from the inherited set for a specific sub-service

### Inheritance Flow

```
Service: Roofing
  └─ Areas: Portland, Seattle, Vancouver (service_default)
     └─ Sub-Service: Roof Repair
        ├─ Inherits: Portland, Seattle, Vancouver
        ├─ Exclusions: Seattle (sub_service_exclusion)
        ├─ Inclusions: Tacoma (sub_service_inclusion)
        └─ Effective Areas: Portland, Vancouver, Tacoma
```

## Database Schema

### service_area_map Table

```sql
CREATE TABLE service_area_map (
  id UUID PRIMARY KEY,
  service_id UUID REFERENCES services(id),      -- Set for service-level areas
  sub_service_id UUID REFERENCES sub_services(id), -- Set for sub-service areas
  area_type area_type NOT NULL,                 -- Type of area entry
  state_code TEXT,
  zip_code TEXT,
  state_id UUID REFERENCES states(id),
  county_id UUID REFERENCES counties(id),
  city_id UUID REFERENCES cities(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### area_type Enum

```sql
CREATE TYPE area_type AS ENUM (
  'service_default',           -- Service-level area
  'sub_service_inclusion',     -- Add to sub-service
  'sub_service_exclusion'      -- Remove from sub-service
);
```

## Database Functions

### get_effective_service_areas(p_sub_service_id UUID)

Returns the effective list of service areas for a given sub-service, taking into account:
- Parent service default areas
- Sub-service exclusions
- Sub-service inclusions

**Usage:**

```sql
-- Get effective areas for a sub-service
SELECT * FROM get_effective_service_areas('sub-service-uuid-here');
```

**Returns:**

```
id | state_code | zip_code | state_id | county_id | city_id | area_source
---|------------|----------|----------|-----------|---------|-------------
... | OR         | 97201    | ...      | ...       | ...     | inherited
... | WA         | 98001    | ...      | ...       | ...     | added
```

### service_areas_effective View

A convenient view that joins effective areas with geographic lookup tables:

```sql
CREATE OR REPLACE VIEW service_areas_effective AS
SELECT 
  ss.id as sub_service_id,
  ss.name as sub_service_name,
  ss.service_id,
  s.name as service_name,
  esa.id as area_id,
  esa.state_code,
  esa.zip_code,
  esa.area_source,
  st.name as state_name,
  co.name as county_name,
  ci.name as city_name
FROM sub_services ss
JOIN services s ON ss.service_id = s.id
CROSS JOIN LATERAL get_effective_service_areas(ss.id) esa
LEFT JOIN states st ON esa.state_id = st.id
LEFT JOIN counties co ON esa.county_id = co.id
LEFT JOIN cities ci ON esa.city_id = ci.id;
```

## Common Use Cases

### 1. Add Service-Level Areas

All sub-services under this service will automatically inherit these areas:

```sql
INSERT INTO service_area_map (service_id, area_type, state_code, zip_code)
VALUES 
  ('roofing-service-uuid', 'service_default', 'OR', '97201'),
  ('roofing-service-uuid', 'service_default', 'WA', '98001');
```

### 2. Add Sub-Service Specific Area

Add an area that only applies to one sub-service:

```sql
INSERT INTO service_area_map (sub_service_id, area_type, state_code, zip_code)
VALUES 
  ('roof-repair-uuid', 'sub_service_inclusion', 'WA', '98052');
```

### 3. Exclude Area from Sub-Service

Remove an inherited area from a specific sub-service:

```sql
INSERT INTO service_area_map (sub_service_id, area_type, state_code, zip_code)
VALUES 
  ('roof-repair-uuid', 'sub_service_exclusion', 'OR', '97201');
```

### 4. Query Effective Areas

Get all effective areas for a sub-service:

```sql
-- Using function
SELECT * FROM get_effective_service_areas('sub-service-uuid');

-- Using view (includes geographic names)
SELECT * FROM service_areas_effective 
WHERE sub_service_id = 'sub-service-uuid';
```

### 5. Count Areas by Type

```sql
SELECT 
  area_type,
  COUNT(*) as count
FROM service_area_map
WHERE service_id = 'service-uuid' OR sub_service_id IN (
  SELECT id FROM sub_services WHERE service_id = 'service-uuid'
)
GROUP BY area_type;
```

## Admin UI Usage

### Managing Service Areas

1. **Navigate to Services & Pricing** tab
2. **Expand a service** to view sub-services
3. **Click "Manage Service Areas"** (service-level) to set default areas for all sub-services
4. **Click "Manage Areas"** (sub-service row) to add exclusions or inclusions

### Service-Level Area Management

When managing areas at the service level:
- All areas are marked as `service_default`
- All sub-services automatically inherit these areas
- A counter shows how many sub-services will be affected

### Sub-Service Area Management

When managing areas at the sub-service level:
- **Inherited Areas** section shows areas from parent service (read-only)
- **Exclusions** section allows removing inherited areas
- **Additional Areas** section allows adding new areas specific to this sub-service

## Examples

### Example 1: Plumbing Service

```sql
-- Service: Plumbing covers Portland and Seattle
INSERT INTO service_area_map (service_id, area_type, state_code, zip_code)
VALUES 
  ('plumbing-uuid', 'service_default', 'OR', '97201'),
  ('plumbing-uuid', 'service_default', 'WA', '98101');

-- Sub-Service: Emergency Plumbing also covers Tacoma
INSERT INTO service_area_map (sub_service_id, area_type, state_code, zip_code)
VALUES 
  ('emergency-plumbing-uuid', 'sub_service_inclusion', 'WA', '98401');

-- Result: Emergency Plumbing serves Portland, Seattle, and Tacoma
```

### Example 2: HVAC Service with Exclusion

```sql
-- Service: HVAC covers entire state
INSERT INTO service_area_map (service_id, area_type, state_code)
VALUES 
  ('hvac-uuid', 'service_default', 'OR');

-- Sub-Service: Commercial HVAC excludes rural areas
INSERT INTO service_area_map (sub_service_id, area_type, zip_code)
VALUES 
  ('commercial-hvac-uuid', 'sub_service_exclusion', '97801');

-- Result: Commercial HVAC serves OR state except zip 97801
```

## Performance Considerations

### Indexes

The following indexes are automatically created:

```sql
CREATE INDEX idx_service_area_map_service_id ON service_area_map(service_id);
CREATE INDEX idx_service_area_map_sub_service_id ON service_area_map(sub_service_id);
CREATE INDEX idx_service_area_map_area_type ON service_area_map(area_type);
```

### Query Optimization

- The `get_effective_service_areas()` function is marked as `STABLE` for query optimization
- Use the `service_areas_effective` view for read-heavy operations
- Consider materialized views if you have 10,000+ area records and queries are slow

## Troubleshooting

### Issue: Sub-service not inheriting areas

**Check:**
1. Verify parent service has `service_default` areas:
   ```sql
   SELECT * FROM service_area_map WHERE service_id = 'parent-service-uuid';
   ```
2. Confirm sub-service is linked to correct service:
   ```sql
   SELECT service_id FROM sub_services WHERE id = 'sub-service-uuid';
   ```

### Issue: Exclusion not working

**Check:**
1. Verify exclusion matches exactly (state_code, zip_code, etc.):
   ```sql
   SELECT * FROM service_area_map 
   WHERE sub_service_id = 'sub-service-uuid' 
   AND area_type = 'sub_service_exclusion';
   ```

### Issue: Duplicate areas showing

**Check:**
1. Look for duplicate entries:
   ```sql
   SELECT state_code, zip_code, COUNT(*)
   FROM service_area_map
   WHERE sub_service_id = 'sub-service-uuid'
   GROUP BY state_code, zip_code
   HAVING COUNT(*) > 1;
   ```

## Migration from Old System

If migrating from the old single-table approach:

```sql
-- All existing areas become sub-service inclusions
UPDATE service_area_map 
SET area_type = 'sub_service_inclusion'
WHERE area_type IS NULL AND sub_service_id IS NOT NULL;
```

## Best Practices

1. **Define broad areas at service level** - Set common coverage at the parent level
2. **Use exclusions sparingly** - Only exclude when necessary; consider creating separate sub-services instead
3. **Document special cases** - Use database comments for complex inheritance scenarios
4. **Test inheritance** - Always verify effective areas after making changes
5. **Monitor performance** - Watch query times as area count grows

## Related Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - Full deployment guide including database setup
- [ADMIN_DASHBOARD_IMPLEMENTATION.md](ADMIN_DASHBOARD_IMPLEMENTATION.md) - Admin dashboard features and metrics

