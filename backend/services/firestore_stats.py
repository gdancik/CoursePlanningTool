import sqlite3
import pandas as pd

'''
Provides functionality for creating/updating/displaying tables to keep track of 
firestore stats using sqlite3

The following tables are created when the module is loaded:
- reads
- writes
- deletes
'''

def create_tables():
    '''Creates reads, writes, and deletes tables if they do not exist'''
    conn = sqlite3.connect('firestore_stats.db')
    cursor = conn.cursor()

    # Create a tables (if they don't exist)    
    for t in ['reads', 'writes', 'deletes'] :
        cursor.execute(f'''
        CREATE TABLE IF NOT EXISTS {t} (
            date_id INTEGER PRIMARY KEY
                    DEFAULT (CAST(julianday('now') - julianday('1970-01-01') AS INTEGER)),
            number INTEGER
        )
        ''')


    conn.commit()
    conn.close()

def increase_number(table, amount):
    '''Increases the 'number' column of 'table' by 'amount' '''
    conn = sqlite3.connect('firestore_stats.db')
    cursor = conn.cursor()

   # Increment if exists, else insert with 1
    cursor.execute(f"""
        INSERT INTO {table} (date_id, number)
        VALUES (
            CAST(julianday('now') - julianday('1970-01-01') AS INTEGER), {amount}
        )
        ON CONFLICT(date_id) DO UPDATE SET number = number + {amount}
    """)

    conn.commit()
    conn.close()


def increase_number_reads(amount) :
    '''Increases the number of reads'''
    increase_number('reads', amount)

def increase_number_writes(amount) :
    '''Increases the number of writes'''
    increase_number('writes', amount)

def increase_number_deletes(amount) :
    '''Increases the number of deletes'''
    increase_number('deletes', amount)


# TO DO: limit to current date?
def get_table(table):
    '''Returns a pandas data frame of all rows of 'table' '''
    conn = sqlite3.connect("firestore_stats.db")
    cursor = conn.cursor()

    # Fetch all rows
    cursor.execute(f"SELECT * FROM {table}")
    rows = cursor.fetchall()

    # Get column names from the cursor
    columns = [desc[0] for desc in cursor.description]

    # Convert to DataFrame
    df = pd.DataFrame(rows, columns=columns)
    if len(rows) == 0 :
        return df
    
    df['date_id'] = pd.to_datetime(df['date_id'], origin='1970-01-01', unit='D')
    return df


def get_reads() :
    return get_table('reads')

def get_writes() :
    return get_table('writes')

def get_deletes() :
    return get_table('deletes')


def delete_all_tables():
    '''Deletes all tables from firestore_stats'''
    conn = sqlite3.connect("firestore_stats.db")
    cur = conn.cursor()

    # Get all table names
    cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cur.fetchall()

    # Drop each table
    for table_name in tables:
        cur.execute(f"DROP TABLE IF EXISTS {table_name[0]}")

    conn.commit()
    conn.close()


def summarize_tables():
    '''Returns pandas data frame of number of reads, writes, and deletes'''
    # get reads, writes, and deletes
    a = get_reads()
    a= a.rename(columns = {'number': 'num_reads'})

    b = get_writes()
    b = b.rename(columns = {'number': 'num_writes'})

    c = get_deletes()
    c = c.rename(columns = {'number': 'num_deletes'})

    # merge results
    tmp = a.merge(b, how = 'outer', on = 'date_id')
    final = tmp.merge(c, how = 'outer', on = 'date_id')
    final = final.reindex(columns = ['date_id', 'num_reads', 'num_writes' ,'num_deletes'])
    final = final.dropna(how = 'all').fillna(0)

    return final

