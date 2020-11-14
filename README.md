# MySQL Practice

https://mysql.sambcit.xyz

A site for playing around with a MySQL Database. Specifically for testing out [MVCC](https://sammeechward.com/concurrency-control/) with transactions.

---

## Example usage

MySQL, and most relational database management systems, implement MVCC using transactions. Let's setup a database to look at an example of this.


> Run the following code in one of the sessions to setup a new bank database with an accounts table:

```sql
CREATE TABLE accounts (
  id integer PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255),
  balance DECIMAL(10,2)
);

INSERT INTO accounts (`name`, balance)
VALUES
('Sam', 100),
('Patrick', 100);
```

Running `SELECT * FROM accounts;` should return the following results.

```sql
+----+---------+---------+
| id | name    | balance |
+----+---------+---------+
|  1 | Sam     |  100.00 |
|  2 | Patrick |  100.00 |
+----+---------+---------+
```

## Transfer Money

If we wanted to perform a $10 transfer from Sam to Patrick, we could run the following code:

```sql
UPDATE accounts SET balance = balance - 10 WHERE id = 1;
UPDATE accounts SET balance = balance + 10 WHERE id = 2;
```

Which, if successful, would result in this outcome:

```sql
+----+---------+---------+
| id | name    | balance |
+----+---------+---------+
|  1 | Sam     |   90.00 |
|  2 | Patrick |  110.00 |
+----+---------+---------+
```

By default, every statement is it's own transaction. Every statement by itself is **atomic**, but the entire transfer is not **atomic**. This makes it possible for one of the transactions to succeed while the other one fails. So we might end up taking $10 from Sam and never giving it to patrick.

What we need to do is make the entire transfer **atomic**, so that it's "all or nothing". Either everything happens or nothing happens. So instead of each statement being its own transaction, we need a single transaction that contains both statements.

```sql
START TRANSACTION;
UPDATE accounts SET balance = balance - 10 WHERE id = 1;
UPDATE accounts SET balance = balance + 10 WHERE id = 2;
COMMIT;
```

> Before continuing, make sure the balances are set back to 100:

```sql
UPDATE accounts SET balance = 100;
```

## Transaction and MVCC

> In the first session, do the same transaction again, but **don't commit the transaction:**

```sql
START TRANSACTION;
UPDATE accounts SET balance = balance - 10 WHERE id = 1;
UPDATE accounts SET balance = balance + 10 WHERE id = 2;
```

> In both sessions, run `SELECT * FROM accounts;`


What's the difference between the outputs?

Outside of the transaction, the values should still be `100`, but inside the transaction, the values should have changed. Until the transaction commits or rolls back, there are multiple versions of the data, the new uncommitted data, and the old committed data. 


> Click the **Get Transaction Details** button which will run the equivalent of the following statement on the database: 

```sql
SELECT trx_id, trx_state, trx_started, trx_isolation_level FROM information_schema.INNODB_TRX;
```

This will show all of the current transactions in the database. Take note of the `trx_isolation_level`.


> In the first session, roll back the transaction `ROLLBACK;` and run `SELECT * FROM accounts;` again. 


What are the values now?

---

## How this site works

## Front-End

The front end is a basic javascript app that connects to a node server and sends sql commands. Is uses a small amount of jQuery but the app itself is tiny.

## Back-End

The back end is a node app that waits for a web socket connection from a client then creates a new database for that client. The database is then deleted when the client disconnects. While the socket connection is still active, the client is able to send and sql comments to the server for the server to run against a MySQL database.
