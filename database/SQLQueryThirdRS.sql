select * from Cards

select * from Accounts

select * from Customers

ALTER TABLE Cards 
ADD UpdatedAt VARCHAR(50) NOT NULL;

insert into Cards (AccountID, CardNumber, CardHolderName, ExpirationDate, CardType, CardBrand, Status, CreatedAt, UpdatedAt) 
values (4, '3521532641458415', 'koko', DATEADD(year, 10, GETDATE()), 1, 1, 0, GETDATE(), GETDATE()) ;


SELECT *
    FROM Cards
WHERE AccountID in (select AccountID from Accounts where CustomerID = 1011);