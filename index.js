const MyForm = (function (Document) {

	// let counter = 0;

	/**
	 * Идентификаторы элементов используемых на странице
	 */
	const Ids = {
		myFormId: '#myForm',
		fioInputId: '#fioInput',
		emailInputId: '#emailInput',
		phoneInputId: '#phoneInput',
		submitButtonId: '#submitButton',
		resultContainerId: '#resultContainer',
	};


	/**
	 * Классы динамически меняемые у элементов страницы
	 */
	const Classes = {
		success: 'success',
		error: 'error',
		progress: 'progress',
		submitButtonDisable: 'submit-button-disable',
		resultContainer: 'result-container'
	};


	/**
	 * Возможные варианты статуса в ответе сервера
	 */
	const ResponseStatuses = {
		success: 'success',
		error: 'error',
		progress: 'progress',
	};


	/**
	 * Названия свойств для объекта с данными формы
	 */
	const propertiesNames = {
		fio: 'fio',
		email: 'email',
		phone: 'phone',
	};


	/**
	 * Карта объектов страницы
	 */
	let elements = {
		myForm: null,
		[propertiesNames.fio]: null,
		[propertiesNames.email]: null,
		[propertiesNames.phone]: null,
		submitButton: null,
		resultContainer: null,
	};


	/**
	 * @description - Функция находит на странице все нужные для работы элементы и сохраняет их в объекте "elements"
	 * @function initElements
	 */
	function initElements() {
		elements.myForm = document.querySelector(Ids.myFormId);
		elements[propertiesNames.fio] = document.querySelector(Ids.fioInputId);
		elements[propertiesNames.email] = document.querySelector(Ids.emailInputId);
		elements[propertiesNames.phone] = document.querySelector(Ids.phoneInputId);
		elements.submitButton = document.querySelector(Ids.submitButtonId);
		elements.resultContainer = document.querySelector(Ids.resultContainerId);
	}


	/**
	 * @description - Функция проводит валидацию поля для ввода Ф.И.О
	 * @function validateFio
	 * @param {string} fioDataString - Строка полученная из поля Ф.И.О
	 * @return {boolean} valid - Булев параметр обозначающий пройдена ли валидация
	 */
	function validateFio(fioDataString) {

		let valid = !!fioDataString.toString().length;

		if (valid) {
			valid = /^(?:(?:[a-z]+ ){2}[a-z]+|(?:[а-яё]+ ){2}[а-яё]+)$/i.test(fioDataString);
		}

		return valid;

	}


	/**
	 * @description - Функция проводит валидацию поля для ввода Email
	 * @function validateEmail
	 * @param {string} emailDataString - Строка полученная из поля Email
	 * @return {boolean} valid - Булев параметр обозначающий пройдена ли валидация
	 */
	function validateEmail(emailDataString) {

		let valid = !!emailDataString.toString().length;

		if (valid) {

			valid = /^(?:[^@ "]+?|"[^"]+")@(?:ya.ru|yandex.ru|yandex.ua|yandex.by|yandex.kz|yandex.com)$/i.test(emailDataString);

		}

		return valid;

	}


	/**
	 * @description - Функция проводит валидацию поля для ввода Phone
	 * @function validatePhone
	 * @param {string} phoneDataString - Строка полученная из поля Phone
	 * @return {boolean} valid - Булев параметр обозначающий пройдена ли валидация
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
	 * @description - Функция проводит валидацию всех полей формы.
	 * @function validate
	 * @return {object} validateResultObject - Объект с результатами валидации
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
	 * @description - Функция собирает данные из полей формы в объект и возвращает его
	 * @function getData
	 * @return {object} dataObject - Объект с данными из полей формы
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
	 * @description - Функция принимает оъект с даннми для полей формы и устанавливает эти данные в соответствующие поля
	 * @function setData
	 */
	function setData(dataObject) {

		for (let propName in propertiesNames) {
			if (propertiesNames.hasOwnProperty(propName)) {
				if (dataObject.hasOwnProperty(propName)) {
					if (typeof dataObject[propName] === typeof '') {
						elements[propName].value = dataObject[propName].toString();
					}
				}
			}
		}
	}


	/**
	 * @description - Коллбэк выполняется во время первого ввода данных в поле не прошедшее валидацию
	 * @callback inputCallback
	 * @param {object} event - Объект события ввода данных в поле формы
	 */
	function inputCallback(event) {
		let currentElement = event.target;

		currentElement.classList.remove(Classes.error);

		currentElement.removeEventListener('input', inputCallback);
	}


	/**
	 * @description - Функция выставляет класс "error" и привязывает обработчик события "inputCallback" всем полям не прошедшим валидацию
	 * @function markWrong
	 * @param {string[]} errorFieldsArray -  Массив со строками-именами полей не прошедших валидацию
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
	 * @description - Функция удаляет класс "error" всем полям прошедшим валидацию
	 * @function unMarkWrong
	 */
	function unMarkWrong() {

		for (let fieldName in propertiesNames) {
			let fieldElement = elements[fieldName];

			if (fieldElement.classList.contains(Classes.error)) {

				fieldElement.classList.remove(Classes.error);

			}
		}
	}


	/**
	 * @description - функция устанавливает класс принятый через аргумент блоку "resultContainer"
	 * @function addClassToResultContainer
	 */
	function addClassToResultContainer(className) {
		elements.resultContainer.classList.remove(Classes.success);
		elements.resultContainer.classList.remove(Classes.error);
		elements.resultContainer.classList.remove(Classes.progress);

		elements.resultContainer.classList.add(className);
	}


	/**
	 * @description - Коллбэк вызываемый при статусе ответа сервера "success". Выставляет соответствующий класс и модержимое блоку "resultContainer"
	 * @callback successResponseCallback
	 */
	function successResponseCallback() {
		addClassToResultContainer(Classes.success);

		elements.resultContainer.innerHTML = 'Success';
	}

	/**
	 * @description - Коллбэк вызываемый при статусе ответа сервера "error". Выставляет соответствующий класс и модержимое блоку "resultContainer"
	 * @callback errorResponseCallback
	 */
	function errorResponseCallback(responseObject) {
		addClassToResultContainer(Classes.error);

		elements.resultContainer.innerHTML = responseObject.reason;
	}


	/**
	 * @description - Коллбэк вызываемый при статусе ответа сервера "progress". Выставляет соответствующий класс и модержимое блоку "resultContainer"
	 * @callback progressResponseCallback
	 */
	function progressResponseCallback(responseObject) {
		addClassToResultContainer(Classes.progress);

		elements.resultContainer.innerHTML = 'Progress...';

		/*	if (counter <= 3) {
		 counter++;
		 console.log(counter);*/
		setTimeout(serverRequest, responseObject.timeout);
		/*} else {
		 successResponseCallback();
		 }*/
	}


	/**
	 * @description - Коллбэк вызываемый при получении ответа от сервера. Запускает соответствующую ответу функцию обработки блока "resultContainer"
	 * @callback serverResponseCallback
	 */
	function serverResponseCallback() {

		if (this.response && this.response.status) {
			let responseObject = this.response,
				responseStatus = responseObject.status;

			if (responseStatus === ResponseStatuses.success) {

				successResponseCallback();

			} else if (responseStatus === ResponseStatuses.error) {

				errorResponseCallback(responseObject);

			} else if (responseStatus === ResponseStatuses.progress) {

				progressResponseCallback(responseObject);

			}
		}
	}


	/**
	 * @description - Функция создаёт и настраивает XHR объект запроса к серверу
	 * @function serverRequest
	 * @return {object} xhr - XHR объект запроса к серверу
	 */
	function serverRequest() {

		let xhr = new XMLHttpRequest();
		xhr.open('post', elements.myForm.action, true);
		xhr.responseType = "json";
		xhr.onload = serverResponseCallback;
		xhr.send();

	}


	/**
	 * @description - Функция блокирует кнопку отправки данных формы
	 * @function blockSubmitbutton
	 */
	function blockSubmitbutton() {
		elements.submitButton.disabled = true;
		if (!elements.submitButton.classList.contains(Classes.submitButtonDisable)) {
			elements.submitButton.classList.add(Classes.submitButtonDisable);
		}
	}


	/**
	 *
	 */
	function resetResultContainer() {

		if (elements.resultContainer.classList.length > 1) {
			elements.resultContainer.className = Classes.resultContainer;
		}

		if (elements.resultContainer.innerHTML) {
			elements.resultContainer.innerHTML = '';
		}
	}


	/**
	 * @description - Функция обрабатывает попытки отправки данных из формы
	 * @function submit
	 */
	function submit() {

		resetResultContainer();

		let validateResult = validate();

		if (!validateResult.isValid) {

			markWrong(validateResult.errorFields);

		} else {

			unMarkWrong();

			blockSubmitbutton();

			serverRequest();
		}

	}


	/**
	 * Действия запускающиеся после полной загруз DOM дерева
	 */
	Document.addEventListener('DOMContentLoaded', () => {

		/**
		 * Инициализация элементов страницы
		 */
		initElements();


		/**
		 * Добавление обработчика события "submit" для формы
		 */
		elements.submitButton.addEventListener('click', event => {
			submit(event);
		});

		/*let dataObject = {
			fio: 'Гордиенко Валентин Валентинович',
			email: 'danadj@yandex.ru',
			phone: '+7(952)111-11-00',
			home: 'asdad'
		};

		setData(dataObject);*/
	});


	/**
	 * Методы объекта MyForm доступного в глобальной области видимости
	 */
	return {
		validate,
		getData,
		setData,
		submit,
	};

})(document);
