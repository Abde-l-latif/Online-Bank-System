create database OnlineBankDb;

create table Roles (
	RoleID int primary key identity(1,1),
	RoleName nvarchar(50) not null,
);

create table Addresses (
	AddressID int primary key identity(1,1),
	Country nvarchar(30) not null,
	City nvarchar(30) not null,
	Street nvarchar(30) not null,
	PostalCode nvarchar(30) not null,
);

create table Customers (
	CustomerID int primary key identity(1,1),
	FirstName nvarchar(30) not null,
	LastName nvarchar(30) not null,
	BirthDate DateTime2 not null,
	Status tinyint not null,
	PhoneNumber nvarchar(15) not null,
	AddressID int not null,
	NationalId nvarchar(20) not null,
	CreatedAt DateTime2 not null default getdate(),
	UpdatedAt DateTime2 not null default getdate(),
	foreign key (AddressID) references Addresses(AddressID),
);

EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'0-pending, 1-active, 2-suspended, 3-closed', 
    @level0type = N'SCHEMA', @level0name = N'dbo', 
    @level1type = N'TABLE',  @level1name = N'Customers', 
    @level2type = N'COLUMN', @level2name = N'Status';

create table Accounts (
	AccountID int primary key identity(1,1),
	AccountNumber nvarchar(34) not null,
	AccountBalance DECIMAL(18,2) not null,
	AccountType tinyint not null,
	AccountStatus tinyint not null,
	CustomerID int not null,
	CreatedAt DateTime2 not null default getdate(),
	UpdatedAt DateTime2 not null default getdate(),
	foreign key (CustomerID) references Customers(CustomerID),
);

EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'0-checking, 1-saving', 
    @level0type = N'SCHEMA', @level0name = N'dbo', 
    @level1type = N'TABLE',  @level1name = N'Accounts', 
    @level2type = N'COLUMN', @level2name = N'AccountType';

EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'0-active, 1-frozen, 2-closed', 
    @level0type = N'SCHEMA', @level0name = N'dbo', 
    @level1type = N'TABLE',  @level1name = N'Accounts', 
    @level2type = N'COLUMN', @level2name = N'AccountStatus';


create table Users (
	UserID int primary key identity(1,1),
	EmailAddress nvarchar(254) not null,
	HashPassword nvarchar(255) not null,
	IsActive BIT not null,
	LastLogin DateTime2 null,
	CustomerID int not null,
	RoleID int not null,
	CreatedAt DateTime2 not null default getdate(),
	UpdatedAt DateTime2 not null default getdate(),
	foreign key (CustomerID) references Customers(CustomerID),
	foreign key (RoleID) references Roles(RoleID)
);

alter table Users add constraint UQ_Users_EmailAddress unique (EmailAddress);
alter table Customers add constraint UQ_Customers_NationalId unique (NationalId);