describe("oobank", function () {
	var oobank = null;
	
	beforeEach(function(){
		oobank = new OOBank();
	});
		
    it("should add new account to oobank", function () {
		var account = oobank.createAccount("nom", "prenom");
		expect(account).toBeDefined();
		expect(account.user.name).toBe("nom");
		expect(account.user.firstName).toBe("prenom");
    });
	
	it("should deposit money on account", function(){
		var account = oobank.createAccount("nom", "prenom");
		account.deposit(1000);
		expect(account.getCurrent()).toBe(1000);
		
		account.deposit(1000);
		expect(account.getCurrent()).toBe(2000);
	});
	
	it("should withdraw money from account", function(){
		var account = oobank.createAccount("nom", "prenom");
		account.deposit(1000);
		
		account.withdraw(100);
		expect(account.getCurrent()).toBe(900);
	});
	
	it("should transfer money between accounts", function(){
		var accountA = oobank.createAccount("nom", "prenom");
		var accountB = oobank.createAccount("nom", "prenom");
		
		accountA.deposit(1000);
		expect(accountB.getCurrent()).toBe(0);
		oobank.transfer(accountA.id, accountB.id, 1000);
		expect(accountB.getCurrent()).toBe(1000);
	});
	
	it("should give operations on a account", function(){
		var account = oobank.createAccount("nom", "prenom");
		
		var oldDate = Date;
		Date = function(){
			return new oldDate(2014,8,22);
		}
		
		account.deposit(1000);
		
		Date = function(){
			return new oldDate(2014,8,23);
		}
		account.withdraw(100);
		
		Date = oldDate;
		
		var history = account.statements.getHistory();
		expect(history.length).toBe(2);
		expect(history[0].date).toEqual(new Date(2014,8,22));
		expect(history[1].date).toEqual(new Date(2014,8,23));
		
		expect(history[0].amount).toBe(1000);
		expect(history[0].balance).toBe(1000);
		
		expect(history[1].amount).toBe(-100);
		expect(history[1].balance).toBe(900);
	});
	
	it("should print operation to console", function(){
		var account = oobank.createAccount("nom", "prenom");
		
		var oldDate = Date;
		Date = function(){
			return new oldDate(2014,8,22);
		}
		
		account.deposit(1000);
		
		Date = function(){
			return new oldDate(2014,8,23);
		}
		account.withdraw(100);
		
		Date = oldDate;
		
		var history = account.statements.print();
	});
	
	
	
	it("should filter operation on dates", function(){
		var account = oobank.createAccount("nom", "prenom");
		
		var oldDate = Date;
		Date = function(){
			return new oldDate(2013,8,22);
		}
		
		account.deposit(1000);
		
		Date = function(){
			return new oldDate(2014,8,23);
		}
		account.withdraw(100);
		
		Date = oldDate;
		
		var history = account.statements.filterHistory(new Date(2013,0,1), new Date(2014,0,1));
		expect(history.length).toBe(1);
	});
	
	
	
	it("should filter operation on amounts", function(){
		var account = oobank.createAccount("nom", "prenom");
		
		account.deposit(1000);
		
		account.withdraw(100);
		account.withdraw(540);
		account.withdraw(1540);
		
		var history = account.statements.filterHistory(null, null, -650, 0);
		expect(history.length).toBe(2);
	});
});
