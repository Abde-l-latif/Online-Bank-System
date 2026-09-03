CREATE TABLE Cards
(
    CardID INT IDENTITY(1,1) PRIMARY KEY,

    AccountID INT NOT NULL,

    CardNumber VARCHAR(16) NOT NULL,

    CardHolderName VARCHAR(100) NOT NULL,

    ExpirationDate DATETIME2 NOT NULL,

    CardType TINYINT NOT NULL, -- 0 = Debit, 1 = Credit

    CardBrand TINYINT NOT NULL, -- 0 = Visa, 1 = Mastercard

    Status TINYINT NOT NULL, -- 0 = Active, 1 = Frozen, 2 = Blocked, 3 = Expired

    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Cards_Accounts
        FOREIGN KEY (AccountID)
        REFERENCES Accounts(AccountID),

    CONSTRAINT UQ_Cards_CardNumber
        UNIQUE (CardNumber)
);