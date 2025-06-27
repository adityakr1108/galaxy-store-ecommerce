
interface SQLiteTable {
  name: string;
  data: any[];
  schema: Record<string, string>;
}

class SQLiteEmulator {
  private tables: Map<string, SQLiteTable> = new Map();
  private storagePrefix = 'galaxy_store_sqlite_';

  constructor() {
    this.initializeTables();
    this.loadFromStorage();
  }

  private initializeTables() {
    // Define table schemas
    const schemas = {
      users: {
        id: 'TEXT PRIMARY KEY',
        name: 'TEXT',
        email: 'TEXT UNIQUE',
        password: 'TEXT',
        isPremium: 'BOOLEAN',
        isAdmin: 'BOOLEAN',
        createdAt: 'TEXT'
      },
      products: {
        id: 'TEXT PRIMARY KEY',
        name: 'TEXT',
        description: 'TEXT',
        price: 'REAL',
        category: 'TEXT',
        brand: 'TEXT',
        imageUrl: 'TEXT',
        images: 'TEXT',
        rating: 'REAL',
        reviewCount: 'INTEGER',
        inStock: 'BOOLEAN',
        stock: 'INTEGER',
        isPremiumExclusive: 'BOOLEAN',
        isTrending: 'BOOLEAN',
        tags: 'TEXT',
        specifications: 'TEXT'
      },
      orders: {
        id: 'TEXT PRIMARY KEY',
        userId: 'TEXT',
        items: 'TEXT',
        subtotal: 'REAL',
        discount: 'REAL',
        shippingCost: 'REAL',
        total: 'REAL',
        couponCode: 'TEXT',
        status: 'TEXT',
        createdAt: 'TEXT',
        shippingAddress: 'TEXT',
        location: 'TEXT',
        estimatedDelivery: 'TEXT'
      },
      coupons: {
        code: 'TEXT PRIMARY KEY',
        type: 'TEXT',
        value: 'REAL',
        description: 'TEXT',
        isActive: 'BOOLEAN',
        expiresAt: 'TEXT'
      },
      reviews: {
        id: 'TEXT PRIMARY KEY',
        productId: 'TEXT',
        userId: 'TEXT',
        userName: 'TEXT',
        rating: 'INTEGER',
        comment: 'TEXT',
        createdAt: 'TEXT'
      }
    };

    Object.entries(schemas).forEach(([tableName, schema]) => {
      this.tables.set(tableName, {
        name: tableName,
        data: [],
        schema
      });
    });
  }

  private loadFromStorage() {
    this.tables.forEach((table, tableName) => {
      const stored = localStorage.getItem(`${this.storagePrefix}${tableName}`);
      if (stored) {
        table.data = JSON.parse(stored);
      }
    });
  }

  private saveToStorage(tableName: string) {
    const table = this.tables.get(tableName);
    if (table) {
      localStorage.setItem(`${this.storagePrefix}${tableName}`, JSON.stringify(table.data));
    }
  }

  // SQL-like query interface
  query(sql: string): any[] {
    const trimmedSql = sql.trim().toUpperCase();
    
    if (trimmedSql.startsWith('SELECT')) {
      return this.executeSelect(sql);
    } else if (trimmedSql.startsWith('INSERT')) {
      return this.executeInsert(sql);
    } else if (trimmedSql.startsWith('UPDATE')) {
      return this.executeUpdate(sql);
    } else if (trimmedSql.startsWith('DELETE')) {
      return this.executeDelete(sql);
    }
    
    throw new Error(`Unsupported SQL operation: ${sql}`);
  }

  private executeSelect(sql: string): any[] {
    // Simple SELECT parser - supports basic queries
    const selectMatch = sql.match(/SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?/i);
    if (!selectMatch) throw new Error('Invalid SELECT syntax');

    const [, columns, tableName, whereClause] = selectMatch;
    const table = this.tables.get(tableName.toLowerCase());
    if (!table) throw new Error(`Table ${tableName} not found`);

    let results = [...table.data];

    // Apply WHERE clause if present
    if (whereClause) {
      results = this.applyWhereClause(results, whereClause);
    }

    // Apply column selection
    if (columns.trim() !== '*') {
      const selectedColumns = columns.split(',').map(col => col.trim());
      results = results.map(row => {
        const filteredRow: any = {};
        selectedColumns.forEach(col => {
          if (row.hasOwnProperty(col)) {
            filteredRow[col] = row[col];
          }
        });
        return filteredRow;
      });
    }

    return results;
  }

