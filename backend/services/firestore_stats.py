import sqlite3
import pandas as pd
from datetime import datetime, timedelta
'''
Provides functionality for creating/updating/displaying tables to keep track of 
firestore stats using sqlite3

The following tables are created when the module is loaded:
- reads
- writes
- deletes


In each table, (user_id, date_id) is a primary key and date_id is the 
number of days since 01/01/1970.
'''

def create_tables():
    '''Creates reads, writes, and deletes tables if they do not exist'''
    conn = sqlite3.connect('firestore_stats.db')
    cursor = conn.cursor()

    # Create a tables (if they don't exist)    
    for t in ['reads', 'writes', 'deletes'] :
        cursor.execute(f'''
        CREATE TABLE IF NOT EXISTS {t} (
            user_id INTEGER, 
            date_id DEFAULT (CAST(julianday('now') - julianday('1970-01-01') AS INTEGER)),
            number INTEGER,
            PRIMARY KEY (user_id, date_id)
        )
        ''')

    conn.commit()
    conn.close()

def increase_number(table, user_id, amount):
    '''Increases the 'number' column of 'table' by 'amount' 
       for current (user_id, date_id)
    '''
    conn = sqlite3.connect('firestore_stats.db')
    cursor = conn.cursor()

   # Insert the amount, or increment if (user_id, date_id) exists
    cursor.execute(f"""
        INSERT INTO {table} (user_id, date_id, number)
        VALUES ('{user_id}',
            CAST(julianday('now') - julianday('1970-01-01') AS INTEGER), {amount}
        )
        ON CONFLICT(user_id, date_id) DO UPDATE SET number = number + {amount}
    """)

    conn.commit()
    conn.close()


def increase_number_reads(user_id, amount) :
    '''Increases the number of reads'''
    increase_number('reads', user_id, amount)

def increase_number_writes(user_id, amount) :
    '''Increases the number of writes'''
    increase_number('writes', user_id, amount)

def increase_number_deletes(user_id, amount) :
    '''Increases the number of deletes'''
    increase_number('deletes', user_id, amount)


# TO DO: limit to current date?
def get_table(table, user_id = None, today = False):
    '''Returns a pandas data frame of all rows of 'table' '''
    conn = sqlite3.connect("firestore_stats.db")
    cursor = conn.cursor()

    qry = f"SELECT * FROM {table}"

    if today :

        t = datetime.now() - datetime(1970,1,1)    # calculate date_id

        if user_id :
            qry += f""" WHERE user_id = '{user_id}' AND date_id = {t.days}"""
        
        else :
            qry += f""" WHERE date_id = {t.days}"""

    elif user_id :
        qry += f""" WHERE user_id = '{user_id}'"""

    cursor.execute(qry)
    rows = cursor.fetchall()

    # Get column names from the cursor
    columns = [desc[0] for desc in cursor.description]

    # Convert to DataFrame
    df = pd.DataFrame(rows, columns=columns)
    if len(rows) == 0 :
        return df
    
    df['date_id'] = pd.to_datetime(df['date_id'], origin='1970-01-01', unit='D')
    return df

def get_reads(user_id = None, today = False) :
    return get_table('reads', user_id, today)

def get_writes(user_id = None, today = False) :
    return get_table('writes', user_id, today)

def get_deletes(user_id = None, today = False) :
    return get_table('deletes', user_id, today)


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

def delete_specifed_days_old(days):
    '''Deletes all records older than 'days' days old '''
    conn = sqlite3.connect('firestore_stats.db')
    cur = conn.cursor()

    threshold_date_id = (datetime.now() - datetime(1970,1,1)).days - days
    for table in ['reads', 'writes', 'deletes']:
        cur.execute(f"DELETE FROM {table} WHERE date_id <= ?", (threshold_date_id,))

    conn.commit()
    conn.close()


def delete_user_records(user_id):
    '''Deletes all records for a specific user_id
     Args:
        user_id: the user_id to delete records fors
    '''

    conn = sqlite3.connect('firestore_stats.db')
    cur = conn.cursor()
    
    for table in ['reads', 'writes', 'deletes']:
        cur.execute(f"DELETE FROM {table} WHERE user_id = ?", (user_id,))
    conn.commit()
    conn.close()

def summarize_tables(byUser = False):
    '''
    Returns pandas data frame of number of reads, writes, and deletes.
    If 'byUser' is True, then show stats for each user
    '''

    # get reads, writes, and deletes
    a = get_reads()
    a= a.rename(columns = {'number': 'num_reads'})

    b = get_writes()
    b = b.rename(columns = {'number': 'num_writes'})

    c = get_deletes()
    c = c.rename(columns = {'number': 'num_deletes'})

    # merge results
    tmp = a.merge(b, how = 'outer', on = ['user_id', 'date_id'])
    final = tmp.merge(c, how = 'outer', on = ['user_id', 'date_id'])
    final = final.reindex(columns = ['user_id', 'date_id', 'num_reads', 'num_writes' ,'num_deletes'])
    final = final.dropna(how = 'all').fillna(0)

    if not byUser :
        return final.drop('user_id', axis = 1).groupby('date_id', as_index = False).sum()

    return final

def summarize_specifed_days_old(days, byUser = False):
    '''Returns pandas data frame of number of reads, writes, and deletes
    Args:
        days: number of days old to include
        byUser: if True, then show stats for each user
    '''
    df = summarize_tables(byUser = byUser)
    df['date_id'] = pd.to_datetime(df['date_id'])

    # Define the cutoff date 
    cutoff_date = datetime.now() - timedelta(days)

    # Filter the DataFrame
    filtered_df = df[df['date_id'] >= cutoff_date]
    return filtered_df



