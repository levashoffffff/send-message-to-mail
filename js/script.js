//Проверка на то что документ загружен
document.addEventListener('DOMContentLoaded', function () {
    //Вытаскиваем форму. Идея перехватить форму и затем выполнять с ней манипуляции в js
    const form = document.getElementById('form');
    //При отправки формы необходимо перейти в функцию formSend
    form.addEventListener('submit', formSend);

    async function formSend(e) {
        //Отменяем отправку формы (стандартное поведение)
        e.preventDefault();

        //Выполняем валидацию формы. В переменную попадает число, как результат работы функции formValidate
        let error = formValidate(form);

        //В переменную formData получаем все данные полей
        let formData = new FormData(form);

        //Добавляем в переменную formData изображение
        formData.append('image', formImage.files[0]);

        //Если число равно 0, т.е ошибок валидации не было, то все ОК
        if (error === 0) {
            form.classList.add('_sending');
            //В переменную ждем выполнения отправки методом POST, в body содержится все данные формы. sendmail.php возвращает json Ответ
            let response = await fetch('sendmail.php', {
                method: 'POST',
                body: formData
            });
            //Если запрос успешный
            if (response.ok) {
                //Получаем в переменную ответ
                let result = await response.json();
                alert(result.message);
                //После отправки формы чистим ёё
                formPreview.innerHTML = '';
                form.reset();
                form.classList.remove('_sending');
            } else {
                alert('Ошибка');
                form.classList.remove('_sending');
            }
        }
        //Если были ошибки валидации, то число отличное от нуля
        else {
            alert('Заполните обязательное поля');
        }
    }

    //Функция проверки на заполнение
    function formValidate(form) {
        let error = 0;
        let formReq = document.querySelectorAll('._req');

        //Перебираем все элементы с классом _req
        for (let index = 0; index < formReq.length; index++) {
            const input = formReq[index];
            //Изначально удаляем класс _error
            formRemoveError(input);

            //Если Input содержит класс _email
            if (input.classList.contains('_email')) {
                //Если проверка не прошла
                if (emailTest(input)) {
                    //Добавляем класс _error
                    formAddError(input);
                    //Увеличиваем переменную
                    error++;
                }
            }
            //Проверяем наличие чекбокса
            else if (input.getAttribute("type") === "checkbox" && input.checked === false) {
                formAddError(input);
                error++;
            }
            //Проверка заполнено ли поле вообще
            else {
                if (input.value === '') {
                    formAddError(input);
                    error++;
                }
            }
        }
        //Возвращаем error (числовое значение)
        return error;
    }

    //Функция добавления класса _error (элементу и родителю)
    function formAddError(input) {
        input.parentElement.classList.add('_error');
        input.classList.add('_error');
    }

    //Функция удаления класса _error (элементу и родителю)
    function formRemoveError(input) {
        input.parentElement.classList.remove('_error');
        input.classList.remove('_error');
    }

    //Функция проверки соответствия заполнения поля email (регулярное выражение)
    function emailTest(input) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
    }

    //Получаем инпут file в переменную
    const formImage = document.getElementById('formImage');
    //Получаем div для превью в переменную
    const formPreview = document.getElementById('formPreview');
    //Слушаем изменения в инпуте file
    formImage.addEventListener('change', () => {
        //Передаем в функцию файл
        uploadFile(formImage.files[0]);
    })

    function uploadFile(file) {
        //проверяем тип файла
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
            alert('Разрешены только изображения.');
            formImage.value = '';
            return;
        }
        //проверим размер файла (<2 мб)
        if (file.size > 2 * 1024 * 1024) {
            alert('Файл должен быть менее 2 МБ.');
            return;
        }
        //Выводим файл в preview
        var reader = new FileReader();
        //Когда файл успешно загружен, формируем изображение, Src = результат загрузки файла. Помещаем внутрь div#formPreview
        reader.onload = function (e) {
            formPreview.innerHTML = `<img src="${e.target.result}" alt="Фото">`;
        };
        //Если ошибка
        reader.onerror = function (e) {
            alert('Ошибка');
        };
        reader.readAsDataURL(file);
    }

});