  private executeInsert(sql: string): any[] {
    const insertMatch = sql.match(/INSERT\s+INTO\s+(\w+)\s+\((.+?)\)\s+VALUES\s+\((.+?)\)/i);
    if (!insertMatch) throw new Error('Invalid INSERT syntax');

    const [, tableName, columnsStr, valuesStr] = insertMatch;
    const table = this.tables.get(tableName.toLowerCase());
    if (!table) throw new Error(`Table ${tableName} not found`);

    const columns = columnsStr.split(',').map(col => col.trim());
    const values = valuesStr.split(',').map(val => val.trim().replace(/['"]/g, ''));

    const newRow: any = {};
    columns.forEach((col, index) => {
      newRow[col] = values[index];
    });

    table.data.push(newRow);
    this.saveToStorage(tableName.toLowerCase());
    return [newRow];
  }

  private executeUpdate(sql: string): any[] {
    const updateMatch = sql.match(/UPDATE\s+(\w+)\s+SET\s+(.+?)(?:\s+WHERE\s+(.+))?/i);
    if (!updateMatch) throw new Error('Invalid UPDATE syntax');

    const [, tableName, setClause, whereClause] = updateMatch;
    const table = this.tables.get(tableName.toLowerCase());
    if (!table) throw new Error(`Table ${tableName} not found`);

    let rowsToUpdate = [...table.data];
    if (whereClause) {
      rowsToUpdate = this.applyWhereClause(rowsToUpdate, whereClause);
    }

    // Parse SET clause
    const setPairs = setClause.split(',').map(pair => {
      const [key, value] = pair.split('=').map(s => s.trim());
      return { key, value: value.replace(/['"]/g, '') };
    });

    rowsToUpdate.forEach(row => {
      setPairs.forEach(({ key, value }) => {
        row[key] = value;
      });
    });

    this.saveToStorage(tableName.toLowerCase());
    return rowsToUpdate;
  }

  private executeDelete(sql: string): any[] {
    const deleteMatch = sql.match(/DELETE\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?/i);
    if (!deleteMatch) throw new Error('Invalid DELETE syntax');

    const [, tableName, whereClause] = deleteMatch;
    const table = this.tables.get(tableName.toLowerCase());
    if (!table) throw new Error(`Table ${tableName} not found`);

    let rowsToDelete: any[] = [];
    if (whereClause) {
      rowsToDelete = this.applyWhereClause(table.data, whereClause);
      table.data = table.data.filter(row => !rowsToDelete.includes(row));
    } else {
      rowsToDelete = [...table.data];
      table.data = [];
    }

    this.saveToStorage(tableName.toLowerCase());
    return rowsToDelete;
  }

  private applyWhereClause(data: any[], whereClause: string): any[] {
    // Simple WHERE clause parser - supports basic equality
    const whereMatch = whereClause.match(/(\w+)\s*=\s*['"]?([^'"]+)['"]?/);
    if (!whereMatch) return data;

    const [, column, value] = whereMatch;
    return data.filter(row => row[column] === value);
  }

  // Export all data to CSV
  exportToCSV(tableName: string): string {
    const table = this.tables.get(tableName);
    if (!table || table.data.length === 0) return '';

    const headers = Object.keys(table.data[0]);
    const csvRows = [headers.join(',')];

    table.data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      });
      csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
  }

  // Sync with existing localStorage database
  syncWithLocalStorage() {
    // Import from existing localStorage
    const existingProducts = JSON.parse(localStorage.getItem('galaxy_store_products') || '[]');
    const existingUsers = JSON.parse(localStorage.getItem('galaxy_store_users') || '[]');
    const existingOrders = JSON.parse(localStorage.getItem('galaxy_store_orders') || '[]');
    const existingCoupons = JSON.parse(localStorage.getItem('galaxy_store_coupons') || '[]');
    const existingReviews = JSON.parse(localStorage.getItem('galaxy_store_reviews') || '[]');

    this.tables.get('products')!.data = existingProducts;
    this.tables.get('users')!.data = existingUsers;
    this.tables.get('orders')!.data = existingOrders;
    this.tables.get('coupons')!.data = existingCoupons;
    this.tables.get('reviews')!.data = existingReviews;

    // Save to SQLite storage
    this.tables.forEach((_, tableName) => {
      this.saveToStorage(tableName);
    });

    console.log('✅ Data synced with SQLite emulator');
  }

  // Get all data for debugging
  getAllData() {
    const result: any = {};
    this.tables.forEach((table, tableName) => {
      result[tableName] = table.data;
    });
    return result;
  }

  // Get table info
  getTableInfo(tableName: string) {
    const table = this.tables.get(tableName);
    if (!table) return null;
    return {
      name: table.name,
      schema: table.schema,
      rowCount: table.data.length
    };
  }
}

export const sqliteDB = new SQLiteEmulator();

// Auto-sync on initialization
sqliteDB.syncWithLocalStorage();

// Expose to global scope for debugging
(window as any).sqliteDB = sqliteDB;
