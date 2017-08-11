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
	const Classes = {
		error: 'error',
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


	/**
	 *
	 */
	function validateFio(fioDataString) {

		let valid = !!fioDataString.toString().length;

		if(valid){
			valid = /^(?:(?:[a-z]+ ){2}[a-z]+|(?:[а-яё]+ ){2}[а-яё]+)$/i.test(fioDataString);
		}

		return valid;

	}


	/**
	 *
	 */
	function validateEmail(emailDataString) {

		let valid = !!emailDataString.toString().length;

		if (valid) {

			valid = /^(?:[^@ "]+?|"[^"]+")@(?:ya.ru|yandex.ru|yandex.ua|yandex.by|yandex.kz|yandex.com)$/i.test(emailDataString);

		}

		return valid;

	}


	/**
	 *
	 */
	function validatePhone(phoneDataString) {

		let valid = !!phoneDataString.toString().length;

		if (valid) {

			valid = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(phoneDataString);

		}

		if (valid) {

			valid = phoneDataString.match(/\d/g).reduce((previousValue, currentValue) => +previousValue + +currentValue) <= 30;

		}

		return valid;
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

		if (!validateFio(dataObject.fio)) {
			validateResultObject.errorFields.push(propertiesNames.fio);
		}

		if (!validateEmail(dataObject.email)) {
			validateResultObject.errorFields.push(propertiesNames.email);
		}

		if (!validatePhone(dataObject.phone)) {
			validateResultObject.errorFields.push(propertiesNames.phone);
		}

		if (validateResultObject.errorFields.length) {
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
				dataObject[propName] = elements[propName].value.trim();
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
	function inputCallback(event) {
		let currentElement = event.target;

		currentElement.classList.remove(Classes.error);

		currentElement.removeEventListener('input', inputCallback);
	}


	/**
	 *
	 */
	function markWrong(errorFieldsArray) {

		errorFieldsArray.forEach(fieldName => {

			let fieldElement = elements[fieldName];

			if (!fieldElement.classList.contains(Classes.error)) {

				fieldElement.classList.add(Classes.error);

			}

			fieldElement.addEventListener('input', inputCallback);

		});
	}


	/**
	 *
	 */
	function submit(event) {
		let validateResult = validate();

		console.log(validateResult);

		if (!validateResult.isValid) {

			markWrong(validateResult.errorFields);

			event.preventDefault();
			return;
		}

		event.preventDefault();
		return;
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
			phone: '+7(952)111-11-00'
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
