import psycopg2

# Update these with your actual DB credentials
DB_NAME = 'clinic'
DB_USER = 'postgres'
DB_PASSWORD = 'your_password'
DB_HOST = 'localhost'
DB_PORT = '5432'

def add_columns():
    conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT)
    cur = conn.cursor()
    try:
        cur.execute("""
            ALTER TABLE slider_images ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;
        """)
        cur.execute("""
            ALTER TABLE slider_images ADD COLUMN IF NOT EXISTS created_at TIMESTAMP;
        """)
        conn.commit()
        print('Columns added or already exist.')
    except Exception as e:
        print('Error:', e)
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    add_columns() 