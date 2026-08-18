CREATE TABLE Transactions (
	TransactionID INT not null primary key identity(1,1),
	TransactionType TINYINT not null,
	Amount DECIMAL(18,2) not null,
	BalanceAfter DECIMAL(18,2) not null,
	Status TINYINT not null,
	Reference NVARCHAR(100) not null UNIQUE,
	AccountID INT not null,
	RelatedAccountID INT null,
	CreatedAt DATETIME not null default GETDATE(),
	UpdatedAt DATETIME not null default GETDATE(),
	FOREIGN KEY (AccountID)
        REFERENCES Accounts(AccountID),
	FOREIGN KEY (RelatedAccountID)
		REFERENCES Accounts(AccountID)
)