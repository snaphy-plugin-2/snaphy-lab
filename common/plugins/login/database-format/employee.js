module.exports = function(Employee) {
	Employee.validatesUniquenessOf('username');
	Employee.validatesUniquenessOf('email');
};