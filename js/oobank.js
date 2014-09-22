(function(){

	// Object Bank
	function OOBank(){
		var accounts = new AccountMap();
		var idGenerator = new IdGenerator();
		
		this.createAccount = function(name, firstName){
			var user = new User(name, firstName);
			var id =  idGenerator.getNewId();
			var account = new Account(user, id);
			accounts.push(id, account);
			return account;
		};
		
		this.transfer = function(idSrc, idDst, amount){
			var src = accounts.get(idSrc);
			var dst = accounts.get(idDst);
			src.withdraw(amount);
			dst.deposit(amount);
		}
	}
	
	// Object IdGenerator
	function IdGenerator(){
		var id = 0;
		this.getNewId = function(){
			id++;
			return id;
		}
	}
	
	// Object AccountMap
	function AccountMap(){
		var accounts = {};
		this.push = function(id, account){
			accounts[id] = account;
		}
		
		this.get = function(id){
			return accounts[id];
		}
	}
	
	// Object User
	function User(name, firstName){
		this.name = name;
		this.firstName = firstName;
	}
	
	// Object Account
	function Account(user, id){
		this.user = user;
		this.id = id;
		this.statements = new Statements();
		var value = 0;
		
		this.deposit = function(money){
			value = this.statements.addOperation(money, value);
		}
		
		this.withdraw = function(money){
			value = this.statements.addOperation(-1*money, value);
		}
		
		this.getCurrent = function(){
			return value;
		}
	}
	
	// Object Statements
	function Statements(){
		var operations = [];
		
		this.addOperation = function(amount, balance){
			var newBalance = balance + amount;
			operations.push(new Operation(amount, newBalance));
			return newBalance;
		}
		
		this.getHistory = function(){
			return operations;
		}
		
		this.filterHistory = function(minDate, maxDate, minAmount, maxAmount){
			var sub = [];
			for(var i=0; i<operations.length; i++){
				if (operations[i].isBetweenDate(minDate, maxDate) && operations[i].isBetweenAmount(minAmount, maxAmount))
				{
					sub.push(operations[i]);
				}
			}
			return sub;
		}
		
		this.print = function(){
			for(var i=0; i<operations.length; i++){
				console.log(operations[i].print());
			}
		}
	}
	
	// Object Operation
	function Operation(amount, balance){
		this.date = new Date();
		this.amount = amount;
		this.balance = balance;
		
		this.isBetweenDate = function(minDate, maxDate){
			var isOk = true;
			if (minDate != undefined && this.date < minDate){
				isOk = false;
			}
			if (maxDate != undefined && this.date > maxDate){
				isOk = false;
			}
			return isOk;
		};
		
		this.isBetweenAmount = function(minAmount, maxAmount){
			var isOk = true;
			if (minAmount != undefined && this.amount < minAmount){
				isOk = false;
			}
			if (maxAmount != undefined && this.amount > maxAmount){
				isOk = false;
			}
			return isOk;
		}
	}
	
	Operation.prototype.print = function(){
		return this.date.getFullYear() + "/" + (this.date.getMonth()+1) + "/" + this.date.getDate() + "    " + this.amount + "    " + this.balance;
	}
	
	window.OOBank = OOBank;
})();