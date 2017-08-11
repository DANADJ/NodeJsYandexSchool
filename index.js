const MyForm = (function () {

	/**
	 *
	 */
	const Ids = {
		myFormId: '#myForm',
		fioInputId: '#fioInput',
		emailInputId: '#emailInput',
		phoneInputId: '#phoneInput',
		submitButtonId: '#submitButton',
	};


	/**
	 *
	 */
	const propertiesNames = {
		fio: 'fio',
		email: 'email',
		phone: 'phone',
	};


	/**
	 *
	 */
	let elements = {
		myForm: null,
		[propertiesNames.fio]: null,
		[propertiesNames.email]: null,
		[propertiesNames.phone]: null,
		submitButton: null,
	};


	/**
	 *
	 */
	function initElements() {
		elements.myForm = document.querySelector(Ids.myFormId);
		elements[propertiesNames.fio] = document.querySelector(Ids.fioInputId);
		elements[propertiesNames.email] = document.querySelector(Ids.emailInputId);
		elements[propertiesNames.phone] = document.querySelector(Ids.phoneInputId);
		elements.submitButton = document.querySelector(Ids.submitButtonId);
	}


	function validateFio(fioDataString) {

		let strings = fioDataString.trim().split(' ').filter(item => item),
			valid = strings.length == 3;

		if (valid) {

			valid = strings.join('').split('').every(symbol => /[a-zа-яё]/i.test(symbol));

		}

		return valid;

	}

	function validateEmail(emailDataString) {

		let valid = emailDataString.split('@').length === 2;

		if (valid) {

			valid = /.+?@ya.ru|.+?@yandex.ru|.+?@yandex.ua|.+?@yandex.by|.+?@yandex.kz|.+?@yandex.com./i.test(emailDataString);

		}

		return valid;

	}

	function validatePhone(phoneDataString) {
		return true;
	}


	/**
	 *
	 */
	function validate() {

		let validateResultObject = {
				isValid: true,
				errorFields: []
			},
			dataObject = getData();

		if(!validateFio(dataObject.fio)){
			validateResultObject.errorFields.push(propertiesNames.fio);
		}

		if(!validateEmail(dataObject.email)){
			validateResultObject.errorFields.push(propertiesNames.email);
		}

		if(!validatePhone(dataObject.phone)){
			validateResultObject.errorFields.push(propertiesNames.phone);
		}

		if(validateResultObject.errorFields.length){
			validateResultObject.isValid = false;
		}

		return validateResultObject;
	}


	/**
	 *
	 */
	function getData() {

		let dataObject = {};

		for (let propName in propertiesNames) {
			if (propertiesNames.hasOwnProperty(propName)) {
				dataObject[propName] = elements[propName].value;
			}
		}

		return dataObject;
	}


	/**
	 *
	 */
	function setData(dataObject) {

		for (let propName in propertiesNames) {
			if (propertiesNames.hasOwnProperty(propName)) {
				elements[propName].value = dataObject[propName];
			}
		}
	}


	/**
	 *
	 */
	function submit() {
		let validateResult = validate();

		if (validateResult.isValid) {
			return;
		}

		event.preventDefault();
	}


	/**
	 *
	 */
	document.addEventListener('DOMContentLoaded', () => {

		initElements();
		elements.myForm.addEventListener('submit', event => {
			submit(event);
		});

		let dataObject = {
			fio: 'Гордиенко Валентин Валентинович',
			email: 'danadj@yandex.ru',
			phone: '+7(952)277-59-51'
		};

		setData(dataObject);
		// setTimeout(()=>{console.log(getData())}, 5000);

	});


	return {
		validate,
		getData,
		setData,
		submit,
	};

})();
